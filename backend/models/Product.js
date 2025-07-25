const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
    {
        name: { type: String, required: true},
        description: String,
        price: { type: Number, required: true},
        category: String,
        stock:{ type: Number, default: 0},
        imageUrl: String,
    },
    {timestamps: true}
);

module.exports = mongoose.model("Product", productSchema); 