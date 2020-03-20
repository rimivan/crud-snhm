const path = require('path');
const express = require('express');
const hbs = require('hbs'); /* use hbs view engine */
const bodyParser = require('body-parser');
//use mysql database
const mysql = require('mysql');
const app = express();
/** Sequelize */
const Sequelize = require('sequelize');

const DB_HOST = require("./constants").host;
const UserModel = require("./model/user").User;


let sequelize = new Sequelize('sequelize-db', 'root', 'root', {
  host: DB_HOST,
  dialect: 'mysql',
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
});

sequelize.authenticate()
 .then(() => {
   console.log('Connection has been established successfully.');
 })
 .catch(err => {
   console.error('Unable to connect to the database:', err);
 });

const User = sequelize.define('user', UserModel);

//set views file
app.set('views',path.join(__dirname,'views'));
//set view engine
app.set('view engine', 'hbs');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
//set folder public as static folder for static file
app.use('/assets',express.static(__dirname + '/public'));

//route for homepage
app.get('/',(req, res) => {
    User.findAll().then(users => {  
      let arrayRes = [];
      console.log("------------------- FIND ALL [GET] ----------------------------");
       for(let u of users) {
        arrayRes.push(u.dataValues);
      } 
      console.log(arrayRes);
      res.render('person_view',{
        results: arrayRes
      });
    },{ sequelize, modelName: 'User' }).catch(function (err) {
      console.log("findAll failed with error: " + err );
      return null;
    });
});

//route for insert data
app.post('/save',(req, res) => {
  let data = {name: req.body.name, lastname: req.body.lastname};
  User.create({ 
    firstname: data.name,
    lastname: data.lastname,
    age: 20,
    email: 'default@example.com',
   }).then(user => {       
       // Send created user to client
       console.log("Created User: ", user);
       res.redirect('/');
   }).catch(function (err) {
       console.log("create failed with error: " + err );
       return 0;
   });
});

//route for update data
app.post('/update',(req, res) => {
  let data = {id: req.body.id,name: req.body.name, lastname: req.body.lastname};
  console.log("REQ NAME --> ", data.name);
  console.log("REQ LASTNAME --> ", data.lastname);
  console.log("REQ ID --> ", data.id);

  User.update({
    firstname: data.name,
    lastname: data.lastname,
    age: 20
  }, {
    where: {
      id: data.id
    }
  }).then(() => {
    
    res.redirect('/');
  }).catch(function (err) {
    console.log("update failed with error: " + err);
    return 0;
  });
  
});

//route for delete data
app.post('/delete',(req, res) => {
    let sql = "DELETE FROM person WHERE id='"+req.body.id+"'";
    console.log("Query DELETE --> ", sql);
    let query = conn.query(sql, (err, results) => {
        if(err) throw err;
        res.redirect('/');
    });
});

//server listening
app.listen(8001, () => {
  console.log('Server is running at port 8001!');
});
