# Use official Node.js image
FROM node:18

# Create app directory
WORKDIR /usr/src/app

# Copy package.json first (for caching)
COPY package*.json ./

# Install dependencies
RUN npm install --omit=dev

# Copy rest of the app
COPY . .

# Expose the port Azure will bind to
EXPOSE 3000
# Start the app
CMD ["npm", "start"]
