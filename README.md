## what I prioritized

realistic deployment scenario:
deploy containerized image
secrets management


## tradeoffs

bla bl abl a

## what I'd do next

bla bla bla


# Weather API

this service provides a way to interact with many different weather APIs. 

## Local Development

### prerequisites
- ensure Docker is installed
- ensure Node >24 is installed

### spinup
- `npm i`
- `docker compose up`: this will spin up a hotreloading weather-api container with service available at `localhost:3000`
- when finished: `docker compose down`

## Deploy
- This service is deployed on gcp.

