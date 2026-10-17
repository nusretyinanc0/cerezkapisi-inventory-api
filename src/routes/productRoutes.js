const express = require('express');
const router = express.Router();
const {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct
} = require('../controllers/productController');

// /api/products adresine gelen GET (Listeleme) ve POST (Ekleme) istekleri
router.route('/')
  .get(getAllProducts)
  .post(createProduct);

// /api/products/:id adresine gelen GET (Detay), PUT (Güncelleme) ve DELETE (Silme) istekleri
router.route('/:id')
  .get(getProductById)
  .put(updateProduct)
  .delete(deleteProduct);

module.exports = router;
