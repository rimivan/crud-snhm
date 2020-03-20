
const DB_HOST = require("./constants").host;
const UserModel = require("./model/user").User;

/** Sequelize */
const Sequelize = require('sequelize');


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
/* sequelize.sync({
  force: true
}); */

/* User.create({ 
  firstname: 'John',
  lastname: 'Smith',
  age: 26,
  email: 'j.smith@example.com',
 }).then(user => {       
     // Send created user to client
     return user.userId;
 }).catch(function (err) {
     console.log("create failed with error: " + err );
     return 0;
 });
*/

const getIdTwo = () => {
  User.findByPk(2).then(users => {
    console.log(" ----------------- ID 2 -----------------------");
    console.log(users.dataValues);
    return users.dataValues;
  }).catch(function (err) {
    console.log("findById failed with error: " + err );
    return null;

  })  
}
exports.getIdTwo = getIdTwo;

const getAllUsers = () => {
  User.findAll().then(users => {  
    let arrayRes = [];
    console.log("------------------- FIND ALL ----------------------------");
     for(let u of users) {
      arrayRes.push(u.dataValues);
    } 
    console.log(arrayRes);
    return arrayRes;
  },{ sequelize, modelName: 'User' }).catch(function (err) {
    console.log("findAll failed with error: " + err );
    return null;
  });
}
exports.getAllUsers = getAllUsers;

/* User.update( { firstname: 'j', lastname: 'smith', age: 27},
  { where: {id: 2} }
).then(() => {
  console.log(id);
}).catch(function (err) {
      console.log("update failed with error: " + err );
      return 0;
  });

  User.destroy({
    where: { id: id }
   }).then(() => {
    console.log("deleted record with id",id);
   }).catch(function (err) {
               console.log("delete failed with error: " + err );
               return 0;
       // handle error;
   }); */