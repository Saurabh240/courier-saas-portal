FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package.json and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the source code
COPY . .

# Expose the development port
EXPOSE 3000

# Start the dev server
CMD ["npm","run", "start"]
