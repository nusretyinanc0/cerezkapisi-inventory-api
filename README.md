# ÇerezKapısı — Kuruyemiş Dükkanı Envanter ve Stok Yönetim Sistemi REST API

Bu proje, **Backend Geliştirme Eğitimi Proje Yönergesi** kapsamında **Node.js** ve **Express.js** kullanılarak geliştirilmiş bir **Kuruyemiş Dükkanı Envanter ve Stok Yönetim Sistemi REST API** uygulamasıdır.

---

## Klasör Yapısı

```text
kuruyemis-stok-api/
├── logs/
│   └── requests.log                          # Logger middleware tarafından kaydedilen istek logları
├── src/
│   ├── controllers/
│   │   └── productController.js              # 5 Temel CRUD iş mantığı ve JSON dosya yönetimi
│   ├── data/
│   │   └── products.json                     # 40 kuruyemiş/ürün verisinin tutulduğu JSON dosyası
│   ├── middlewares/
│   │   └── logger.js                         # Temel Logger Middleware (method, endpoint, timestamp)
│   ├── routes/
│   │   └── productRoutes.js                  # /api/products rotalarının tanımlandığı modül
│   └── app.js                                # Express sunucu kurulumu ve ana giriş noktası
├── PROJE_TANITIM_VE_TASARIM_DOKUMANI.md      # Aşama 1 & 4: Proje Tanıtım, Veri Modeli ve API Tasarım Dokümanı
├── README.md                                 # Aşama 4: Kurulum Notu ve Kullanım Kılavuzu
├── Kuruyemis_Stok_API.postman_collection.json# Aşama 4: Postman'e doğrudan aktarılabilir hazır test koleksiyonu
└── package.json                              # Proje bağımlılıkları ve çalıştırma komutları
```

---

## Kurulum ve Çalıştırma Adımları (VS Code ile)

### 1. Projeyi VS Code'da Açma
VS Code'u açıp **File > Open Folder** menüsünden proje klasörünü (`kuruyemis-stok-api`) seçin ve VS Code içinde terminali (`Ctrl + "` veya **Terminal > New Terminal**) açın.

### 2. Bağımlılıkların Yüklenmesi
```bash
npm install
```

### 3. Sunucunun Başlatılması
```bash
npm start
```
*(Kodda değişiklik yaptığınızda sunucunun otomatik yeniden başlaması için `npm run dev` komutunu da kullanabilirsiniz.)*

Sunucu **`http://localhost:3000`** adresinde çalışmaya başlayacaktır.

---

## Postman ile 5 Temel CRUD Testi

Proje klasöründeki **`Kuruyemis_Stok_API.postman_collection.json`** dosyasını Postman uygulamasında sol üstteki **Import** butonuna tıklayarak içeri aktarabilirsiniz. Hazır gelen 5 isteği sırasıyla çalıştırıp ekran görüntülerini alabilirsiniz:

### 1. Ürün Listeleme (`GET /api/products`)
- **URL:** `http://localhost:3000/api/products`
- **Method:** `GET`
- **Açıklama:** Dükkandaki 40 kuruyemiş ve stok bilgisini listeler.

### 2. Ürün Detayı (`GET /api/products/:id`)
- **URL:** `http://localhost:3000/api/products/4`
- **Method:** `GET`
- **Açıklama:** `4` ID'li **Kavrulmuş Antep Fıstığı** ürününün detaylarını getirir.

### 3. Yeni Ürün Ekleme (`POST /api/products`)
- **URL:** `http://localhost:3000/api/products`
- **Method:** `POST`
- **Headers:** `Content-Type: application/json`
- **Body (raw / JSON):**
```json
{
  "name": "Çifte Kavrulmuş Damla Sakızlı Türk Kahvesi",
  "category": "Ezme & Kahve",
  "supplier": "Tarihi Eminönü Kahvecisi A.Ş.",
  "stockKg": 15,
  "pricePerKg": 510
}
```

### 4. Stok / Fiyat Güncelleme (`PUT /api/products/:id`)
- **URL:** `http://localhost:3000/api/products/4`
- **Method:** `PUT`
- **Headers:** `Content-Type: application/json`
- **Body (raw / JSON):**
```json
{
  "stockKg": 8.5,
  "pricePerKg": 720
}
```
*(Not: Stok 10 kg altına düştüğü için `status` alanı otomatik olarak `"kritik_stok"` değerine güncellenir.)*

### 5. Ürün Silme (`DELETE /api/products/:id`)
- **URL:** `http://localhost:3000/api/products/41`
- **Method:** `DELETE`
- **Açıklama:** Belirtilen ID'li ürünü envanterden siler.
