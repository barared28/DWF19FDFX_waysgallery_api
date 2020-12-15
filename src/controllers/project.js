// import model
const { Project, User, Transaction } = require("../../models");
// import module
const Joi = require("joi");

// import some shortcut
const {
  responseSuccess,
  handleError,
  handleNotFound,
  handleValidation,
} = require("../config/callback");

// @desc Send Project
// @route POST api/v1/send-project
// @access USER
exports.sendProject = async (req, res) => {
  try {
    const { id: transactionId } = req.params;
    const { id: userId } = req.user;
    const transaction = await Transaction.findOne({
      where: { id: transactionId },
    });
    if (!transaction) {
      return handleNotFound(res, "transaction is not found");
    }
    if (transaction.orderTo !== userId) {
      return handleNotFound(res, "access denied");
    }
    const { body } = req;
    const scema = Joi.object({
      description: Joi.string().min(8).required(),
    });
    handleValidation(scema, body, res);
    const project = await Project.create({
      description: body.description,
      transactionId,
    });
    res.send({
      status: responseSuccess,
      message: "succesfully send project",
      data: {
        project: {
          id: project.id,
          description: project.description,
          transactionId,
        },
      },
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
