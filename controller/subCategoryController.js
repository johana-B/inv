const fs = require('fs')
const { StatusCodes } = require('http-status-codes');
const CustomError = require('../errors');

const SubCategory = require('../model/subCategory.model')
const Category = require('../model/category.model')
const Product = require('../model/products.model')

const getAllSubCategories = async (req, res) => {
    const { name, sort, category } = req.query
    filter = {}
    if (category) {
        filter.category = category
    }
    if (name) {
        filter.name = { $regex: name, $options: 'e' }
    }

    let result = SubCategory.find(filter)

    if (sort) {
        const sortList = sort.split(',').join(' ')
        result = result.sort(sortList)
    }
    const subCategorys = await result.populate('category')
    if (!subCategorys) {
        throw new CustomError.NotFoundError('there is no subcategory with this id')
    }
    res.status(StatusCodes.OK).json({ subCategorys, nbHits: subCategorys.length })
};

const getSingleSubCategory = async (req, res) => {
    const subCategory = await SubCategory.findById(req.params.id).populate('category')

    if (!subCategory) {
        throw new CustomError.NotFoundError('there is no subcategory with this id');
    }
    res.status(StatusCodes.OK).json({ subCategory })
};

const createSubCategory = async (req, res) => {
    const category = await Category.findById(req.body.category);
    if (!category) {
        throw new CustomError.BadRequestError('invalid category')
    }
    let subCategory = new SubCategory({
        name: req.body.name,
        category: req.body.category
    })
    const subCategorys = await subCategory.save()
    if (!subCategorys)
        throw new CustomError.BadRequestError('subCategory cannot be created');

    res.status(StatusCodes.CREATED).json({ subCategorys, msg: 'subCategory is created successfully' })
}

const updateSubCAtegory = async (req, res) => {
    const category = Category.find(req.query.category)
    if (!category) {
        throw new CustomError.BadRequestError('invalid category');
    }
    const subCategory = await SubCategory.findOneAndUpdate(req.query.id, {
        name: req.body.name,
        category: req.body.category,
    }).populate('category')
    if (!subCategory) {
        throw new CustomError.BadRequestError('subCategory cannot be updated');
    }
    res.status(StatusCodes.CREATED).json({ subCategory, msg: 'subCategory is updated successfully' })
}

const deleteSubCategory = async (req, res) => {
    const { id: subCategoryID } = req.params
    const subCategory = await SubCategory.findById({ _id: subCategoryID })
    const products = await Product.find({ subCategory: subCategoryID })
    if (!subCategory) {
        throw new CustomError.BadRequestError('invalid subcategory');
    }
    products.forEach((product) => {

        const imageResponse = product.image
        imageToDelete = imageResponse.replace('http://localhost:3000/public/upload/', "public/upload/");
        if (fs.existsSync(imageToDelete)) {
            fs.unlinkSync(`${imageToDelete}`)
        }
    })
    await Product.deleteMany({ subCategory: subCategoryID })
    await SubCategory.deleteOne({ subCategory: subCategoryID })

    res.status(StatusCodes.OK).json({ subCategory, msg: 'subCategory is deleted successfully' })
};



module.exports = {
    createSubCategory,
    getAllSubCategories,
    getSingleSubCategory,
    updateSubCAtegory,
    deleteSubCategory
}