const express = require('express');
const bodyParser= require('body-parser');
const path = require('path');
const mongoose = require('mongoose');

// Init app
const app = express();
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')))

let Student = require('./models/student.js');
let Teacher = require('./models/teacher.js');
let Grade = require('./models/grade.js');
mongoose.connect('mongodb://localhost/dziekanat');
let db = mongoose.connection;

// Check connection
db.once('open', () =>{
  console.log('Connected to mongodb');
});
// Check for db errors
db.on('error', (err) => {
  console.log(err);
})

// Load view engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug')


const MongoClient = require('mongodb').MongoClient

//// Home route
app.get('/', (req, res) => {
  res.render('index', {});
})

app.post('/', (req, res) => {
  let log = req.body.login;
  let pass = req.body.password;
  Student.find({login:log, password:pass}, (err, student) => {
    if(err){
      window.alert("Wrong parrword. Try again.")
      res.redirect('/');
    }else{
      if(student == ''){
        //if not student, check if teacher
        Teacher.find({login:log, password:pass}, (err, teacher) => {
          if(err){
            res.redirect('/');
          }else{
            console.log("Teacher logged in");
            res.redirect('/teacher');
          }
        });
      }else{
        console.log("Student logged in");
        let dest = '/student/' + student[0].studentid + '/' +student[0]._id;
        res.redirect(dest);
      }
    }
  });
  
});

//// Registration
app.get('/register', (req, res) => {
  res.render('register', {});
});

//// Teacher route
app.get('/teacher', (req, res) => {
  Grade.find({}, (err, grades) => {
    if (err) console.log(err);
    else{
      res.render('teacher', {
        grades: grades
    });
    }
  })
});

//// Teacher route
app.get('/teacher/add', (req, res) => {
  res.render('teacher_add', {});
});

//// Teacher add grade
app.post('/teacher/add', (req, res) => {
  let subj = req.body.subject;
  let sid =  req.body.studentid;
  let gra = req.body.grade;
  let desc = req.body.description;

  Grade.find({subject:subj, studentid:sid}, (err, g) => {
    if (err){
      console.log(err);
    }else{
      if (g.length == 0){
        //no grades
        let newgrade = new Grade();
        newgrade.subject = subj;
        newgrade.studentid = sid;
        newgrade.grades = [{grade:gra, description:desc}];

        newgrade.save((err) => {
          if (err) console.log(err)
          else {
            console.log("Submitted");
          }
        });
      }else{
        //add new grade
        let newgrade = {};
        newgrade.subject = subj;
        newgrade.studentid = sid;
        var arr = g[0].grades;
        arr.push({grade:gra, description:desc});
        newgrade.grades = arr;
        console.log(newgrade);

        Grade.update({_id: g[0]._id}, newgrade, function(err, doc){
          if(err){
            console.log(err);
          }else{       
            console.log("ok");
          }
        });
      }
      res.redirect('/teacher');
    }
  });

});

app.get('/teacher/grade/:gradeid', (req, res) => {
  let gradeid = req.params.gradeid;
  console.log(gradeid);
  Grade.find({_id: gradeid}, (err, grade) => {
    res.render('teacher_grade', {
      grade: grade[0]
    });
  })
})

app.get('/teacher/grade/edit/:gradeid', (req, res) => {
  Grade.findById(req.params.gradeid, (err, grade) =>{
    res.render('teacher_edit', {
      grade: grade
    })
  })
})

//// Teacher edit grade
app.post('/teacher/grade/edit/:gradeid', (req, res) => {
  let subj = req.body.subject;
  let sid =  req.body.studentid;
  let gra = req.body.grade;
  let gradeid = req.params.gradeid;

  let newgrade = {};
  newgrade.subject = subj;
  newgrade.studentid = sid;
  newgrade.grades = JSON.parse(gra);
  Grade.update({_id: gradeid}, newgrade, function(err, doc){
    if(err){
      console.log(err);
    }else{       
      console.log("ok");
    }
  });
  res.redirect('/teacher');

});

//// Teacher delete grade
app.delete('/teacher/grade/:id', (req, res) => {
  let query = {_id:req.params.id}
  Grade.remove(query, (err) => {
    if (err) console.log(err)
    else{
      res.send('success');
    }
  })
});


//// Student route
app.get('/student/:id/:dbid', (req, res) => {
  let dbid = req.params.dbid;
  let id = req.params.id;
  Grade.find({studentid:id}, (err, grades) =>{
    res.render('student', {
      studentid: id,
      grades: grades
    });
  }); 
});

app.listen(3000, () => {
  console.log('Server started on port 3000');
});