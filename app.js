const path = require('path');
const express = require('express');
const ejs = require('ejs');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const app = express();

const connection=mysql.createConnection({
    host:'localhost',
    user:'root',
    password:'',
    database:'studentdetails'
});

connection.connect(function(error){
    if(!!error) console.log(error);
    else console.log('Database Connected!');
}); 

//set views file
app.set('views',path.join(__dirname,'views'));
			
//set view engine
app.set('view engine', 'ejs');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));



app.get('/',(req, res) => {
    // res.send('student details');
    let sql = "SELECT * FROM student";
    let query = connection.query(sql, (err, rows) => {
        if(err) throw err;
        res.render('user_index', {
            title : 'Student Details',
            users : rows
        });
    });
});


app.get('/add',(req, res) => {
    res.render('user_add', {
        title : 'Student Details'
    });
});

app.post('/save',(req, res) => { 
    let data = {fname: req.body.fname, lname: req.body.lname,email: req.body.email, address: req.body.address};
    let sql = "INSERT INTO student SET ?";
    let query = connection.query(sql, data,(err, results) => {
      if(err) throw err;
      res.redirect('/');
    });
});

app.get('/edit/:userId',(req, res) => {
    const userId = req.params.userId;
    let sql = `Select * from student where id = ${userId}`;
    let query = connection.query(sql,(err, result) => {
        if(err) throw err;
        res.render('user_edit', {
            title : 'Student Details',
            user : result[0]
        });
    });
});


app.post('/update',(req, res) => {
    const userId = req.body.id;
    let sql = "update student SET fname='"+req.body.fname+"',lname='"+req.body.lname+"',  email='"+req.body.email+"',  address='"+req.body.address+"' where id ="+userId;
    let query = connection.query(sql,(err, results) => {
      if(err) throw err;
      res.redirect('/');
    });
});





// Server Listening
app.listen(3000, () => {
    console.log('Server is running at port 3000');
});