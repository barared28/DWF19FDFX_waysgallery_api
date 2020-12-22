// import model
const { Follow } = require("../../models");
// import some shortcut
const { responseSuccess, handleError } = require("../config/callback");

// @desc Edit Follow
// @route PATCH api/v1/follow/:id
// @access USER
exports.editFollow = async (req, res) => {
  const { id: followedId } = req.params;
  const { id: followerId } = req.user;
  const { value } = req.body;
  const follow = await Follow.findOne({ where: { followerId, followedId } });
  if (!follow) {
    const newFollow = await Follow.create({ followerId, followedId, value });
    return res.send({
      status: responseSuccess,
      message: "succesfully add Follow",
      data: { follow: newFollow },
    });
  }
  await Follow.update({ value }, { where: { followerId, followedId } });
  const newFollow = await Follow.findOne({
    where: { followerId, followedId },
    attributes: {
      exclude: ["createdAt", "updatedAt", "id", "followerId", "followedId"],
    },
  });
  res.send({
    status: responseSuccess,
    message: "succesfully edit status follow",
    data: { follow: newFollow },
  });
  try {
  } catch (error) {
    handleError(res, error);
  }
};

// @desc Get Status Follow
// @route GET api/v1/follow/:id
// @access USER
exports.getFollow = async (req, res) => {
  const { id: followedId } = req.params;
  const { id: followerId } = req.user;
  const follow = await Follow.findOne({
    where: { followerId, followedId },
    attributes: {
      exclude: ["createdAt", "updatedAt", "id", "followerId", "followedId"],
    },
  });
  if (!follow) {
    await Follow.create({ followerId, followedId, value: false });
    const follow = await Follow.findOne({
      where: { followerId, followedId },
      attributes: {
        exclude: ["createdAt", "updatedAt", "id", "followerId", "followedId"],
      },
    });
    return res.send({
      status: responseSuccess,
      message: "succesfully get status follow",
      data: { follow },
    });
  }
  res.send({
    status: responseSuccess,
    message: "succesfully get status follow",
    data: { follow },
  });
  try {
  } catch (error) {
    handleError(res, error);
  }
};

// // @desc Get Posts
// // @route GET api/v1/posts
// // @access USER
// exports.getPosts = async (req, res) => {
//     try {
//     } catch (error) {
//       handleError(res, error);
//     }
//   };
