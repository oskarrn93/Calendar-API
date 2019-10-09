#!/bin/bash
npm run build &&
docker-compose -f docker-compose.prod.yml down &&
docker-compose -f docker-compose.prod.yml up