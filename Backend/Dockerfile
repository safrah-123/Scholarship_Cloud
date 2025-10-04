# Use Node.js base image
FROM node:18

# Set working directory inside the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json first
COPY package*.json ./

# Install all dependencies (including nodemon for dev)
RUN npm install

# Copy everything else
COPY . .

# Expose the port (will match .env at runtime, e.g., 5000)
EXPOSE ${PORT}

# Run in dev mode with nodemon
CMD ["npm", "run", "dev"]
