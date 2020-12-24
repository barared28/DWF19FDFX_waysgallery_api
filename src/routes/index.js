const express = require("express");
const router = express.Router();

// import middlewares
const { auth } = require("../middlewares/auth");
const findFollowed = require("../middlewares/findFollowed");
const { uploadImage } = require("../middlewares/uploadCloudinary");

// import controllers
const { login, register } = require("../controllers/auth");
const {
  getPosts,
  addPost,
  getPostById,
  getPostsByFollowed,
} = require("../controllers/post");
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
const { sendProject, getProjectById } = require("../controllers/project");
const { editFollow, getFollow } = require("../controllers/follow");

// auth router
router.post("/login", login);
router.post("/register", register);

// profile router
router.get("/user", auth, getUserProfile);
router.get("/user/:id", auth, getUserProfileById);
router.patch("/user", auth, uploadImage, editProfile);
router.get("/verify", auth, getReload);

// art router
router.post("/upload-arts", auth, uploadImage, addArt);

// post router
router.get("/posts", getPosts);
router.get("/posts/followed", auth, findFollowed, getPostsByFollowed);
router.get("/post/:id", auth, getPostById);
router.post("/post", auth, uploadImage, addPost);

// transaction router
router.post("/hired", auth, addOffer);
router.get("/my-order", auth, getMyOrder);
router.get("/my-offer", auth, getMyOffer);
router.patch("/transaction/:id", auth, editTransaction);

// project router
router.post("/send-project/:id", auth, uploadImage, sendProject);
router.get("/project/:id", auth, getProjectById);

// follow router
router.patch("/follow/:id", auth, editFollow);
router.get("/follow/:id", auth, getFollow);

module.exports = router;
