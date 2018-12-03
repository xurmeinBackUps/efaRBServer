const Sequelize = require('sequelize');

const sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: 'postgres'
})

new Sequelize(
    process.env.DATABASE_URL || `postgresql://postgres:${encodeURIComponent(process.env.PASS)}/docit`
    )

sequelize.authenticate().then(
    function(){
        console.log('doc[It] + pgDB = 4eva! lol')
    },
    function(err){
        console.log(err);
    }
);

module.exports = sequelize;