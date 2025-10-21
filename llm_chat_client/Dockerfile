# Use the official Node.js image.
FROM node:22
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build --prod
EXPOSE 4200
CMD ["npm", "start"]
