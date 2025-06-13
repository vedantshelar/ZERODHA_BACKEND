const mongoose = require("mongoose");
const OrdersSchema = require("../shcemas/OrdersSchema");

const OrdersModel = mongoose.model("order",OrdersSchema);

module.exports = OrdersModel;