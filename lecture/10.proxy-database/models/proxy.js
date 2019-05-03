module.exports = (sequelize, Sequelize) => {
  return sequelize.define("proxy", {
    ip: {
      type: Sequelize.STRING(30),
      allowNull: false,
      unique: true
      // 크롤링된 ip의 중복을 피하려면 unique:true 설정해준다.
    },
    type: {
      type: Sequelize.STRING(20),
      allowNull: false
    },
    latency: {
      type: Sequelize.FLOAT.UNSIGNED,
      allowNull: false
    }
  });
};
