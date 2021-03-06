// import model
const { Project, User, Transaction, FileProject } = require("../../models");
// import module
const Joi = require("joi");

// import some shortcut
const {
  responseSuccess,
  handleError,
  handleNotFound,
  handleValidation,
} = require("../config/callback");

// @desc Add Offer
// @route POST api/v1/hired
// @access USER
exports.addOffer = async (req, res) => {
  try {
    const { body } = req;
    const { id: userId } = req.user;
    const scema = Joi.object({
      title: Joi.string().min(4).required(),
      description: Joi.string().min(10).required(),
      startDate: Joi.date().required(),
      endDate: Joi.date().required(),
      price: Joi.number().required(),
      orderTo: Joi.number().required(),
    });
    handleValidation(scema, body, res);
    body.orderBy = userId;
    body.status = "Waiting Approve";
    const transaction = await Transaction.create(body);
    const transactionAfterCreated = await Transaction.findOne({
      where: { id: transaction.id },
      attributes: {
        exclude: ["createdAt", "updatedAt", "orderBy", "orderTo", "status"],
      },
      include: [
        {
          model: User,
          as: "client",
          attributes: {
            exclude: ["createdAt", "updatedAt", "password"],
          },
        },
      ],
    });
    res.send({
      status: responseSuccess,
      message: "succesfully add offer",
      data: { hired: transactionAfterCreated },
    });
  } catch (error) {
    handleError(res, error);
  }
};

// @desc Get My Order
// @route GET api/v1/my-order
// @access USER
exports.getMyOrder = async (req, res) => {
  try {
    const { id: userId } = req.user;
    const order = await Transaction.findAll({
      where: { orderBy: userId },
      attributes: {
        exclude: ["createdAt", "updatedAt", "orderBy", "orderTo"],
      },
      include: [
        {
          model: User,
          as: "client",
          attributes: {
            exclude: ["createdAt", "updatedAt", "password"],
          },
        },
        {
          model: User,
          as: "seller",
          attributes: {
            exclude: ["createdAt", "updatedAt", "password"],
          },
        },
        {
          model: User,
          as: "seller",
          attributes: {
            exclude: ["createdAt", "updatedAt", "password"],
          },
        },
        {
          model: Project,
          as: "project",
          attributes: {
            exclude: ["createdAt", "updatedAt"],
          },
          include: {
            model: FileProject,
            as: "file",
            attributes: { exclude: ["createdAt", "updatedAt"] },
          },
        },
      ],
    });
    if (order.length === 0) {
      return handleNotFound(res, "your order is empty");
    }
    res.send({
      status: responseSuccess,
      message: "succesfully get your oder",
      data: { order },
    });
  } catch (error) {
    handleError(res, error);
  }
};

// @desc Get My Offer
// @route GET api/v1/my-offer
// @access USER
exports.getMyOffer = async (req, res) => {
  try {
    const { id: userId } = req.user;
    const offer = await Transaction.findAll({
      where: { orderTo: userId },
      attributes: {
        exclude: ["createdAt", "updatedAt", "orderBy", "orderTo"],
      },
      include: [
        {
          model: User,
          as: "client",
          attributes: {
            exclude: ["createdAt", "updatedAt", "password"],
          },
        },
        {
          model: User,
          as: "seller",
          attributes: {
            exclude: ["createdAt", "updatedAt", "password"],
          },
        },
      ],
    });
    if (offer.length === 0) {
      return handleNotFound(res, "your offer is empty");
    }
    res.send({
      status: responseSuccess,
      message: "succesfully get your oder",
      data: { offer },
    });
  } catch (error) {
    handleError(res, error);
  }
};

// @desc Edit Transaction
// @route Patch api/v1/transaction/:id
// @access USER
exports.editTransaction = async (req, res) => {
  try {
    const { id } = req.params;
    const { body } = req;
    const scema = Joi.object({
      status: Joi.string().required(),
    });
    handleValidation(scema, body, res);
    const transaction = await Transaction.findOne({ where: { id } });
    if (!transaction) {
      return handleNotFound(res, "transaction not found");
    }
    await Transaction.update(body, { where: { id } });
    const transactionAfterUpdate = await Transaction.findOne({
      where: { id },
      attributes: {
        exclude: ["createdAt", "updatedAt", "orderBy", "orderTo"],
      },
      include: [
        {
          model: User,
          as: "client",
          attributes: {
            exclude: ["createdAt", "updatedAt", "password"],
          },
        },
        {
          model: User,
          as: "seller",
          attributes: {
            exclude: ["createdAt", "updatedAt", "password"],
          },
        },
      ],
    });
    res.send({
      status: responseSuccess,
      message: "succesfully update transaction",
      data: { transaction: transactionAfterUpdate },
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
