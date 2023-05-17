//GraphQl schema sits on top of mongoose schema
//mongoose schema itself sits on top of mongodb database

const mongoose = require('mongoose');

const ProjectSchema = new mongoose.Schema({
    name:{
        type: String
    },
    description:{
        type: String
    },
    status:{
        type: String,
        enum:['Not Started', 'In Progress', 'Completed']
    },
    /*this part is little tricky.essentially we are telling mongoose that use the "Client" MODEL as
    an id for each record of the project.note that we are not importing Client or anything.it just can
    access it internally via its name */
    clientId:{ 
        type:mongoose.Schema.Types.ObjectId,
        ref:'Client'
    }
})

module.exports = mongoose.model('Project', ProjectSchema)