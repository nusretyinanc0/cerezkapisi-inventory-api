const fs = require('fs');
const path = require('path');

// Kuruyemiş verilerimizin tutulduğu JSON dosyasının yolu
const dataFilePath = path.join(__dirname, '../data/products.json');

// Yardımcı Fonksiyon 1: JSON dosyasından ürünleri oku
const readProductsFromFile = () => {
  try {
    const data = fs.readFileSync(dataFilePath, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
};

// Yardımcı Fonksiyon 2: Güncel ürün listesini JSON dosyasına yaz
const writeProductsToFile = (products) => {
  fs.writeFileSync(dataFilePath, JSON.stringify(products, null, 2), 'utf-8');
};

/**
 * 1. Ürün Ekleme (POST /api/products)
 * Dükkana yeni bir kuruyemiş/ürün ekler.
 */
const createProduct = (req, res) => {
  const { name, category, supplier, stockKg, pricePerKg, status } = req.body;

  // Zorunlu alan kontrolü
  if (!name || stockKg === undefined || pricePerKg === undefined) {
    return res.status(400).json({
      success: false,
      message: 'Ürün adı (name), stok miktarı (stockKg) ve kilo fiyatı (pricePerKg) alanları zorunludur.'
    });
  }

  const products = readProductsFromFile();
  const newId = products.length > 0 ? Math.max(...products.map((p) => p.id)) + 1 : 1;
  const now = new Date().toISOString();

  // Stok durumunu (status) otomatik belirleme veya gelen değeri kullanma
  let calculatedStatus = status;
  if (!calculatedStatus) {
    if (Number(stockKg) <= 0) calculatedStatus = 'tukendi';
    else if (Number(stockKg) <= 10) calculatedStatus = 'kritik_stok';
    else calculatedStatus = 'stokta';
  }

  const newProduct = {
    id: newId,
    name,
    category: category || 'Genel Kuruyemiş',
    supplier: supplier || 'Belirtilmedi',
    stockKg: Number(stockKg),
    pricePerKg: Number(pricePerKg),
    status: calculatedStatus,
    createdAt: now,
    updatedAt: now
  };

  products.push(newProduct);
  writeProductsToFile(products);

  res.status(201).json({
    success: true,
    message: 'Yeni ürün envantere başarıyla eklendi.',
    data: newProduct
  });
};

/**
 * 2. Ürün Listeleme (GET /api/products)
 * Dükkandaki tüm kuruyemişleri ve stok durumlarını listeler.
 */
const getAllProducts = (req, res) => {
  const products = readProductsFromFile();

  res.status(200).json({
    success: true,
    count: products.length,
    data: products
  });
};

/**
 * 3. Ürün Detayı (GET /api/products/:id)
 * ID'si verilen tek bir kuruyemişin detaylarını getirir.
 */
const getProductById = (req, res) => {
  const productId = parseInt(req.params.id, 10);
  const products = readProductsFromFile();
  const product = products.find((p) => p.id === productId);

  if (!product) {
    return res.status(404).json({
      success: false,
      message: `${productId} ID'li ürün envanterde bulunamadı.`
    });
  }

  res.status(200).json({
    success: true,
    data: product
  });
};

/**
 * 4. Ürün / Stok Güncelleme (PUT /api/products/:id)
 * Mevcut bir ürünün kilosunu, fiyatını, tedarikçisini veya durumunu günceller.
 */
const updateProduct = (req, res) => {
  const productId = parseInt(req.params.id, 10);
  const products = readProductsFromFile();
  const productIndex = products.findIndex((p) => p.id === productId);

  if (productIndex === -1) {
    return res.status(404).json({
      success: false,
      message: `${productId} ID'li ürün envanterde bulunamadı.`
    });
  }

  const { name, category, supplier, stockKg, pricePerKg, status } = req.body;
  const currentProduct = products[productIndex];

  const updatedStockKg = stockKg !== undefined ? Number(stockKg) : currentProduct.stockKg;

  // Eğer status gönderilmediyse ancak stockKg değiştiyse durumu otomatik güncelle
  let updatedStatus = currentProduct.status;
  if (status !== undefined) {
    updatedStatus = status;
  } else if (stockKg !== undefined) {
    if (updatedStockKg <= 0) updatedStatus = 'tukendi';
    else if (updatedStockKg <= 10) updatedStatus = 'kritik_stok';
    else updatedStatus = 'stokta';
  }

  const updatedProduct = {
    ...currentProduct,
    name: name !== undefined ? name : currentProduct.name,
    category: category !== undefined ? category : currentProduct.category,
    supplier: supplier !== undefined ? supplier : currentProduct.supplier,
    stockKg: updatedStockKg,
    pricePerKg: pricePerKg !== undefined ? Number(pricePerKg) : currentProduct.pricePerKg,
    status: updatedStatus,
    updatedAt: new Date().toISOString()
  };

  products[productIndex] = updatedProduct;
  writeProductsToFile(products);

  res.status(200).json({
    success: true,
    message: 'Ürün ve stok bilgileri başarıyla güncellendi.',
    data: updatedProduct
  });
};

/**
 * 5. Ürün Silme (DELETE /api/products/:id)
 * ID'si verilen ürünü envanterden siler.
 */
const deleteProduct = (req, res) => {
  const productId = parseInt(req.params.id, 10);
  const products = readProductsFromFile();
  const productIndex = products.findIndex((p) => p.id === productId);

  if (productIndex === -1) {
    return res.status(404).json({
      success: false,
      message: `${productId} ID'li ürün envanterde bulunamadı.`
    });
  }

  const deletedProduct = products.splice(productIndex, 1)[0];
  writeProductsToFile(products);

  res.status(200).json({
    success: true,
    message: 'Ürün envanterden başarıyla silindi.',
    data: deletedProduct
  });
};

module.exports = {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct
};
