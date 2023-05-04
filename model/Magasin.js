const mongoose = require('mongoose')

const magasinSchema = new mongoose.Schema({
    title: String,
    banner: String,
    adresse: String,
    description: String,

})

module.exports = mongoose.model("Magasin", magasinSchema)