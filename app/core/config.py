from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    # Model yapılandırmasını tanımlar
    model_config = SettingsConfigDict(
        env_file=".env",              # Ayarları projenin kök dizinindeki .env dosyasından oku
        extra="ignore"                # .env dosyasında burada tanımlanmayan değişkenleri yoksay
    )

    # 1. Temel Proje Ayarları
    PROJECT_NAME: str = "Dernek ERP"  # Projenin varsayılan adı
    API_V1_STR: str = "/api/v1"       # API'nin versiyonlama ön eki

    # 2. Veritabanı Ayarları (Örnek)
    DATABASE_URL: str = "sqlite:///./sql_app.db" # Varsayılan olarak SQLite kullan

    # 3. Güvenlik Ayarları (İleride JWT için kullanılacak)
    SECRET_KEY: str = "BU_ÇOK_GİZLİ_BİR_ANAHTAR" # Kesinlikle değiştirilmelidir!
    ALGORITHM: str = "HS256"

# Bu objeyi projenin her yerinde kullanacağız
settings = Settings()