let mongoose = require('mongoose');

let teacherSchema = mongoose.Schema({
    teacherid:{
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

let Teacher = module.exports = mongoose.model('Teacher', teacherSchema);