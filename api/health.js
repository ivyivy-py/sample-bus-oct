/**
 * Vercel Serverless Function: /api/health
 * Health check & telemetry endpoint for TransitPulse APIs
 */

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const startTime = Date.now();
  const hasLtaKey = Boolean(process.env.LTA_ACCOUNT_KEY);

  const url = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  const checkUpstream = url.searchParams.get('checkUpstream') === 'true';

  let ltaUpstreamStatus = 'untested';
  let ltaLatencyMs = null;
  let ltaError = null;

  if (checkUpstream) {
    if (!hasLtaKey) {
      ltaUpstreamStatus = 'skipped_no_key';
    } else {
      const pingStart = Date.now();
      try {
        const testRes = await fetch(
          'https://datamall2.mytransport.sg/ltaodataservice/v3/BusArrival?BusStopCode=83139&ServiceNo=15',
          {
            method: 'GET',
            headers: {
              AccountKey: process.env.LTA_ACCOUNT_KEY,
              accept: 'application/json',
            },
            signal: AbortSignal.timeout(5000),
          }
        );
        ltaLatencyMs = Date.now() - pingStart;
        if (testRes.ok) {
          ltaUpstreamStatus = 'healthy';
        } else {
          ltaUpstreamStatus = `upstream_http_${testRes.status}`;
          ltaError = await testRes.text();
        }
      } catch (err) {
        ltaUpstreamStatus = 'unreachable';
        ltaError = err instanceof Error ? err.message : String(err);
      }
    }
  }

  const memory = process.memoryUsage ? process.memoryUsage() : null;

  const healthData = {
    status: 'ok',
    service: 'TransitPulse API Gateway',
    timestamp: new Date().toISOString(),
    uptimeSeconds: Math.floor(process.uptime ? process.uptime() : 0),
    responseTimeMs: Date.now() - startTime,
    environment: process.env.NODE_ENV || 'production',
    ltaIntegration: {
      accountKeyConfigured: hasLtaKey,
      upstreamStatus: ltaUpstreamStatus,
      upstreamLatencyMs: ltaLatencyMs,
      upstreamError: ltaError,
      targetEndpoint: 'https://datamall2.mytransport.sg/ltaodataservice/v3/BusArrival',
      version: 'v3',
    },
    endpoints: {
      busArrival: '/api/bus-arrival?BusStopCode=09038&ServiceNo=65',
      health: '/api/health',
      healthWithUpstreamCheck: '/api/health?checkUpstream=true',
    },
    system: {
      nodeVersion: process.version,
      platform: process.platform,
      memory: memory
        ? {
            rssMb: Math.round(memory.rss / 1024 / 1024),
            heapUsedMb: Math.round(memory.heapUsed / 1024 / 1024),
            heapTotalMb: Math.round(memory.heapTotal / 1024 / 1024),
          }
        : undefined,
    },
  };

  return res.status(200).json(healthData);
}
