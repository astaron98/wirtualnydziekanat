let mongoose = require('mongoose');

let studentSchema = mongoose.Schema({
    studentid:{
        type:Number,
        required: true
    },
    login:{
        type:String,
        required: true
    },
    password:{
        type:String,
        required: true
    }
});

let Student = module.exports = mongoose.model('Student', studentSchema);