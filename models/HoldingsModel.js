const mongoose = require("mongoose");
const HoldingSchema = require("../shcemas/HoldingSchema");

const HoldingsModel = mongoose.model("holding",HoldingSchema);

module.exports = HoldingsModel;