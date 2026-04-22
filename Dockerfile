# Build stage
FROM node:20-alpine AS build

WORKDIR /app

# Copy package files 
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the application 
RUN npm run build --configuration=production

# Stage 2: Serve the application with Nginx
FROM nginx:alpine

# Copy the build output from Stage 1 to Nginx's public folder
COPY --from=build /app/dist/money-transfer-ui/browser /usr/share/nginx/html

# Copy custom nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]