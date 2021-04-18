const mongoose = require("mongoose");

const Product = new mongoose.Schema(
    {
        productname:{
            type: String,
        },
        price:{
            type: Number,
            required: [true,"Enter Ticket Rate"],
        },
        brand:{
            type: String,
            
        },
        photo: {
            type: String,
            default: "no-photo.jpg",
          },
          createdAt: {
            type: Date,
            default: Date.now,
          },
    }
);

module.exports = mongoose.model("Product",Product);
