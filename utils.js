const bcrypt = require("bcrypt");

async function generateHashPassword(plainTextPassword){
    const saltRounds = 10;
    const hash = await bcrypt.hash(plainTextPassword, saltRounds);
    return hash;
}

async function isValidPassword(plainTextPassword,hashedPassword){
    const result = await bcrypt.compare(plainTextPassword, hashedPassword);
    return result;
}

module.exports = {generateHashPassword,isValidPassword}