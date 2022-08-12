# Sample dockerfile for containerized environment.
FROM node:16-slim

RUN apt-get update || : && apt-get install python make g++ -y

# Create and change to the app directory.

ARG USERNAME=handsomejang

RUN useradd $USERNAME

ENV HOME /user/$USERNAME
ENV GOOGLE_APPLICATION_CREDENTIALS=

WORKDIR $HOME/app

# Copy application dependency manifests to the container image.
# A wildcard is used to ensure both package.json AND package-lock.json are copied.
# Copying this separately prevents re-running npm install on every code change.
COPY package.json ./
COPY yarn.lock ./

# Install production dependencies.
RUN yarn install --prod

# Copy local code to the container image.
COPY . ./

# Set user to run
# USER $USERNAME

# serve entrypoint of your service by supplying start:api or start:media
ENTRYPOINT [ "yarn" ]
