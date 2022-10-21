FROM node:16

# Create app directory
WORKDIR /usr/src/app

# Install app dependancies
COPY package.json ./

RUN npm install

# If you are building for production run below instad 
# RUN npm ci --only=production

# Bundle app source
COPY . .

# Since app is running on port 8000
EXPOSE 8000

# Commands to run your app
CMD [ "npm", "run", "start"]