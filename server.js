const path = require('path');
const express = require('express');
const hbs = require('hbs'); /* use hbs view engine */
const bodyParser = require('body-parser');
const app = express();
const Sequelize = require('sequelize'); /* sequelize ORM imported from node modules */

const DB_HOST = require("./constants").host; /* host path from constants */
const UserModel = require("./model/user").User; /* user model from User */

/* set views file and views engine */
app.set('views',path.join(__dirname,'views'));
app.set('view engine', 'hbs');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
/* set folder public as static folder for static file */
/* TODO: Edit UI */
app.use('/assets',express.static(__dirname + '/public'));

/* sequelize setup to a simple MySql DB */
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

/* sequelize connection to DB */
sequelize.authenticate()
 .then(() => {
   console.log('Connection has been established successfully.');
 })
 .catch(err => {
   console.error('Unable to connect to the database:', err);
 });

const User = sequelize.define('user', UserModel);

/* homepage GET method: it lists all users of DB */
app.get('/',(req, res) => {
    User.findAll().then(users => {  
      let arrayRes = [];
       for(let u of users) {
        arrayRes.push(u.dataValues);
      } 
      res.render('person_view',{
        results: arrayRes
      });
    },{ sequelize, modelName: 'User' }).catch(function (err) {
      console.log("findAll failed with error: " + err );
      return null;
    });
});

/* POST method to insert a new user in DB */
/* Name, Lastname from input; Age, Email set default in this example */
app.post('/save',(req, res) => {
  let data = {name: req.body.name, lastname: req.body.lastname};
  User.create({ 
    firstname: data.name,
    lastname: data.lastname,
    age: 20,
    email: 'default@example.com',
   }).then(user => {       
       console.log("Created User: ", user);
       res.redirect('/');
   }).catch(function (err) {
       console.log("create failed with error: " + err );
       return 0;
   });
});

/* POST method to update a user in DB(age set to 20 as default) */
app.post('/update',(req, res) => {
  let data = {id: req.body.id,name: req.body.name, lastname: req.body.lastname};
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

/* POST method to delete a user in DB(age set to 20 as default) */
app.post('/delete',(req, res) => {
    let data = {id: req.body.id,name: req.body.name, lastname: req.body.lastname};

    User.destroy({
      where: { id: data.id }
     }).then(() => {
        console.log("deleted record with id",data.id);
        res.redirect('/');
     }).catch(function (err) {
        // handle error;
        console.log("delete failed with error: " + err );
        return 0;
     });
});

//server listening
app.listen(8001, () => {
  console.log('Server is running at port 8001!');
});
