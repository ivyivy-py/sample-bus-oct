import { BusServiceArrivals, Occupancy, BusType } from '../types';
import { BUS_SERVICES_AT_SOMERSET } from '../data/transitData';

export interface LtaRawBus {
  OriginCode?: string;
  DestinationCode?: string;
  EstimatedArrival?: string;
  Latitude?: string;
  Longitude?: string;
  VisitNumber?: string;
  Load?: 'SEA' | 'SDA' | 'LSD' | string;
  Feature?: 'WAB' | string;
  Type?: 'SD' | 'DD' | 'BD' | string;
  Monitored?: number;
}

export interface LtaRawService {
  ServiceNo: string;
  Operator: string;
  NextBus?: LtaRawBus;
  NextBus2?: LtaRawBus;
  NextBus3?: LtaRawBus;
}

export interface LtaBusArrivalResponse {
  'odata.metadata'?: string;
  BusStopCode: string;
  Services: LtaRawService[];
  _meta?: {
    liveData?: boolean;
    source?: string;
    message?: string;
    timestamp?: string;
  };
}

function parseEta(estimatedArrival?: string): number | 'ARR' {
  if (!estimatedArrival) return 15;
  const target = new Date(estimatedArrival).getTime();
  if (isNaN(target)) return 15;
  const diffMinutes = Math.round((target - Date.now()) / 60000);
  if (diffMinutes <= 1) return 'ARR';
  return diffMinutes;
}

function parseOccupancy(load?: string): Occupancy {
  if (load === 'LSD') return 'Full';
  if (load === 'SDA') return 'Standing';
  return 'Seats';
}

function parseBusType(type?: string): BusType {
  if (type === 'DD') return 'DD';
  if (type === 'BD') return 'BD';
  return 'SD';
}

export async function fetchLtaBusArrivals(
  busStopCode: string,
  serviceNo?: string
): Promise<{
  services: Record<string, BusServiceArrivals>;
  isLiveData: boolean;
  message?: string;
}> {
  try {
    let url = `/api/bus-arrival?BusStopCode=${encodeURIComponent(busStopCode)}`;
    if (serviceNo) {
      url += `&ServiceNo=${encodeURIComponent(serviceNo)}`;
    }

    const res = await fetch(url, {
      headers: { accept: 'application/json' },
    });

    if (!res.ok) {
      throw new Error(`HTTP ${res.status}`);
    }

    const data: LtaBusArrivalResponse = await res.json();
    const result: Record<string, BusServiceArrivals> = {};

    if (Array.isArray(data.Services)) {
      for (const srv of data.Services) {
        const next1 = srv.NextBus;
        const next2 = srv.NextBus2;
        const next3 = srv.NextBus3;

        const defaultVia = BUS_SERVICES_AT_SOMERSET[srv.ServiceNo]?.via || 'Orchard Rd, Downtown';
        const defaultDest =
          BUS_SERVICES_AT_SOMERSET[srv.ServiceNo]?.destination ||
          `Int/Ter (${next1?.DestinationCode || 'Downtown'})`;

        result[srv.ServiceNo] = {
          serviceNo: srv.ServiceNo,
          category: 'TRUNK',
          destination: defaultDest,
          via: defaultVia,
          nextBus: {
            etaMinutes: parseEta(next1?.EstimatedArrival),
            occupancy: parseOccupancy(next1?.Load),
            busType: parseBusType(next1?.Type),
            wheelchair: next1?.Feature === 'WAB',
            speedKmh: 32,
            vehiclePlate: 'SG5821K',
          },
          secondBus: {
            etaMinutes: parseEta(next2?.EstimatedArrival) === 'ARR' ? 6 : parseEta(next2?.EstimatedArrival),
            occupancy: parseOccupancy(next2?.Load),
            busType: parseBusType(next2?.Type),
            wheelchair: next2?.Feature === 'WAB',
            speedKmh: 36,
          },
          thirdBus: {
            etaMinutes: parseEta(next3?.EstimatedArrival) === 'ARR' ? 14 : parseEta(next3?.EstimatedArrival),
            occupancy: parseOccupancy(next3?.Load),
            busType: parseBusType(next3?.Type),
            wheelchair: next3?.Feature === 'WAB',
          },
          currentStopDistance: '1 Stop Away',
          currentSpeed: 32,
          vehicleNo: 'SG5821K',
          stopsAway: 1,
          approachingStopName: 'Opp Somerset',
        };
      }
    }

    return {
      services: Object.keys(result).length > 0 ? result : BUS_SERVICES_AT_SOMERSET,
      isLiveData: Boolean(data._meta?.liveData),
      message: data._meta?.message,
    };
  } catch (err) {
    console.warn('LTA Bus Arrival API fetch failed, using fallback:', err);
    return {
      services: BUS_SERVICES_AT_SOMERSET,
      isLiveData: false,
    };
  }
}
