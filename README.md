## what I prioritized

normalized weather data 
useful time formats
realistic deployment environment
flexibility adding new providers

## tradeoffs

interesting weather data 
clean-coded time formats
realistic deployment process
geocoding support / allow querying by city or address 
    - Would be nice but immediately introduces constraints via cost (if using Google Maps) or rate limits (if using OpenStreetMap)

## what I'd do next

- thorough unit tests per provider, particulary for the normalization stage, testing several known responses from each
- set up cicd with cloud build or github actions
- convert to TypeScript once POC finished; add type safety for query params like provider enum
- add some endpoints that use historical data: compare accuracy across providers, find outlier current weather, etc
- clean up import paths


# Weather API

this service provides a way to interact with many different weather APIs. 

## Local Development

### Prerequisites
- ensure Docker is installed
- ensure Node >24 is installed

### Quickstart
- `npm i`
- `npm run dev`

## Hosting

This service is deployed on GCP in order to emulate what a full-fledged production scenario deployment might look like. It runs as a Cloud Run service with a minimum scaling of 1, which will cost a little bit but want to make sure it's fast when demoing.


○ Where it’s hosted and why
○ How to scale it up/down on that platform
○ Basic cost considerations (rough order-of-magnitude is fine)
○ How you’d roll back a bad deploy

### How to Deploy
gcloud run services update SERVICE_NAME --image=IMAGE_URL