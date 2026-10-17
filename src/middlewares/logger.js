const fs = require('fs');
const path = require('path');

// Log dosyasının kaydedileceği klasör ve dosya yolu
const logDirectory = path.join(__dirname, '../../logs');
const logFilePath = path.join(logDirectory, 'requests.log');

// Eğer logs klasörü yoksa otomatik oluştur
if (!fs.existsSync(logDirectory)) {
  fs.mkdirSync(logDirectory, { recursive: true });
}

/**
 * Temel Middleware — Logger
 * Sunucuya gelen her isteğin:
 * 1) Zaman damgasını (timestamp)
 * 2) HTTP metodunu (GET, POST, PUT, DELETE)
 * 3) İstek atılan adresi (endpoint)
 * hem konsola yazdırır hem de logs/requests.log dosyasına kaydeder.
 */
const logger = (req, res, next) => {
  const timestamp = new Date().toISOString();
  const method = req.method;
  const endpoint = req.originalUrl;

  const logMessage = `[${timestamp}] ${method} ${endpoint}`;

  // 1. Konsola yazdır
  console.log(logMessage);

  // 2. Log dosyasına ekle
  fs.appendFile(logFilePath, logMessage + '\n', (err) => {
    if (err) {
      console.error('Log dosyasına yazılırken hata oluştu:', err.message);
    }
  });

  // İsteğin bir sonraki adıma (Route / Controller) geçmesini sağla
  next();
};

module.exports = logger;
