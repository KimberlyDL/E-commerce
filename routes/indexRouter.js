const express = require('express');
const multer = require('multer');
const router = express.Router();

var { uploadProductImage } = require("../config/multer");

var catalogController = require("../controller/catalog");

router.get("/", productController.index)
router.get("/create", productController.create);
router.post("/post", uploadProductImage.single("image"), productController.post);
router.post("/:id", productController.show);
router.get("/edit/:id", productController.edit);
router.post("/edit/:id", productController.patch);
router.delete("/edit/:id", productController.delete);



module.exports = router;