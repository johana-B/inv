const fs = require('fs')
const { StatusCodes } = require('http-status-codes');
const CustomError = require('../errors');

const Category = require('../model/category.model')
const Product = require('../model/products.model')
const SubCategory = require('../model/subCategory.model')

const getAllCategory = async (req, res) => {
    const catagory = await Category.find()
    if (!catagory) {
        throw new CustomError.NotFoundError('there is no category');
    }
    res.status(StatusCodes.OK).json({ catagory, nbHits: catagory.length })
}

const getSingleCategory = async (req, res) => {
    const category = await Category.findById(req.params.id);
    if (!category) {
        throw new CustomError.NotFoundError('The category with the given ID not exists');
    }
    res.status(StatusCodes.OK).json({ category })
}

const createCategory = async (req, res) => {
    const category = await Category.create({ name: req.body.name })
    if (!category) {
        throw new CustomError.BadRequestError('category can not be created');
    }
    res.status(StatusCodes.CREATED).json({ category, msg: 'Category is created successfully' })
}

const updateCategory = async (req, res) => {

    const category = await Category.findByIdAndUpdate(req.params.id, { name: req.body.name, })
    if (!category) {
        throw new CustomError.NotFoundError('The category with the given ID not exists');
    }
    res.status(StatusCodes.CREATED).json({ category, msg: 'Category is updated successfully' })

}

const deleteCategory = async (req, res) => {
    const { id: categoryID } = req.params
    const category = await Category.findById({ _id: categoryID })
    const products = await Product.find({ category: categoryID })

    if (!category) {
        throw new CustomError.NotFoundError('The category with the given ID not exists');
    }
    products.forEach((product) => {
        const imageResponse = product.image
        imageToDelete = imageResponse.replace('http://localhost:3000/public/upload/', "public/upload/");
        if (fs.existsSync(imageToDelete)) {
            fs.unlinkSync(`${imageToDelete}`)
        }
    })
    await Product.deleteMany({ category: categoryID })
    await SubCategory.deleteMany({ category: categoryID })
    await Category.deleteOne({ category: categoryID })

    res.status(StatusCodes.OK).json({ category, msg: 'Category is deleted successfully' })
}


module.exports = {
    createCategory,
    getAllCategory,
    getSingleCategory,
    updateCategory,
    deleteCategory,
}