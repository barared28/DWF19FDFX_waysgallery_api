// import model
const { Post, User, Photo, Profile, Art } = require("../../models");
// import module
const Joi = require("joi");
// import some shortcut
const {
  responseSuccess,
  handleError,
  handleNotFound,
  handleValidation,
} = require("../config/callback");

// @desc Get User Profile
// @route GET api/v1/user
// @access USER
exports.getUserProfile = async (req, res) => {
  try {
    const { id } = req.user;
    const user = await User.findOne({
      where: { id },
      attributes: {
        exclude: ["createdAt", "updatedAt", "password"],
      },
      include: [
        {
          model: Profile,
          as: "profile",
          attributes: {
            exclude: ["createdAt", "updatedAt", "userId", "id"],
          },
        },
        {
          model: Post,
          as: "post",
          attributes: {
            exclude: ["createdAt", "updatedAt", "userId", "createdBy"],
          },
          include: {
            model: Photo,
            as: "photo",
            attributes: {
              exclude: ["createdAt", "updatedAt"],
            },
          },
        },
        {
          model: Art,
          as: "art",
          attributes: {
            exclude: ["createdAt", "updatedAt", "userId"],
          },
        },
      ],
    });
    if (!user) {
      handleNotFound(res, "user profile not found");
    }
    res.send({
      status: responseSuccess,
      message: "succesfully get profile",
      data: user,
    });
  } catch (error) {
    handleError(res, error);
  }
};

// @desc Edit Profile
// @route PATCH api/v1/user
// @access USER
exports.editProfile = async (req, res) => {
  try {
    const { body } = req;
    const { id: userId } = req.user;
    body.avatar = req.file.path;
    const scema = Joi.object({
      greeting: Joi.string().min(4),
      fullName: Joi.string().min(4),
      avatar: Joi.string(),
    });
    handleValidation(scema, body, res);
    const profile = await Profile.findOne({ where: { userId } });
    if (!profile) {
      handleNotFound(res, "profile not found");
    }
    if (body.fullName) {
      await User.update({ fullName: body.fullName }, { where: { id: userId } });
    }
    await Profile.update(body, { where: { userId } });
    const profileAfterUpdate = await User.findOne({
      where: { id: userId },
      attributes: {
        exclude: ["createdAt", "updatedAt", "password"],
      },
      include: {
        model: Profile,
        as: "profile",
        attributes: {
          exclude: ["createdAt", "updatedAt", "userId", "id"],
        },
      },
    });
    res.send({ user: { profileAfterUpdate } });
  } catch (error) {
    handleError(res, error);
  }
};

// @desc Get Posts
// @route GET api/v1/posts
// @access USER
exports.getUserProfileById = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findOne({
      where: { id },
      attributes: {
        exclude: ["createdAt", "updatedAt", "password"],
      },
      include: [
        {
          model: Profile,
          as: "profile",
          attributes: {
            exclude: ["createdAt", "updatedAt", "userId", "id"],
          },
        },
        {
          model: Post,
          as: "post",
          attributes: {
            exclude: ["createdAt", "updatedAt", "userId", "createdBy"],
          },
          include: {
            model: Photo,
            as: "photo",
            attributes: {
              exclude: ["createdAt", "updatedAt"],
            },
          },
        },
        {
          model: Art,
          as: "art",
          attributes: {
            exclude: ["createdAt", "updatedAt", "userId"],
          },
        },
      ],
    });
    if (!user) {
      handleNotFound(res, "user profile not found");
    }
    res.send({
      status: responseSuccess,
      message: "succesfully get profile",
      data: user,
    });
  } catch (error) {
    handleError(res, error);
  }
};

// @desc Get Profile Just for Check
// @route GET api/v1/verify
// @access USER
exports.getReload = async (req, res) => {
  try {
    const { id } = req.user;
    const user = await User.findOne({
      where: { id },
      attributes: {
        exclude: ["createdAt", "updatedAt", "password", "email"],
      },
      include: {
        model: Profile,
        as: "profile",
        attributes: {
          exclude: ["createdAt", "updatedAt", "userId", "id"],
        },
      },
    });
    if (!user) {
      handleNotFound(res, "user profile not found");
    }
    res.send({
      status: responseSuccess,
      message: "succesfully get profile",
      data: user,
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
