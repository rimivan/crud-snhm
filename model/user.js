const Sequelize = require('sequelize');
const User = {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    firstname: {
        type: Sequelize.STRING
    },
    lastname: {
        type: Sequelize.STRING
    },
    age: {
        type: Sequelize.INTEGER
    },
    email:{
        type: Sequelize.STRING
    }
};

exports.User = User;