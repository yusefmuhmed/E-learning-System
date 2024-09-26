# Use the official Node.js 18 image from the Docker Hub
FROM node:18

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install application dependencies
RUN npm install

# Copy the rest of the application code to the working directory
COPY . .

# Expose port 3000 (or whichever port your app uses)
EXPOSE 3000

# Define the command to run the app
CMD ["node", "index.js"]
