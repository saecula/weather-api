# Weather API

this service provides a way to interact with many different weather APIs. 

## Local Development

### Prerequisites
- ensure Docker is installed
- ensure Node >24 is installed

### Quickstart
- `npm i`
- `npm run dev`
- import Postman collection: `collection.json`

## Hosting

This service is deployed on GCP in a personal project (`saecula`) in order to emulate what a full-fledged production scenario deployment might look like. It runs as a Cloud Run service with a minimum scaling of 1, which will cost a little bit but want to make sure it's fast when demoing.

UI for service details(edit, deploy, metrics):
- https://console.cloud.google.com/run/detail/us-west1/weather-api/observability/metrics?project=saecula

UI for stopping the service:
- https://console.cloud.google.com/run?project=saecula -- select weather-api

Cost estimate: 
- https://cloud.google.com/products/calculator?_gl=1*zjdllm*_ga*NTEyNDM1Njg2LjE3NTkzMjY1NTU.*_ga_WH2QY8WWF5*czE3NTkzMzQ2MTIkbzE0JGcxJHQxNzU5MzQxMzE5JGo0MyRsMCRoMA..&hl=en&dl=CjhDaVExTlRRMU5qTXhaUzA0WWpNNUxUUTRZakF0WW1KaU1DMWpOMkU0WXpZd1lqUmtaallRQVE9PRAcGiQyMzIyMTM3NS1BMUU1LTRFQUMtQTQ3OS01RTJBRkNBQzk2N0M
- a bit pricey because I wanted it to be ready for demo

How I'd roll back a bad deploy:
- currently would just select a previous image hash or tag in the Cloud Run UI. ideally would have standard commands ready via gcloud cli

# Notes

## what I prioritized

tidy code structure
normalized weather data
useful time formats
useful temperature units
realistic deployment environment
optimized for adding new providers, standard inputs (lat/lon)

## tradeoffs

tests
interesting weather data 
clean-coded time formats
clean-coded temperature units
realistic deployment process
geocoding support / allow querying by city or address 
    - Would be nice but introduces constraints via cost (if using Google Maps) or possibly rate limits

## miss

- did not finish fallback provider

## what I'd do next

- get actual current-weather from noaa instead of placeholder (first found among grid points)
- more thorough error logging / handling
- thorough unit tests per provider, particulary for the normalization stage, testing several known responses from each, several units / times
- convert to TypeScript; add type safety for query params like provider enum
- log by full query instead of individual params
