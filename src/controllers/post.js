// import model
const { Post, User, Photo, Profile } = require("../../models");
// import module
const Joi = require("joi");

// import some shortcut
const {
  responseSuccess,
  handleError,
  handleNotFound,
  handleValidation,
} = require("../config/callback");
const { post } = require("../routes");

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

// @desc Get Posts
// @route GET api/v1/posts/followed
// @access USER
exports.getPostsByFollowed = async (req, res) => {
  try {
    const listFollowed = req.followed;
    if (!listFollowed || listFollowed.length === 0) {
      res.send({
        status: responseSuccess,
        message: "youre not followed anyone",
        data: {},
      });
    }
    const listPost = await Promise.all(
      listFollowed.map(async ({ id }) => {
        return await Post.findAndCountAll({
          where: { createdBy: id },
          attributes: {
            exclude: ["createdAt", "updatedAt"],
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
      })
    );
    const posts = await new Promise((resolve, reject) => {
      const newListPost = listPost.map((post) => post.rows);
      const postsArr = [];
      newListPost.map((list) => list.map((post) => postsArr.push(post)));
      resolve(postsArr);
      setTimeout(() => {
        reject();
      }, 10000);
    });
    if (posts.length === 0) {
      return handleNotFound(res, "Post is empty");
    }
    res.send({
      status: responseSuccess,
      message: "succesfully get posts",
      data: { posts },
      follow: req.followed,
    });
  } catch (error) {
    handleError(res, error);
  }
};

// @desc Add Post Clodinary
// @route POST api/v1/post
// @access USER
exports.addPost = async (req, res) => {
  try {
    const { body } = req;
    const images = req.files;
    const { id: createdBy } = req.user;

    const scema = Joi.object({
      title: Joi.string().min(4).required(),
      description: Joi.string().min(8).required(),
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
      images.map(async (image) => {
        await Photo.create({
          postId,
          image: image.secure_url,
          width: image.width,
          height: image.height,
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
  } catch (error) {}
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
          include: {
            model: Profile,
            as: "profile",
            attributes: {
              exclude: ["createdAt", "updatedAt", "userId", "id", "greeting"],
            },
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
