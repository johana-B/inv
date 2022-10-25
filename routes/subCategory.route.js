const express = require('express')
const fs = require('fs')

const subCategoryRouter = express.Router()

const SubCategory = require('../model/subCategory.model')
const Category = require('../model/category.model')
const Product = require('../model/products.model')

const asyncWrapper = require('../middleware/asyncWrapper')


subCategoryRouter.get('/',asyncWrapper( async (req, res) =>{
    const {name, sort,category} = req.query
     filter = {}
     if(category){
        filter.category = category
     }
     if(name){
        filter.name = {$regex:name, $options:'e'}
     }

    let result = SubCategory.find(filter)
    
    if(sort){
        const sortList = sort.split(',').join(' ')
        result = result.sort(sortList)
    }

    const subCategorys = await result.populate('category')
    if (!subCategorys){
        return res.status(404).json({msg:'there is no subcategory with this id'})
    }
    res.status(200).json({subCategorys})
}))

subCategoryRouter.get('/:id',asyncWrapper( async (req, res) => {
    const subCategory = await SubCategory.findById(req.params.id).populate('category')

    if (!subCategory) {
        res.status(404).json({ msg: 'The category with the given ID not exists'})
    }
    res.status(201).json({subCategory})
}))

subCategoryRouter.post('/',asyncWrapper( async (req, res) =>{
    const category = await Category.findById(req.body.category);
    if (!category){
        return res.status(400).send('Invalid Category')
    }
    let subCategory = new SubCategory({
        name: req.body.name,
        category:req.body.category
    })

    const subCategorys = await subCategory.save()

    if (!subCategorys)
        return res.status(500).send('subCategory cannot be created')

    res.status(200).json({subCategorys,msg:'subCategory is created successfully'})
}))

subCategoryRouter.patch('/:id',asyncWrapper( async (req, res) =>{
    const category = Category.find(req.query.category)
    if(!category){
        return res.status(404).json({msg:'invalid category'})
    }
    const subCategory = await SubCategory.findOneAndUpdate(req.query.id, {
        name: req.body.name,
        category: req.body.category,
    }).populate('category')
    if(!subCategory){
        return res.status(404).json({msg:'invalid subCategory'}) 
    }
    res.status(200).json({subCategory, msg:'subCategory is updated successfully'})
}))

subCategoryRouter.delete('/:id',asyncWrapper( async (req, res) =>{
    const {id:subCategoryID} = req.params
    const subCategory = await SubCategory.findByIdAndDelete({_id:subCategoryID})
    await Product.deleteMany({subCategory:subCategoryID})
    if(!subCategory){
        return res.status(404).json({msg:'invalid product'})  
    }
    res.status(200).json({subCategory, msg:'subCategory is deleted successfully'}) 
}))



module.exports = subCategoryRouter