# Use official Node.js image
FROM node:18

# Create app directory
WORKDIR /app

# Copy package.json and install deps
COPY package*.json ./
RUN npm install

# Copy app source
COPY backend/ backend/
COPY public/ public/
COPY .env .env

# Expose port
EXPOSE 5000

# Run the app
CMD ["node", "backend/server.js"]
