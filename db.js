const Sequelize = require('sequelize');

const sequelize = new Sequelize(
    process.env.DB_URL ||
    `postgresql:postgres:${encodeURIComponent(process.env.PASS)}@localhost/marsExploration`,
    {
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