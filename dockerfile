FROM node:20-alpine

# Chromium ve gerekli bağımlılıkları yükle
RUN apk add --no-cache \
    chromium \
    nss \
    freetype \
    harfbuzz \
    ca-certificates \
    ttf-freefont \
    nodejs \
    yarn

# Puppeteer'a sistemdeki Chromium'u kullanmasını söyle
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true \
    PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser

WORKDIR /usr/src/app

# package.json ve package-lock.json'ı kopyala
COPY package*.json ./
# Bağımlılıkları yükle
RUN npm install -g nodemon

RUN npm install 
# Tüm dosyaları kopyala
COPY . .

# Port'u aç
EXPOSE 8000

# Uygulamayı başlat
CMD ["npm", "start"]