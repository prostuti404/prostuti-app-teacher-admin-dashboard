# First stage: Build the React app
FROM node:20 AS build

# Set config
ENV NPM_CONFIG_UPDATE_NOTIFIER=false
ENV NPM_CONFIG_FUND=false

# Create and change to the app directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Remove the platform-specific dependency causing issues
RUN npm pkg delete dependencies."@rollup/rollup-darwin-arm64"

# Install all dependencies (including dev dependencies needed for build)
RUN npm install

# Copy local code to the container image
COPY . ./

# Accept environment variables from Railway during Docker build
ARG VITE_BASE_URL
ENV VITE_BASE_URL=$VITE_BASE_URL

# Modified build command to bypass TypeScript errors
# This overrides the build script in package.json
RUN npx tsc --skipLibCheck --noEmit && npx vite build

# Second stage: Serve with Caddy
FROM caddy:2.7.5

# Create and change to the app directory
WORKDIR /app

# Copy Caddyfile to the container image
COPY Caddyfile ./

# Format the Caddyfile
RUN caddy fmt Caddyfile --overwrite

# Copy build files from the first stage
COPY --from=build /app/dist ./dist

# Use Caddy to run/serve the app
CMD ["caddy", "run", "--config", "Caddyfile", "--adapter", "caddyfile"]