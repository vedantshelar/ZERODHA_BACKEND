const UserSchema = require("../shcemas/UserSchema");
const mongoose = require("mongoose");

const User = mongoose.model("user",UserSchema);

module.exports=User;