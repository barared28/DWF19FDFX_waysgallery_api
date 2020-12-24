const express = require("express");
const router = express.Router();

// import middlewares
const { auth } = require("../middlewares/auth");
const {
  uploadImageSingle,
  uploadImageMultiple,
} = require("../middlewares/uploadImage");
const findFollowed = require("../middlewares/findFollowed");

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
router.patch("/user", auth, uploadImageSingle("avatar"), editProfile);
router.get("/verify", auth, getReload);

// art router
router.post("/upload-arts", auth, uploadImageMultiple("image"), addArt);

// post router
router.get("/posts", getPosts);
router.get("/posts/followed", auth, findFollowed, getPostsByFollowed);
router.get("/post/:id", auth, getPostById);
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

// follow router
router.patch("/follow/:id", auth, editFollow);
router.get("/follow/:id", auth, getFollow);

module.exports = router;
