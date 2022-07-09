const mongoose = require('mongoose');


const CatSchema = new mongoose.Schema({
        name: {
            type: String,
            lowercase: true,
            required: true
        }
})

module.exports = new mongoose.model('Cat', CatSchema);