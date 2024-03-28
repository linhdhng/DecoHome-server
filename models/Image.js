const mongoose = require("mongoose")

const ImageSchema = new mongoose.Schema(
    {
        name: String,
        data: Buffer,
        contentType: String
    },
    {
        collection: "products"
    }
)

module.exports = mongoose.model("imageDetails", ImageSchema)