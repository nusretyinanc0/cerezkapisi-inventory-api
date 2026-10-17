<div align="center">

# 🥜 ÇerezKapısı — Inventory & Stock Management API

**Kuruyemiş ve Kuru Meyve Perakendeciliği İçin Geliştirilmiş RESTful Envanter Yönetim Servisi**

[![Node.js](https://img.shields.io/badge/Node.js-v18%2B-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![Express.js](https://img.shields.io/badge/Express.js-4.x-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
[![REST API](https://img.shields.io/badge/Architecture-RESTful_API-10b981?style=for-the-badge)](https://restfulapi.net/)
[![Data Store](https://img.shields.io/badge/Storage-JSON_File_System-f59e0b?style=for-the-badge&logo=json&logoColor=white)](#veri-modeli-data-schema)
[![Postman](https://img.shields.io/badge/Tested_With-Postman-FF6C37?style=for-the-badge&logo=postman&logoColor=white)](#postman-ile-test)

<p align="center">
  <a href="#proje-hakkında">Proje Hakkında</a> •
  <a href="#sistem-mimarisi">Sistem Mimarisi</a> •
  <a href="#veri-modeli-data-schema">Veri Modeli</a> •
  <a href="#api-dokümantasyonu">API Referansı</a> •
  <a href="#kurulum-ve-çalıştırma">Kurulum</a>
</p>

</div>

---

## 📌 Proje Hakkında

**ÇerezKapısı Inventory API**, yüksek sirkülasyona sahip bir kuruyemiş, kuru meyve, şekerleme ve kahve işletmesinin depo ile tezgah stoklarını merkezi olarak yönetmek amacıyla geliştirilmiş **Node.js & Express.js** tabanlı bir arka uç (backend) servisidir.

Sistem; tedarikçi takibi, kilogram bazlı stok kontrolü, birim fiyatlandırma ve kritik stok eşiği hesaplamalarını standart **REST API** mimarisi üzerinden sunar. Ayrıca proje içerisinde API uç noktalarını gerçek zamanlı tüketen **modern bir Web Yönetim Paneli (Dashboard)** yer almaktadır.

### ✨ Temel Özellikler

| Özellik | Açıklama |
| :--- | :--- |
| **Tam Kapsamlı CRUD Mimarisi** | Ürün ekleme (`POST`), listeleme (`GET`), tekil sorgulama (`GET /:id`), güncelleme (`PUT /:id`) ve silme (`DELETE /:id`) işlemleri. |
| **Akıllı Stok Durumu Motoru** | Stok miktarına (`stockKg`) göre ürün durumunu otomatik olarak `stokta` (>10 kg), `kritik_stok` (1–10 kg) veya `tukendi` (0 kg) olarak sınıflandırır. |
| **Özel Logger Middleware** | Gelen her HTTP isteğinin metodunu, hedef adresini (`endpoint`) ve ISO-8601 zaman damgasını hem terminale hem de `logs/requests.log` dosyasına kaydeder. |
| **Kalıcı JSON Veri Katmanı** | Node.js yerleşik `fs` modülü ile senkronize çalışan, 40 gerçekçi kuruyemiş kalemiyle önceden beslenmiş (`pre-seeded`) veri deposu. |
| **Canlı Web Yönetim Paneli** | `http://localhost:3000` adresinde çalışan; kategori filtreleme, arama, envanter değeri hesaplama ve görsel CRUD işlemlerini destekleyen arayüz. |

---

## 🏗️ Sistem Mimarisi

Uygulama, sorumlulukların ayrılması (**Separation of Concerns**) prensibine uygun olarak **Route → Middleware → Controller → Data Layer** katmanlı mimarisiyle tasarlanmıştır.

```mermaid
flowchart LR
    Client["İstemci\n(Postman / Web UI)"] -->|HTTP Request| Express["Express.js Sunucu\n(src/app.js)"]
    Express --> Logger["Logger Middleware\n(src/middlewares/logger.js)"]
    Logger -->|Log Kaydı| LogFile[("logs/requests.log")]
    Logger -->|next()| Router["Product Router\n(src/routes/productRoutes.js)"]
    Router --> Controller["Product Controller\n(src/controllers/productController.js)"]
    Controller <-->|fs Okuma / Yazma| DB[("JSON Veri Deposu\n(src/data/products.json)")]
```

### 📂 Klasör Yapısı

```text
cerezkapisi-inventory-api/
├── logs/
│   └── requests.log                              # Logger middleware tarafından üretilen HTTP erişim kayıtları
├── src/
│   ├── controllers/
│   │   └── productController.js                  # CRUD iş mantığı, stok durumu hesaplama ve dosya G/Ç işlemleri
│   ├── data/
│   │   └── products.json                         # 40 kuruyemiş/ürün kalemini barındıran kalıcı JSON veri tabanı
│   ├── middlewares/
│   │   └── logger.js                             # İstek izleme ve loglama ara katmanı (Middleware)
│   ├── public/
│   │   └── index.html                            # REST API ile haberleşen görsel Envanter Yönetim Paneli
│   ├── routes/
│   │   └── productRoutes.js                      # /api/products uç noktalarının (endpoint) yönlendirme tanımları
│   └── app.js                                    # Express uygulama yapılandırması ve sunucu başlatıcı
├── Kuruyemis_Stok_API.postman_collection.json    # Postman v2.1 hazır test koleksiyonu
├── PROJE_TANITIM_VE_TASARIM_DOKUMANI.md          # İhtiyaç analizi, senaryo ve sistem tasarım dokümanı
├── package.json                                  # Bağımlılıklar ve çalışma betikleri (scripts)
└── README.md                                     # Proje dokümantasyonu
```

---

## 🗄️ Veri Modeli (Data Schema)

Envanterdeki her bir ürün (`Product`), `src/data/products.json` içerisinde aşağıdaki şema yapısıyla saklanır:

| Alan Adı | Veri Tipi | Zorunluluk | Açıklama | Örnek Değer |
| :--- | :--- | :---: | :--- | :--- |
| `id` | `Number` | Otomatik | Benzersiz ürün kimlik numarası (Auto-increment) | `4` |
| `name` | `String` | **Zorunlu** | Ürün adı | `"Kavrulmuş Antep Fıstığı"` |
| `category` | `String` | Opsiyonel | Ürün grubu (`Kavrulmuş Kuruyemiş`, `Çiğ Kuruyemiş`, `Kuru Meyve` vb.) | `"Kavrulmuş Kuruyemiş"` |
| `supplier` | `String` | Opsiyonel | Tedarikçi firma unvanı | `"Antep Bereket Gıda Ltd."` |
| `stockKg` | `Number` | **Zorunlu** | Mevcut stok ağırlığı (Kilogram) | `45.5` |
| `pricePerKg` | `Number` | **Zorunlu** | 1 Kilogram satış fiyatı (₺) | `680` |
| `status` | `String` | Otomatik / Opsiyonel | Stok durumu: `stokta` \| `kritik_stok` \| `tukendi` | `"stokta"` |
| `createdAt` | `String (ISO)` | Otomatik | Kaydın oluşturulma zaman damgası | `"2026-10-15T09:15:00.000Z"` |
| `updatedAt` | `String (ISO)` | Otomatik | Kaydın son güncellenme zaman damgası | `"2026-10-16T14:30:00.000Z"` |

---

## 📡 API Dokümantasyonu

**Temel Adres (Base URL):** `http://localhost:3000`

| Metod | Endpoint | Açıklama | Başarılı Yanıt | Hata Yanıtı |
| :---: | :--- | :--- | :---: | :---: |
| `GET` | `/api/products` | Tüm kuruyemiş envanterini listeler | `200 OK` | - |
| `GET` | `/api/products/:id` | ID'si belirtilen tek bir ürünün detaylarını döner | `200 OK` | `404 Not Found` |
| `POST` | `/api/products` | Envantere yeni bir ürün ekler | `201 Created` | `400 Bad Request` |
| `PUT` | `/api/products/:id` | Ürün bilgilerini, stok miktarını veya fiyatını günceller | `200 OK` | `404 Not Found` |
| `DELETE` | `/api/products/:id` | Belirtilen ürünü envanterden kalıcı olarak siler | `200 OK` | `404 Not Found` |

---

### 🔍 Detaylı Endpoint Örnekleri

<details open>
<summary><b>1. Tüm Ürünleri Listele — <code>GET /api/products</code></b></summary>

#### İstek (Request)
```http
GET /api/products HTTP/1.1
Host: localhost:3000
```

#### Yanıt (Response — `200 OK`)
```json
{
  "success": true,
  "count": 40,
  "data": [
    {
      "id": 1,
      "name": "Kavrulmuş Fındık",
      "category": "Kavrulmuş Kuruyemiş",
      "supplier": "Karadeniz Fındık Tarım A.Ş.",
      "stockKg": 42,
      "pricePerKg": 480,
      "status": "stokta",
      "createdAt": "2026-10-15T09:00:00.000Z",
      "updatedAt": "2026-10-16T14:30:00.000Z"
    }
  ]
}
```
</details>

<details>
<summary><b>2. Tekil Ürün Detayı Getir — <code>GET /api/products/:id</code></b></summary>

#### İstek (Request)
```http
GET /api/products/4 HTTP/1.1
Host: localhost:3000
```

#### Yanıt (Response — `200 OK`)
```json
{
  "success": true,
  "data": {
    "id": 4,
    "name": "Kavrulmuş Antep Fıstığı",
    "category": "Kavrulmuş Kuruyemiş",
    "supplier": "Antep Bereket Gıda Ltd.",
    "stockKg": 45.5,
    "pricePerKg": 680,
    "status": "stokta",
    "createdAt": "2026-10-15T09:15:00.000Z",
    "updatedAt": "2026-10-16T14:30:00.000Z"
  }
}
```
</details>

<details>
<summary><b>3. Yeni Ürün Ekle — <code>POST /api/products</code></b></summary>

#### İstek Gövdesi (Request Body)
```json
{
  "name": "Çifte Kavrulmuş Damla Sakızlı Türk Kahvesi",
  "category": "Ezme & Kahve",
  "supplier": "Tarihi Eminönü Kahvecisi A.Ş.",
  "stockKg": 15,
  "pricePerKg": 510
}
```

#### Yanıt (Response — `201 Created`)
```json
{
  "success": true,
  "message": "Yeni ürün envantere başarıyla eklendi.",
  "data": {
    "id": 41,
    "name": "Çifte Kavrulmuş Damla Sakızlı Türk Kahvesi",
    "category": "Ezme & Kahve",
    "supplier": "Tarihi Eminönü Kahvecisi A.Ş.",
    "stockKg": 15,
    "pricePerKg": 510,
    "status": "stokta",
    "createdAt": "2026-10-17T18:10:00.000Z",
    "updatedAt": "2026-10-17T18:10:00.000Z"
  }
}
```
</details>

<details>
<summary><b>4. Stok ve Fiyat Güncelle — <code>PUT /api/products/:id</code></b></summary>

#### İstek Gövdesi (Request Body)
```json
{
  "stockKg": 8.5,
  "pricePerKg": 720
}
```

#### Yanıt (Response — `200 OK`)
> *Not: Stok miktarı 10 kg eşiğinin altına düştüğü için sistem `status` alanını otomatik olarak `"kritik_stok"` durumuna geçirir.*
```json
{
  "success": true,
  "message": "Ürün ve stok bilgileri başarıyla güncellendi.",
  "data": {
    "id": 4,
    "name": "Kavrulmuş Antep Fıstığı",
    "category": "Kavrulmuş Kuruyemiş",
    "supplier": "Antep Bereket Gıda Ltd.",
    "stockKg": 8.5,
    "pricePerKg": 720,
    "status": "kritik_stok",
    "createdAt": "2026-10-15T09:15:00.000Z",
    "updatedAt": "2026-10-17T18:15:00.000Z"
  }
}
```
</details>

<details>
<summary><b>5. Ürün Sil — <code>DELETE /api/products/:id</code></b></summary>

#### İstek (Request)
```http
DELETE /api/products/41 HTTP/1.1
Host: localhost:3000
```

#### Yanıt (Response — `200 OK`)
```json
{
  "success": true,
  "message": "Ürün envanterden başarıyla silindi.",
  "data": {
    "id": 41,
    "name": "Çifte Kavrulmuş Damla Sakızlı Türk Kahvesi",
    "category": "Ezme & Kahve",
    "supplier": "Tarihi Eminönü Kahvecisi A.Ş.",
    "stockKg": 15,
    "pricePerKg": 510,
    "status": "stokta"
  }
}
```
</details>

---

## 🛠️ Logger Middleware Yapısı

Uygulama içerisindeki `src/middlewares/logger.js` katmanı, sunucuya ulaşan her isteği yakalayarak hem standart çıktıya (`stdout`) hem de `logs/requests.log` dosyasına aşağıdaki formatta yazar:

```log
[2026-10-17T18:05:20.700Z] GET /api/products
[2026-10-17T18:06:41.612Z] GET /api/products/4
[2026-10-17T18:07:15.104Z] POST /api/products
[2026-10-17T18:08:02.490Z] PUT /api/products/4
[2026-10-17T18:08:45.811Z] DELETE /api/products/41
```

---

## 🚀 Kurulum ve Çalıştırma

Projeyi yerel ortamınızda çalıştırmak için aşağıdaki adımları takip edin:

### 1. Depoyu Klonlayın
```bash
git clone https://github.com/nusretyinanc0/cerezkapisi-inventory-api.git
cd cerezkapisi-inventory-api
```

### 2. Bağımlılıkları Yükleyin
```bash
npm install
```

### 3. Sunucuyu Başlatın
```bash
# Standart çalıştırma
npm start

# Geliştirme modu (Dosya değişikliklerinde otomatik yeniden başlatır)
npm run dev
```

Sunucu varsayılan olarak **`http://localhost:3000`** portunda aktif olacaktır:
- **Görsel Web Yönetim Paneli:** [http://localhost:3000](http://localhost:3000)
- **REST API Ana Uç Noktası:** [http://localhost:3000/api/products](http://localhost:3000/api/products)

---

## 🧪 Postman ile Test

Proje kök dizininde yer alan [`Kuruyemis_Stok_API.postman_collection.json`](./Kuruyemis_Stok_API.postman_collection.json) dosyasını Postman uygulamasına **Import** ederek 5 temel CRUD test senaryosunu hazır olarak çalıştırabilirsiniz.

---

<div align="center">
  <sub><b>Backend Geliştirme Eğitimi Projesi</b> kapsamında Node.js & Express.js ile geliştirilmiştir.</sub>
</div>

