export type Occupancy = 'Seats' | 'Standing' | 'Full';
export type BusType = 'SD' | 'DD' | 'BD'; // Single Decker, Double Decker, Bendy

export interface BusArrivalInfo {
  etaMinutes: number | 'ARR';
  occupancy: Occupancy;
  busType: BusType;
  wheelchair: boolean;
  vehiclePlate?: string;
  speedKmh?: number;
}

export interface BusServiceArrivals {
  serviceNo: string;
  category: 'TRUNK' | 'FEEDER' | 'EXPRESS';
  destination: string;
  via: string;
  nextBus: BusArrivalInfo;
  secondBus: BusArrivalInfo;
  thirdBus: BusArrivalInfo;
  currentStopDistance?: string;
  currentSpeed?: number;
  vehicleNo?: string;
  stopsAway?: number;
  approachingStopName?: string;
}

export interface BusStop {
  code: string;
  name: string;
  roadName: string;
  distanceMeters: number;
  walkMinutes: number;
  services: string[];
  lat: number;
  lng: number;
  mrtTransfer?: string;
}

export interface RouteStop {
  seq: number;
  code: string;
  name: string;
  road: string;
  distanceKm: number;
  mrtTransfer?: string;
  busesNearby?: {
    plate: string;
    speed: number;
    occupancy: Occupancy;
  }[];
}

export interface BusRouteDetails {
  serviceNo: string;
  operator: 'SBST' | 'SMRT' | 'TTS' | 'GAS';
  category: 'TRUNK' | 'FEEDER' | 'EXPRESS';
  origin: string;
  destination: string;
  direction1Name: string;
  direction2Name: string;
  operatingHours: string;
  headwayPeak: string;
  headwayOffPeak: string;
  stopsDir1: RouteStop[];
  stopsDir2: RouteStop[];
}

export interface ServiceAlert {
  id: string;
  lineOrService: string;
  type: 'MRT' | 'BUS' | 'WEATHER' | 'ROAD';
  status: 'NORMAL' | 'DELAY' | 'DISRUPTION' | 'ADVISORY';
  title: string;
  detail: string;
  updatedAt: string;
}
