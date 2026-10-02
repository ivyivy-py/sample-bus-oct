# User Prompts History

This document contains a chronological record of all user prompts used in building and configuring the **TransitPulse** application.

---

## Prompt 1: Initial UI & App Generation

```text
Build me an app with screens that look like this. You can hotlink images from the html
```

### Context & Attachments
- **Image**: TransitPulse Singapore Live bus tracker interface (Opp Somerset Stn 09038, Bus 65 with Triple Arrival Display, Other Services 14/123/174/143, Live Fleet Radar vector map, and Corridor Health card).
- **Design Specification & Mockup HTML**: High-contrast civic transit telemetry theme (`#c8102e` Transit Crimson, `#406182` Navy, LTA DataMall standards, Inter font family, Material Symbols).

---

## Prompt 2: GitHub Repository Setup & Push

```text
git push https://<GITHUB_PERSONAL_ACCESS_TOKEN>@https://github.com/ivyivy-py/sample-bus-oct.git
```

### Actions Executed
- Initialized Git repository.
- Staged and committed application files.
- Added remote origin and pushed `main` branch to [https://github.com/ivyivy-py/sample-bus-oct.git](https://github.com/ivyivy-py/sample-bus-oct.git).

---

## Prompt 3: LTA DataMall API Integration & Health Monitoring

```text
1)configure the bus arrival information using this LTA endpoint. # Next buses at a stop (v3 - the current version; 20-second refresh):
https://datamall2.mytransport.sg/ltaodataservice/v3/BusArrival?BusStopCode=83139
# ...optionally one service: &ServiceNo=15
this is an example of the response"BusStopCode": "20251",
    "Services": [
        {
            "ServiceNo": "176",
            "Operator": "SMRT",
            "NextBus": {
                "OriginCode": "10009",
                "DestinationCode": "45009",
                "EstimatedArrival": "2024-08-22T15:27:15+08:00",
                "Monitored": 1,
                "Latitude": "1.3100396666666667",
                "Longitude": "103.75647683333334",
                "VisitNumber": "1",
                "Load": "SEA",
                "Feature": "WAB",
                "Type": "DD"
            },
            "NextBus2": {
                "OriginCode": "10009",
                "DestinationCode": "45009",
                "EstimatedArrival": "2024-08-22T15:42:48+08:00",
                "Monitored": 1,
                "Latitude": "1.27424",
                "Longitude": "103.79662333333333",
                "VisitNumber": "1",
                "Load": "SEA",
                "Feature": "WAB",
                "Type": "DD"
            },
            "NextBus3": {
                "OriginCode": "10009",
                "DestinationCode": "45009",
                "EstimatedArrival": "2024-08-22T15:49:31+08:00",
                "Monitored": 1,
                "Latitude": "1.278829",
                "Longitude": "103.81719033333333",
                "VisitNumber": "1",
                "Load": "SEA",
                "Feature": "WAB",
                "Type": "SD"
            }
        },
2)create a folder under the project main /api and place it there. i will add in the api key in vercel environment variable later under LTA_ACCOUNT_KEY
3)create a /api/health.js for me to monitor the health of my apis
```

### Actions Executed
- Created `/api/bus-arrival.js` (and `/api/busArrival.js` alias) proxying LTA DataMall v3 BusArrival endpoint with `AccountKey` header support and fallback mock generator.
- Created `/api/health.js` monitoring uptime, system metrics, LTA key status, and upstream health probes (`?checkUpstream=true`).
- Created `server.ts` to mount Express and serve `/api/*` in full-stack dev/prod.
- Updated `src/services/ltaService.ts` and `BusTrackerView.tsx` with live 20-second refresh cycles.
- Pushed updates to GitHub repository.

---

## Prompt 4: Collate Prompts

```text
collate all my prompts into prompt.md placed under the project root
```
