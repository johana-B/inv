const mongoose = require('mongoose')

const subCategorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim:true
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'category',
        required:true
    },
})

subCategorySchema.virtual('id').get(function () {
    return this._id.toHexString()
})

subCategorySchema.set('toJSON', {
    virtuals:true,
})

module.exports = mongoose.model('subCategory', subCategorySchema);