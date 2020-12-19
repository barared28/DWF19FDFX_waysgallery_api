const express = require("express");
const router = express.Router();

// import middlewares
const { auth } = require("../middlewares/auth");
const {
  uploadImageSingle,
  uploadImageMultiple,
} = require("../middlewares/uploadImage");

// import controllers
const { login, register } = require("../controllers/auth");
const { getPosts, addPost, getPostById } = require("../controllers/post");
const {
  getUserProfile,
  editProfile,
  getUserProfileById,
  getReload,
} = require("../controllers/profile");
const { addArt } = require("../controllers/art");
const {
  addOffer,
  getMyOrder,
  getMyOffer,
  editTransaction,
} = require("../controllers/transaction");
const {
  sendProject,
  addFileProject,
  getProjectById,
} = require("../controllers/project");

// auth router
router.post("/login", login);
router.post("/register", register);

// profile router
router.get("/user", auth, getUserProfile);
router.get("/user/:id", auth, getUserProfileById);
router.patch("/user", auth, uploadImageSingle("avatar"), editProfile);
router.get("/verify", auth, getReload);

// art router
router.post("/upload-arts", auth, uploadImageMultiple("image"), addArt);

// post router
router.get("/posts", getPosts);
router.get("/post/:id", getPostById);
router.post("/post", auth, uploadImageMultiple("photos"), addPost);

// transaction router
router.post("/hired", auth, addOffer);
router.get("/my-order", auth, getMyOrder);
router.get("/my-offer", auth, getMyOffer);
router.patch("/transaction/:id", auth, editTransaction);

// project router
router.post(
  "/send-project/:id",
  auth,
  uploadImageMultiple("files"),
  sendProject
);
router.get("/project/:id", auth, getProjectById);

module.exports = router;
