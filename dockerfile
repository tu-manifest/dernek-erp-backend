# Dockerfile

# Resmi Python imajını temel al
FROM python:3.11-slim

# Çalışma dizinini ayarla
WORKDIR /app

# Gereken Python paketlerinin listesini (requirements.txt) kopyala
# Henüz oluşturmadıysanız boş bir dosya oluşturabilirsiniz
COPY requirements.txt .

# Paketleri kur
RUN pip install --no-cache-dir -r requirements.txt

# Tüm uygulama kodunu kopyala
COPY . .

# Uvicorn'un dinleyeceği portu belirle
EXPOSE 8000

# Uygulamayı başlat
# 'app.main:app' demek: 'app/main.py' dosyasındaki 'app' objesini çalıştır.
# --host 0.0.0.0, Docker'da dış dünyaya erişim için gereklidir.
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]