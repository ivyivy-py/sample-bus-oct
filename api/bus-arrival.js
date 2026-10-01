/**
 * Vercel Serverless Function: /api/bus-arrival
 * Queries Singapore Land Transport Authority (LTA) DataMall v3 BusArrival API
 * Endpoint: https://datamall2.mytransport.sg/ltaodataservice/v3/BusArrival?BusStopCode={code}&ServiceNo={service}
 */

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, AccountKey');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method Not Allowed. Use GET.' });
  }

  // Parse query parameters (supports both PascalCase and camelCase)
  const url = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  const busStopCode =
    url.searchParams.get('BusStopCode') ||
    url.searchParams.get('busStopCode') ||
    req.query?.BusStopCode ||
    req.query?.busStopCode ||
    '09038';

  const serviceNo =
    url.searchParams.get('ServiceNo') ||
    url.searchParams.get('serviceNo') ||
    req.query?.ServiceNo ||
    req.query?.serviceNo ||
    '';

  const accountKey = process.env.LTA_ACCOUNT_KEY;

  if (!accountKey) {
    // Return sample/mock LTA v3 payload when key is not configured yet
    const samplePayload = generateFallbackLtaResponse(busStopCode, serviceNo);
    return res.status(200).json({
      ...samplePayload,
      _meta: {
        liveData: false,
        message:
          'LTA_ACCOUNT_KEY is not configured yet in environment variables. Showing simulated LTA DataMall v3 structure. Configure LTA_ACCOUNT_KEY in Vercel to receive real-time telemetry.',
      },
    });
  }

  try {
    let ltaUrl = `https://datamall2.mytransport.sg/ltaodataservice/v3/BusArrival?BusStopCode=${encodeURIComponent(
      busStopCode
    )}`;
    if (serviceNo) {
      ltaUrl += `&ServiceNo=${encodeURIComponent(serviceNo)}`;
    }

    const response = await fetch(ltaUrl, {
      method: 'GET',
      headers: {
        AccountKey: accountKey,
        accept: 'application/json',
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      return res.status(response.status).json({
        error: `LTA DataMall API error (${response.status})`,
        details: errorText,
        busStopCode,
        serviceNo,
      });
    }

    const data = await response.json();
    return res.status(200).json({
      ...data,
      _meta: {
        liveData: true,
        source: 'LTA DataMall v3 BusArrival',
        timestamp: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error('Error fetching LTA Bus Arrival:', error);
    return res.status(500).json({
      error: 'Failed to communicate with LTA DataMall',
      message: error instanceof Error ? error.message : String(error),
      fallback: generateFallbackLtaResponse(busStopCode, serviceNo),
    });
  }
}

/**
 * Fallback generator matching exact LTA DataMall v3 schema when key is not yet provided
 */
function generateFallbackLtaResponse(busStopCode, serviceNo) {
  const now = Date.now();
  const formatTime = (minutesAhead) => new Date(now + minutesAhead * 60000).toISOString();

  const services = [
    {
      ServiceNo: serviceNo || '65',
      Operator: 'SBST',
      NextBus: {
        OriginCode: '75009',
        DestinationCode: '14009',
        EstimatedArrival: formatTime(0.5),
        Latitude: '1.3006',
        Longitude: '103.8391',
        VisitNumber: '1',
        Load: 'SEA',
        Feature: 'WAB',
        Type: 'SD',
        Monitored: 1,
      },
      NextBus2: {
        OriginCode: '75009',
        DestinationCode: '14009',
        EstimatedArrival: formatTime(7),
        Latitude: '1.3039',
        Longitude: '103.8336',
        VisitNumber: '1',
        Load: 'SDA',
        Feature: 'WAB',
        Type: 'DD',
        Monitored: 1,
      },
      NextBus3: {
        OriginCode: '75009',
        DestinationCode: '14009',
        EstimatedArrival: formatTime(16),
        Latitude: '1.3110',
        Longitude: '103.8290',
        VisitNumber: '1',
        Load: 'LSD',
        Feature: 'WAB',
        Type: 'DD',
        Monitored: 1,
      },
    },
    {
      ServiceNo: '14',
      Operator: 'SBST',
      NextBus: {
        OriginCode: '17009',
        DestinationCode: '84009',
        EstimatedArrival: formatTime(4),
        Latitude: '1.3000',
        Longitude: '103.8400',
        VisitNumber: '1',
        Load: 'SEA',
        Feature: 'WAB',
        Type: 'DD',
        Monitored: 1,
      },
      NextBus2: {
        OriginCode: '17009',
        DestinationCode: '84009',
        EstimatedArrival: formatTime(12),
        Latitude: '1.2950',
        Longitude: '103.8450',
        VisitNumber: '1',
        Load: 'SDA',
        Feature: 'WAB',
        Type: 'DD',
        Monitored: 1,
      },
      NextBus3: {
        OriginCode: '17009',
        DestinationCode: '84009',
        EstimatedArrival: formatTime(22),
        Latitude: '1.2900',
        Longitude: '103.8500',
        VisitNumber: '1',
        Load: 'SEA',
        Feature: 'WAB',
        Type: 'SD',
        Monitored: 1,
      },
    },
    {
      ServiceNo: '123',
      Operator: 'SBST',
      NextBus: {
        OriginCode: '10009',
        DestinationCode: '14009',
        EstimatedArrival: formatTime(2),
        Latitude: '1.3015',
        Longitude: '103.8375',
        VisitNumber: '1',
        Load: 'SEA',
        Feature: 'WAB',
        Type: 'SD',
        Monitored: 1,
      },
      NextBus2: {
        OriginCode: '10009',
        DestinationCode: '14009',
        EstimatedArrival: formatTime(9),
        Latitude: '1.3060',
        Longitude: '103.8320',
        VisitNumber: '1',
        Load: 'SEA',
        Feature: 'WAB',
        Type: 'SD',
        Monitored: 1,
      },
      NextBus3: {
        OriginCode: '10009',
        DestinationCode: '14009',
        EstimatedArrival: formatTime(19),
        Latitude: '1.3120',
        Longitude: '103.8250',
        VisitNumber: '1',
        Load: 'SDA',
        Feature: 'WAB',
        Type: 'SD',
        Monitored: 1,
      },
    },
    {
      ServiceNo: '174',
      Operator: 'SBST',
      NextBus: {
        OriginCode: '22009',
        DestinationCode: '04229',
        EstimatedArrival: formatTime(8),
        Latitude: '1.3020',
        Longitude: '103.8360',
        VisitNumber: '1',
        Load: 'SEA',
        Feature: 'WAB',
        Type: 'DD',
        Monitored: 1,
      },
      NextBus2: {
        OriginCode: '22009',
        DestinationCode: '04229',
        EstimatedArrival: formatTime(15),
        Latitude: '1.3080',
        Longitude: '103.8300',
        VisitNumber: '1',
        Load: 'SEA',
        Feature: 'WAB',
        Type: 'DD',
        Monitored: 1,
      },
      NextBus3: {
        OriginCode: '22009',
        DestinationCode: '04229',
        EstimatedArrival: formatTime(27),
        Latitude: '1.3150',
        Longitude: '103.8220',
        VisitNumber: '1',
        Load: 'SDA',
        Feature: 'WAB',
        Type: 'DD',
        Monitored: 1,
      },
    },
    {
      ServiceNo: '143',
      Operator: 'TTS',
      NextBus: {
        OriginCode: '28009',
        DestinationCode: '14009',
        EstimatedArrival: formatTime(0.2),
        Latitude: '1.3005',
        Longitude: '103.8390',
        VisitNumber: '1',
        Load: 'SDA',
        Feature: 'WAB',
        Type: 'DD',
        Monitored: 1,
      },
      NextBus2: {
        OriginCode: '28009',
        DestinationCode: '14009',
        EstimatedArrival: formatTime(11),
        Latitude: '1.3050',
        Longitude: '103.8340',
        VisitNumber: '1',
        Load: 'SEA',
        Feature: 'WAB',
        Type: 'DD',
        Monitored: 1,
      },
      NextBus3: {
        OriginCode: '28009',
        DestinationCode: '14009',
        EstimatedArrival: formatTime(21),
        Latitude: '1.3130',
        Longitude: '103.8260',
        VisitNumber: '1',
        Load: 'SEA',
        Feature: 'WAB',
        Type: 'DD',
        Monitored: 1,
      },
    },
  ];

  const matched = serviceNo
    ? services.filter((s) => s.ServiceNo.toLowerCase() === serviceNo.toLowerCase())
    : services;

  return {
    'odata.metadata':
      'https://datamall2.mytransport.sg/ltaodataservice/$metadata#BusArrivalv3/@Element',
    BusStopCode: busStopCode,
    Services: matched.length > 0 ? matched : services,
  };
}
