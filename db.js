const Sequelize = require('sequelize');

const sequelize = new Sequelize(process.env.NAME, process.env.DATA, process.env.PASS, {
    host: 'localhost',
    dialect: 'postgres'
})

sequelize.authenticate().then(
    function(){
        console.log('marsServer + pgDB = 4eva! lol')
    },
    function(err){
        console.log(err);
    }
);

module.exports = sequelize;