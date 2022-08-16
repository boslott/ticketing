FROM node:alpine

# labels from https://github.com/opencontainers/image-spec/blob/master/annotations.md
LABEL org.opencontainers.image.version="1.0"
LABEL org.opencontainers.image.authors=boslott@gmail.com
LABEL org.opencontainers.image.title="Auth Micro-Service"
LABEL org.opencontainers.image.licenses=Unlicensed
LABEL com.boslott.nodeversion=$NODE_VERSION

# To control npm install, need an ENV
ENV NODE_ENV=development
ARG NPM_TOKEN

WORKDIR /auth
COPY .npmrc .npmrc
COPY package*.json .
RUN npm config list
RUN npm install --only=prod && npm cache clean --force
RUN rm -f .npmrc
ENV PATH /auth/node_modules/.bin:$PATH
COPY . .

CMD ["npm", "run", "start"]

