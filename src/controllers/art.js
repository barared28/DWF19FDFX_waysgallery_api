// import model
const { Art } = require("../../models");
// import module
const Joi = require("joi");

// import some shortcut
const {
  responseSuccess,
  handleError,
  handleNotFound,
  handleValidation,
} = require("../config/callback");

// @desc Add Art
// @route POST api/v1/upload-arts
// @access USER
exports.addArt = async (req, res) => {
  try {
    const { id: userId } = req.user;
    const file = req.files;
    const art = [];
    await Promise.all(
      file.map(async (file) => {
        art.push({
          userId,
          image: file.secure_url,
          width: file.width,
          height: file.height,
        });
        return await Art.create({
          userId,
          image: file.secure_url,
          width: file.width,
          height: file.height,
        });
      })
    );
    res.send({
      status: responseSuccess,
      message: "succesfully add Art",
      data: { art },
    });
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
