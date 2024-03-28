const mongoose = require('mongoose')

const productSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true
        },
        image: {
            data: Buffer,
            contentType: String
        },
        description: {
            type: String,
            required: true
        },
        category: {
            type: String,
            required: true
        },
        material: {
            type: String
        },
        price: {
            type: String,
            required: true
        }
    },
    {
        timestamps: true
    }
)

module.exports = mongoose.model('Product', productSchema)