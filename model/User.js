const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    email: String,
    password: String,
    firstname: String,
    lastname: String,
    adresse: String,
    telephone: String,
    admin:{ type:Boolean, 
            default: false
        } 

})

module.exports = mongoose.model("User", userSchema)