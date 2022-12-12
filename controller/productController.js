const { StatusCodes } = require('http-status-codes');
const CustomError = require('../errors');
const fs = require('fs')
const path = require('path')


const SubCategory = require('../model/subCategory.model')
const Product = require('../model/products.model')


const createProduct = async (req, res) => {
    const subCategory = await SubCategory.findById(req.body.subCategory);
    if (!subCategory) {
        throw new CustomError.BadRequestError('Invalid subCategory');
    }
    console.log(req.body);
    const ext = path.extname(req.files.image.name);
    const image = req.files.image
    const imagePath = req.body.name + ext;
    const fileName = imagePath.split(' ').join('-')
    await image.mv("public/upload/" + fileName, async (err) => {
        if (err) {
            throw new CustomError.BadRequestError('unable to save image');
        }
        else {
            const downloadLink = "http://localhost:3000/public/upload/" + fileName;
            let product = new Product({
                name: req.body.name,
                subCategory: req.body.subCategory,
                quantity: req.body.quantity,
                modelNumber: req.body.modelNumber,
                vendor: req.body.vendor,
                costPrice: req.body.costPrice,
                sellingPrice: req.body.sellingPrice,
                image: downloadLink, //"http://localhost:3000/public/upload/" + fileName
                description: req.body.description,
                createdAt: req.body.createdAt,

            })

            const products = await product.save()
            return res.status(StatusCodes.CREATED).json({ products });
        }
    });

}

const getTotalProfit = async (req, res) => {

    const products = await Product.find({})
    let totalProfit = 0;
    products.forEach((e) => {
        totalProfit += (e.sellingPrice - e.costPrice) * e.sold
    });
    console.log(totalProfit);
    res.status(StatusCodes.OK).json({ totalProfit });

}

const getSoldProduct = async (req, res) => {

    const products = await Product.find({})
    let soldProduct = 0;
    products.forEach((e) => {
        soldProduct += e.quantity - e.sold
    });
    console.log(soldProduct);
    res.status(StatusCodes.OK).json({ soldProduct })

}

const getSoldPrice = async (req, res) => {

    const products = await Product.find({})
    let soldprice = 0;
    products.forEach((e) => {
        soldprice += e.sellingPrice * e.sold
    });
    console.log(soldprice);
    res.status(StatusCodes.OK).json({ soldprice })

}


const getTotalStock = async (req, res) => {

    const products = await Product.find({})
    let totalStock = 0;
    products.forEach((e) => {
        totalStock += e.quantity
    });
    console.log(totalStock);
    res.status(StatusCodes.OK).json({ totalStock })
}


const getAllProducts = async (req, res) => {
    const { name, sort, numericFIlter, category, subCategory, vendor } = req.query
    const filter = {}
    if (name) {
        filter.name = { $regex: name, $options: 'i' }
    }
    if (subCategory) {
        filter.subCategory = subCategory
    }
    if (category) {
        filter.category = category
    }
    if (vendor) {
        filter.vendor = vendor
    }
    if (numericFIlter) {
        const operatorMap = {
            '>': '$gt',
            '>=': '$gte',
            '=': '$eq',
            '<': '$lt',
            '<=': '$lte',
        }
        const regEx = /\b(>|>=|=|<|<=)\b/g
        const options = ['costPrice', 'sellingPrice', 'modelNumber', 'quantity']
        let filter = numericFIlter.replace(regEx, (match) => `-${operatorMap[match]}-`)
        filter = filter.split(',').forEach((item) => {
            const [field, operator, value] = item.split('-')
            if (options.includes(field)) {
                filter[field] = { [operator]: Number(value) }
            }
        })
    }
    let result = Product.find(filter)
    if (sort) {
        const sortList = sort.split(',').join(' ')
        result = result.sort(sortList)
    }
    else {
        result = result.sort('createdAt')
    }
    const productList = await result.populate({ path: 'subCategory' });
    if (!productList) {
        res.status(404).json({ msg: 'there is no product' })
    }
    res.status(StatusCodes.OK).json({ productList, nbHits: productList.length })
}

const soldProducts = async (req, res) => {
    const product = await Product.findById(req.params.id).populate('subCategory')
    if (!product) {
        throw new CustomError.NotFoundError('no product with this id')
    }
    let val = product.sold;
    val += Number.parseInt(req.body.sold);
    if (product.quantity < val) {
        return res.send('more than stock')
    }
    product.sold = val;
    product.quantity -= Number.parseInt(req.body.sold);

    await product.save();
    res.status(StatusCodes.OK).json({ product, msg: 'product updated successfully' })
}

const updateProduct = async (req, res) => {
    const subCategory = await SubCategory.findById(req.body.subCategory);
    if (!subCategory) {
        throw new CustomError.NotFoundError('Invalid subCategory')
    }
    console.log(req.body);
    const ext = path.extname(req.files.image.name);
    const image = req.files.image
    const imagePath = req.body.name + ext;
    const fileName = imagePath.split(' ').join('-')
    await image.mv("public/upload/" + fileName, async (err) => {
        if (err) {
            return res.status(400).send('unable to save image')
        }
        const downloadLink = "http://localhost:3000/public/upload/" + fileName;
        const product = await Product.findByIdAndUpdate(req.params.id, {
            name: req.body.name,
            subCategory: req.body.subCategory,
            quantity: req.body.quantity,
            modelNumber: req.body.modelNumber,
            vendor: req.body.vendor,
            costPrice: req.body.costPrice,
            sellingPrice: req.body.sellingPrice,
            image: downloadLink, //"http://localhost:3000/public/upload/" + fileName
            description: req.body.description,
            createdAt: req.body.createdAt,
            sold: req.body.sold
        })
        const imageResponse = product.image
        imageToDelete = imageResponse.replace('http://localhost:3000/public/upload/', "public/upload/");
        if (fs.existsSync(imageToDelete)) {
            console.log('gebtual');
            fs.unlinkSync(`${imageToDelete}`)
        }
        if (!product) {
            throw new CustomError.BadRequestError('invalid product');
        }
        res.status(StatusCodes.CREATED).json({ product, msg: 'product updated successfully' })
    });
}

const deleteProduct = async (req, res) => {

    const deleteProduct = await Product.findById(req.params.id);
    if (!deleteProduct) {
        throw new CustomError.NotFoundError('no product by this id')
    }
    else {
        const imageResponse = deleteProduct.image
        console.log(imageResponse)
        imageToDelete = imageResponse.replace('http://localhost:3000/public/upload/', "public/upload/");
        if (fs.existsSync(imageToDelete)) {
            console.log('gebtual')
            fs.unlinkSync(`${imageToDelete}`)
        }
        await deleteProduct.delete();
        console.log('successfully deleted file');
        return res.status(StatusCodes.OK).json({ deleteProduct, msg: 'this item is deleted' })
    }
}


module.exports = {
    getAllProducts,
    getSoldPrice,
    getSoldProduct,
    getTotalProfit,
    getTotalStock,
    createProduct,
    updateProduct,
    deleteProduct,
    soldProducts
}


//multer gridfs-stream
//multer-gridfs-storage