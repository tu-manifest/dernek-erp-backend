FROM node:20-alpine

# Puppeteer / whatsapp-web.js deps
RUN apk add --no-cache \
    chromium \
    nss \
    freetype \
    harfbuzz \
    ca-certificates \
    ttf-freefont \
    fontconfig \
    libstdc++ \
    gcompat

ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true \
    PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser

WORKDIR /usr/src/app

# package.json önce (cache için)
COPY package*.json ./

# DEV deps DAHİL
RUN npm install

COPY . .

EXPOSE 8080

# nodemon
CMD ["npm", "run", "dev"]
