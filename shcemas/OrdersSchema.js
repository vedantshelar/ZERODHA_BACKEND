const mongoose = require("mongoose")

const OrdersSchema = new mongoose.Schema({
    name:String,
    qty:Number,
    price:Number,
    mode:String,
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"user" 
    }
});

module.exports = OrdersSchema;