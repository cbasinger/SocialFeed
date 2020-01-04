'use strict';
module.exports = (sequelize, DataTypes) => {
  const posts = sequelize.define('posts', {
    title: DataTypes.STRING,
    user_id: DataTypes.STRING,
    body: DataTypes.TEXT,
    date: DataTypes.DATE,
    Images: DataTypes.STRING
  }, {});
  posts.associate = function(models) {
    // associations can be defined here
  };
  return posts;
};