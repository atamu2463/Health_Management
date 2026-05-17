FROM node:20-alpine

WORKDIR /frontend

ENV PORT=3001
ENV HOSTNAME="0.0.0.0"

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 3001

CMD [ "npm", "run", "dev" ]
