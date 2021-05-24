#!/bin/sh

# stop script on first error
set -e

IMAGE_TAG="test"
DOCKER_USERNAME=$(cat dockerlogin)
IMAGE_NAME="${DOCKER_USERNAME}/node-second-app"
LBLUE='\033[1;34m'
NC='\033[0m'
WHALE='\U1F40B\w'

nice_print() {
   printf "🐳${LBLUE} $1 ${NC}\n"
}

nice_print "Building docker image (step 1 from 4)"

docker build -t "${IMAGE_NAME}:${IMAGE_TAG}" .

nice_print "Authencticating and pushing image to Docker Hub (step 2 from 4)"
cat dockerpass | docker login -u "${DOCKER_USERNAME}" --password-stdin

docker push "${IMAGE_NAME}:${IMAGE_TAG}"

nice_print "Deploying server via remote SSH (step 3 from 4)"

ssh arch "docker pull ${IMAGE_NAME}:${IMAGE_TAG} \
         && docker stop node-container \
         && docker rm node-container \
         && docker run --name node-container -d -p 4444:4444 ${IMAGE_NAME}:${IMAGE_TAG} \
         && docker image prune -af \
         && docker ps"

nice_print "Remove unused local image (step 4 from 4)"

docker image rmi "${IMAGE_NAME}:${IMAGE_TAG}"
