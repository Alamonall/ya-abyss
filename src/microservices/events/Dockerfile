FROM node:24.7.0 as builder

WORKDIR /builder

COPY . .

RUN npm ci \
  && npm run build

FROM node:24.7.0
WORKDIR /app
COPY --from=builder --chown=node:node /builder .
RUN chown node:node /app
USER node
CMD [ "node", "./dist/index.js" ]
