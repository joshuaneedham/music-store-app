FROM node:20

# Set working dir inside container
WORKDIR /app

# Copy package.json + package-lock.json first for caching
COPY package*.json ./

# Install deps
RUN npm install -g nodemon && npm install

# Copy rest of app
COPY . .

# Start dev mode
CMD ["npm", "run", "dev"]