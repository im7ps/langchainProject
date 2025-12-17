FROM node:20-alpine

WORKDIR /app

# install deps (cache-friendly)
COPY package.json package-lock.json ./
RUN npm install

# copy rest of the app
COPY . .

EXPOSE 5173

CMD ["npm", "run", "dev"]
