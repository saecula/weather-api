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

### Prerequisites
- ensure Docker is installed
- ensure Node >24 is installed

### Quickstart
- `npm i`
- `docker compose up`: this will spin up a hotreloading weather-api container with service available at `localhost:3000`
- when finished: `docker compose down`

## Hosting

- This service is deployed on gcp.
○ Where it’s hosted and why
○ How to scale it up/down on that platform
○ Basic cost considerations (rough order-of-magnitude is fine)
○ How you’d roll back a bad deploy
### How to Deploy