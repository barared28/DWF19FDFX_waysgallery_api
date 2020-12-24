// import model
const { Follow } = require("../../models");

module.exports = async (req, res, next) => {
  try {
    const { id } = req.user;
    const userWithFollowed = await Follow.findAll({
      where: { followerId: id, value: true },
      attributes: [["followedId", "id"]],
    });
    req.followed = userWithFollowed;
    next();
  } catch (error) {}
};
