const express = require('express');
const router = express.Router();
const {
    getAllProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
} = require('../controllers/productController');

const authMiddleware = require('../middleware/authMiddleware');

// 判断是否 admin 用户
const isAdmin = (req, res, next) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Admins only!' });
    }
    next();
};

router.get('/', getAllProducts);
router.get('/:id',getProductById);

// login + admin
router.post('/', authMiddleware, isAdmin, createProduct);
router.put('/:id',authMiddleware, isAdmin, updateProduct);
router.delete('/:id', authMiddleware, isAdmin, deleteProduct);

module.exports = router;