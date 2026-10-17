const express = require('express');
const path = require('path');
const logger = require('./middlewares/logger');
const productRoutes = require('./routes/productRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// 1. Built-in Middleware: Gelen JSON formatındaki istek gövdesini (req.body) okumamızı sağlar
app.use(express.json());
app.set('json spaces', 2);

// 2. Temel Middleware: Logger (Her isteğin method, endpoint ve zamanını kaydeder)
app.use(logger);

// 3. Görsel Web Yönetim Paneli (Tarayıcıdan http://localhost:3000 açıldığında çalışır)
app.use(express.static(path.join(__dirname, 'public')));

// 4. Ürün Yönetim Rotalarını Bağla (/api/products)
app.use('/api/products', productRoutes);

// 5. Bulunamayan (404) Endpoint Yakalayıcı
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'İstenen API adresi (endpoint) bulunamadı.'
  });
});

// 6. Sunucuyu Başlat
app.listen(PORT, () => {
  console.log(`================================================================`);
  console.log(`Kuruyemiş Stok API ve Web Paneli hazır: http://localhost:${PORT}`);
  console.log(`================================================================`);
});
