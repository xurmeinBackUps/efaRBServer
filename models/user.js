module.exports = function(sequelize, DataType){
    return sequelize.define('user', {
        username:{
            type: DataType.STRING,
            allowNull: false,
            validate:{
                min:[3],
                max:[15]
            },
            unique: true
        },
        password:{
            type: DataType.STRING,
            allowNull: false,
            validate:{
                min:[7]
            }
        },
        is_admin:{
            type: DataType.BOOLEAN,
            allowNull: true
        },
        adminID:{
            type: DataType.STRING,
            allowNull: true,
            unique: true
        }
    });
};