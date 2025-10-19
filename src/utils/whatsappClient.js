import pkg from 'whatsapp-web.js';
const { Client, LocalAuth } = pkg;

let clientInstance = null;
let clientReady = false;
let io = null; // Socket.IO instance'ı

// Socket.IO instance'ını set et
export const setSocketIO = (socketIO) => {
    io = socketIO;
};

export const initializeClient = () => {
    if (clientInstance) {
        return clientInstance;
    }

    clientInstance = new Client({
        authStrategy: new LocalAuth({ clientId: "client-one" }),
        puppeteer: {
            headless: true,
            args: [
                '--no-sandbox',
                '--disable-setuid-sandbox',
                '--disable-dev-shm-usage',
                '--disable-accelerated-2d-canvas',
                '--no-first-run',
                '--no-zygote',
                '--disable-gpu'
            ],
            executablePath: '/usr/bin/chromium-browser'
        }
    });

    // QR Kod oluşturulduğunda frontend'e gönder
    clientInstance.on('qr', (qr) => {
        console.log('----------------------------------------------------');
        console.log('WHATSAPP QR KODU OLUŞTURULDU - Frontend\'e gönderiliyor...');
        console.log('----------------------------------------------------');
        
        clientReady = false;
        
        // Socket.IO ile QR kodunu frontend'e gönder
        if (io) {
            io.emit('whatsapp-qr', { qr });
            console.log('✅ QR kodu Socket.IO ile gönderildi');
        }
    });

    clientInstance.on('ready', () => {
        console.log('✅ WhatsApp Client Hazır ve Bağlandı!');
        clientReady = true;
        
        // Frontend'e hazır durumunu bildir
        if (io) {
            io.emit('whatsapp-ready', { status: 'ready' });
        }
    });

    clientInstance.on('auth_failure', msg => {
        console.error('❌ Kimlik doğrulama hatası:', msg);
        clientReady = false;
        
        if (io) {
            io.emit('whatsapp-auth-failure', { message: msg });
        }
    });
    
    clientInstance.on('disconnected', (reason) => {
        console.warn('⚠️ WhatsApp Client Bağlantısı Kesildi:', reason);
        clientReady = false;
        
        if (io) {
            io.emit('whatsapp-disconnected', { reason });
        }
    });

    clientInstance.initialize();

    return clientInstance;
};

// ...existing code...
export const getClient = () => clientInstance;
export const isClientReady = () => clientReady;

export const getGroups = async () => {
    if (!clientInstance || !clientReady) {
        throw new Error("WhatsApp İstemcisi Hazır Değil.");
    }

    const chats = await clientInstance.getChats();

    const groups = chats
        .filter(chat => chat.isGroup)
        .map(chat => ({
            name: chat.name,
            id: chat.id._serialized
        }));

    return groups;
};

export const sendMessage = async (target, message) => {
    if (!clientReady) {
        throw new Error("WhatsApp İstemcisi Hazır Değil veya Oturum Açılmamış.");
    }

    let chatId;
    if (target.includes('@g.us')) {
        chatId = target;
    } else {
        const cleanNumber = target.startsWith('0') ? target.substring(1) : target;
        chatId = `${cleanNumber}@c.us`; 
    }
    
    try {
        const response = await clientInstance.sendMessage(chatId, message);
        console.log(`Mesaj başarıyla gönderildi. Hedef: ${target}`);
        return { success: true, response };
    } catch (err) {
        console.error(`Mesaj gönderilirken hata oluştu. Hedef: ${target}`, err);
        return { success: false, error: err.message };
    }
};