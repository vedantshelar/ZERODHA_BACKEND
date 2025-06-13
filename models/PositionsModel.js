const mongoose = require("mongoose");
const PositionsSchema = require("../shcemas/PositionsSchema");

const PositionsModel = mongoose.model("position",PositionsSchema);

module.exports = PositionsModel; 