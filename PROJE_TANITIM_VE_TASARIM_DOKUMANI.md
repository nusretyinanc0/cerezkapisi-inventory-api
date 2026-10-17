# ÇerezKapısı — Kuruyemiş Dükkanı Envanter ve Stok Yönetim Sistemi API
**Aşama 1: Proje Tanıtım, Veri Modeli ve API Tasarım Dokümanı**

---

## 1. Projenin Amacı
Bu projenin amacı, Node.js ve Express.js kullanarak bir kuruyemiş dükkanının günlük stok, ürün, fiyat ve tedarik süreçlerini yönetebileceği **RESTful API** mimarisine uygun bir arka uç (backend) sistemi geliştirmektir.

---

## 2. Sistem Senaryosu
Bir kuruyemiş dükkanı; tezgahındaki ve deposundaki ürünlerin (Antep fıstığı, Giresun fındığı, kuru incir, badem vb.) kaç kilogram kaldığını, kilogram satış fiyatlarını, ürünlerin tazelik/kavrulma kategorilerini ve stok durumlarını (`stokta`, `kritik_stok`, `tukendi`) takip etmek istemektedir.

Özellikle bayram ve yılbaşı gibi yoğun dönemlerde hangi kuruyemişin azaldığını görmek, yeni gelen çuvalları stoğa eklemek ve fiyatları güncellemek için merkezi bir **Envanter ve Stok Yönetim REST API** servisine ihtiyaç duyulmaktadır.

### Sistem Ne Yapmalı?
- Dükkana yeni gelen kuruyemiş/kuru meyve çeşitlerinin sisteme eklenmesini sağlamalı,
- Mevcut tüm kuruyemişlerin kilogram stokları ve fiyatlarıyla listelenmesini desteklemeli,
- Tek bir ürünün detay bilgilerini (tedarikçi firma, kategorisi, kalan kilosu vb.) getirebilmeli,
- Satış yapıldıkça veya yeni mal geldikçe stok miktarının (`stockKg`), fiyatının (`pricePerKg`) ve stok durumunun (`status`) güncellenmesine izin vermeli,
- Artık satılmayan ürünlerin envanterden silinmesini sağlamalı,
- Gelen tüm API isteklerini **Logger Middleware** ile kayıt altına almalıdır.

---

## 3. Veri Modeli Tasarımı

Envanterdeki her bir kuruyemiş ürünü JSON formatında aşağıdaki veri yapısıyla temsil edilir:

| Alan Adı | Veri Tipi | Zorunluluk | Açıklama | Örnek Değer |
| :--- | :--- | :--- | :--- | :--- |
| `id` | `Number` | Otomatik | Ürünün benzersiz kimlik numarası | `1` |
| `name` | `String` | Zorunlu | Kuruyemişin adı | `"Kavrulmuş Antep Fıstığı"` |
| `category` | `String` | Opsiyonel | Ürün kategorisi (`Kavrulmuş`, `Çiğ`, `Kuru Meyve`, `Şekerleme`) | `"Kavrulmuş Kuruyemiş"` |
| `supplier` | `String` | Opsiyonel | Ürünün alındığı tedarikçi firma adı | `"Antep Bereket Gıda Ltd."` |
| `stockKg` | `Number` | Zorunlu | Depoda/tezgahta kalan miktar (Kilogram) | `45.5` |
| `pricePerKg` | `Number` | Zorunlu | 1 Kilogram satış fiyatı (TL) | `680` |
| `status` | `String` | Opsiyonel | Stok durumu (`stokta`, `kritik_stok`, `tukendi`) | `"stokta"` |
| `createdAt` | `String (ISO)` | Otomatik | Ürünün stoğa ilk eklenme tarihi | `"2026-10-17T09:00:00.000Z"` |
| `updatedAt` | `String (ISO)` | Otomatik | Stok/fiyat bilgisinin son güncellenme tarihi | `"2026-10-17T14:30:00.000Z"` |

### Örnek JSON Veri Nesnesi
```json
{
  "id": 1,
  "name": "Kavrulmuş Antep Fıstığı (Ana Çıtlak)",
  "category": "Kavrulmuş Kuruyemiş",
  "supplier": "Antep Bereket Gıda Ltd.",
  "stockKg": 45.5,
  "pricePerKg": 680,
  "status": "stokta",
  "createdAt": "2026-10-17T09:00:00.000Z",
  "updatedAt": "2026-10-17T09:00:00.000Z"
}
```

---

## 4. API Mimarisi ve Endpoint Listesi

Temel URL (Base URL): `http://localhost:3000`

| # | İşlem (CRUD) | HTTP Metodu | Endpoint | Durum Kodu | Açıklama |
| :- | :--- | :--- | :--- | :--- | :--- |
| 1 | **Ürün Ekleme** | `POST` | `/api/products` | `201 Created` | Dükkana yeni bir kuruyemiş/ürün ekler. |
| 2 | **Ürün Listeleme** | `GET` | `/api/products` | `200 OK` | Dükkandaki tüm kuruyemişleri ve stoklarını listeler. |
| 3 | **Ürün Detayı** | `GET` | `/api/products/:id` | `200 OK` | ID'si verilen tek bir kuruyemişin detaylarını getirir. |
| 4 | **Stok/Ürün Güncelleme** | `PUT` | `/api/products/:id` | `200 OK` | Ürünün kalan kilosunu (`stockKg`), kg fiyatını veya durumunu günceller. |
| 5 | **Ürün Silme** | `DELETE` | `/api/products/:id` | `200 OK` | ID'si verilen ürünü envanterden kaldırır. |
