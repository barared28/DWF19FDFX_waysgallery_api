const formidable = require("formidable");
const cloudinary = require("cloudinary").v2;
require("dotenv").config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

exports.uploadImage = async (req, res, next) => {
  const form = formidable({ multiples: true });
  try {
    form.parse(req, async (err, fields, files) => {
      if (err) {
        next(err);
        return;
      }
      req.body = fields;
      if (Array.isArray(files.images)) {
        req.files = [];
        await Promise.all(
          files.images.map(async (file) => {
            await cloudinary.uploader.upload(
              file.path,
              function (error, result) {
                if (result) {
                  req.files.push(result);
                }
                if (error) {
                  return res.status(500).send({
                    status: "server error",
                    data: {},
                  });
                }
              }
            );
          })
        );
        next();
      } else {
        await cloudinary.uploader.upload(
          files.images.path,
          function (error, result) {
            if (result) {
              req.files = [result];
              next();
            }
            if (error) {
              return res.status(500).send({
                status: "server error",
                data: {},
              });
            }
          }
        );
      }
    });
  } catch (error) {
    res.status(500).send({
      status: "server error",
      data: {},
    });
  }
};
