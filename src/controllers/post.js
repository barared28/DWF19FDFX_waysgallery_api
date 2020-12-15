// import model
const { Post, User, Photo } = require("../../models");
// import module
const Joi = require("joi");

// import some shortcut
const {
  responseSuccess,
  handleError,
  handleNotFound,
  handleValidation,
} = require("../config/callback");

// @desc Get Posts
// @route GET api/v1/posts
// @access USER
exports.getPosts = async (req, res) => {
  try {
    const posts = await Post.findAll({
      attributes: {
        exclude: ["createdAt", "updatedAt", "userId", "createdBy"],
      },
      order: [["createdAt", "DESC"]],
      include: [
        {
          model: User,
          as: "createdby",
          attributes: {
            exclude: ["createdAt", "updatedAt", "password"],
          },
        },
        {
          model: Photo,
          as: "photo",
          attributes: {
            exclude: ["createdAt", "updatedAt"],
          },
        },
      ],
    });
    if (posts.length === 0) {
      return handleNotFound(res, "Post is empty");
    }
    res.send({
      status: responseSuccess,
      message: "succesfully get posts",
      data: { posts },
    });
  } catch (error) {
    handleError(res, error);
  }
};

// @desc Add Post
// @route POST api/v1/post
// @access USER
exports.addPost = async (req, res) => {
  try {
    const { body } = req;
    const file = req.files;
    const { id: createdBy } = req.user;

    const scema = Joi.object({
      title: Joi.string().min(4).required(),
      description: Joi.string().min(10).required(),
    });

    handleValidation(scema, body, res);
    const { title, description } = body;

    const post = await Post.create({
      title,
      description,
      createdBy,
    });

    const { id: postId } = post;

    await Promise.all(
      file.map(async (image) => {
        await Photo.create({
          postId,
          image: image.path,
        });
      })
    );

    const postAfterAdded = await Post.findOne({
      where: { id: postId },
      attributes: {
        exclude: ["createdAt", "updatedAt"],
      },
      include: {
        model: Photo,
        as: "photo",
        attributes: {
          exclude: ["createdAt", "updatedAt", "postId"],
        },
      },
    });

    res.send({
      status: responseSuccess,
      message: "post succesfully added",
      data: { post: postAfterAdded },
    });
  } catch (error) {
    handleError(res, error);
  }
};

// @desc Get Post by Id
// @route GET api/v1/post/:id
// @access USER
exports.getPostById = async (req, res) => {
  try {
    const { id } = req.params;
    const post = await Post.findOne({
      where: { id },
      attributes: {
        exclude: ["createdAt", "updatedAt", "createdBy"],
      },
      include: [
        {
          model: User,
          as: "createdby",
          attributes: {
            exclude: ["createdAt", "updatedAt", "password"],
          },
        },
        {
          model: Photo,
          as: "photo",
          attributes: {
            exclude: ["createdAt", "updatedAt", "postId"],
          },
        },
      ],
    });
    if (!post) {
      return handleNotFound(res, "post is not found");
    }
    res.send({
      status: responseSuccess,
      message: "succesfully get post",
      data: { post },
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
