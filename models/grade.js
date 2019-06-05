let mongoose = require('mongoose');

let gradeSchema = mongoose.Schema({
    subject:{
        type:String,
        required: true
    },
    studentid:{
        type:Number,
        required: true
    },
    grades:[{
        grade:Number,
        description:String
    }]
    /*
    grade:{
        type:Number,
        required: true
    },
    
    description:{
        type:String,
        required: false
    }
    */
});

let Grade = module.exports = mongoose.model('Grade', gradeSchema);