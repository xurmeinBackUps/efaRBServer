module.exports = function(sequelize, DataType){
    return sequelize.define('journal_entry', {
        author:{
            type: DataType.STRING,
            allowNull: false,
        },
        title:{
            type: DataType.STRING,
            allowNull: false,
        },
        entry:{
            type: DataType.TEXT,
            allowNull: false,
        }
    });
};