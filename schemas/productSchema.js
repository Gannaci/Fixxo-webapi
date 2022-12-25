const  mongoose = require('mongoose')

const productSchema = mongoose.Schema ({
    tag: {type: String},
    name: {type: String, required: true},
    description: {type: String},
    price: {type: Number, required: true},
    rating: {type: Number},
    imageName: {type: String},
    category: {type: String}
})

module.exports = mongoose.model("products", productSchema)
