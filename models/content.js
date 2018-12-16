module.exports = (sequelize, DataType) => {
    const Content = sequelize.define('content', {
        creator:{
            type: DataType.STRING,
            allowNull: false,
        },
        label:{
            type: DataType.STRING,
            allowNull: false,
        },
        content_text:{
            type: DataType.TEXT,
            allowNull: false,
        }
    });
    Content.associate = (User) => {
        Content.belongsTo(User, {foreignKey: 'username', sourcetKey: 'creator'})
    };
    return Content
};