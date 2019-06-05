let mongoose = require('mongoose');

let subject = mongoose.Schema({
    title:{
        type:String,
        required: true
    },
    grades:{
        type:Set,
        required: false
    }
});

let grade = mongoose.Schema({
    student:{
        
    }
})

let Art = module.exports = mongoose.model('Art', artSchema);