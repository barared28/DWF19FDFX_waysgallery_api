// import model
const { Project, FileProject, Transaction } = require("../../models");
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
    const files = req.files;
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
    await Promise.all(
      files.map(async (image) => {
        await FileProject.create({
          projectId: project.id,
          fileName: image.path,
        });
      })
    );
    await Transaction.update(
      { status: "Project Finish" },
      { where: { id: transactionId } }
    );
    const projectAfterAdd = await Project.findOne({
      where: { id: project.id },
      attributes: { exclude: ["createdAt", "updatedAt"] },
      include: {
        model: FileProject,
        as: "file",
        attributes: { exclude: ["createdAt", "updatedAt"] },
      },
    });
    res.send({
      status: responseSuccess,
      message: "succesfully send project",
      data: {
        project: projectAfterAdd,
      },
    });
  } catch (error) {
    handleError(res, error);
  }
};

// @desc Get Project By Id
// @route GET api/v1/project/:id
// @access USER
exports.getProjectById = async (req, res) => {
  try {
    const { id } = req.params;
    const project = await Project.findOne({
      where: { id },
      attributes: { exclude: ["createdAt", "updatedAt"] },
      include: {
        model: FileProject,
        as: "file",
        attributes: { exclude: ["createdAt", "updatedAt"] },
      },
    });
    if (!project) {
      handleNotFound(res, "project is not found");
    }

    res.send({
      status: responseSuccess,
      message: "succesfully get project",
      data: { project },
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
