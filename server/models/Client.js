//GraphQl schema sits on top of mongoose schema
//mongoose schema itself sits on top of mongodb database

const mongoose = require('mongoose');

const ClientSchema = new mongoose.Schema({
    name:{
        type: String
    },
    email:{
        type: String
    },
    phone:{
        type: String
    }
})

module.exports = mongoose.model('Client', ClientSchema)