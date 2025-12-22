// src/middlewares/upload.middleware.js
import multer from 'multer';

// Memory storage kullan - bytea için buffer olarak saklar
const storage = multer.memoryStorage();

// Dosya filtresi - sadece resimler kabul (fixed assets için)
const imageFileFilter = (req, file, cb) => {
    const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];

    if (allowedMimeTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Sadece resim dosyaları yüklenebilir (JPEG, PNG, GIF, WebP).'), false);
    }
};

// Dosya filtresi - dökümanlar için (PDF + resimler)
const documentFileFilter = (req, file, cb) => {
    const allowedMimeTypes = [
        'application/pdf',
        'image/jpeg',
        'image/png'
    ];

    if (allowedMimeTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Sadece PDF, JPEG ve PNG dosyaları yüklenebilir.'), false);
    }
};

// Resim yükleme için multer (5MB)
const imageUpload = multer({
    storage: storage,
    fileFilter: imageFileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB max
    }
});

// Döküman yükleme için multer (10MB)
const documentUpload = multer({
    storage: storage,
    fileFilter: documentFileFilter,
    limits: {
        fileSize: 10 * 1024 * 1024 // 10MB max
    }
});

// Tek resim yüklemek için middleware
export const uploadSingleImage = imageUpload.single('image');

// Tek döküman yüklemek için middleware
export const uploadSingleDocument = documentUpload.single('file');

// Multer hata yakalama middleware
export const handleMulterError = (err, req, res, next) => {
    if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({
                success: false,
                message: 'Dosya boyutu çok büyük. Maksimum boyut aşıldı.'
            });
        }
        return res.status(400).json({
            success: false,
            message: `Dosya yükleme hatası: ${err.message}`
        });
    } else if (err) {
        return res.status(400).json({
            success: false,
            message: err.message
        });
    }
    next();
};

export default { imageUpload, documentUpload };
