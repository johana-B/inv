const express = require('express')

const router = express.Router()

const { FirebaseAuthentication, autorizedUser } = require('../middleware/authentication');

const {
    getAllProducts,
    getSoldPrice,
    getSoldProduct,
    getTotalProfit,
    getTotalStock,
    createProduct,
    updateProduct,
    deleteProduct,
    soldProducts
} = require('../controller/productController');

router
    .route('/')
    .post(createProduct)
    .get(getAllProducts)

router
    .route('/:id')
    .patch(updateProduct)
    .delete(deleteProduct)

router
    .route('/totalProfit')
    .get([FirebaseAuthentication, autorizedUser('admin')], getTotalProfit)

router
    .route('/soldProduct')
    .get([FirebaseAuthentication, autorizedUser('admin')], getSoldProduct)

router
    .route('/soldprice')
    .get([FirebaseAuthentication, autorizedUser('admin')], getSoldPrice)

router
    .route('/totalStock')
    .get([FirebaseAuthentication, autorizedUser('admin')], getTotalStock)

router
    .route('/soldPro/:id')
    .patch(soldProducts)


module.exports = router