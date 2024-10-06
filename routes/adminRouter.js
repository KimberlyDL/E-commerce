const express = require('express');
const multer = require('multer');
const router = express.Router();

var { uploadProductImage } = require("../config/multer");


var productController = require("../controller/admin/product");

router.get("/products/", productController.index)
router.get("/products/create", productController.create);
router.post("/products/post", uploadProductImage.single("image"), productController.post);
router.get("/products/:id", productController.show);
router.get("/products/edit/:id", productController.edit);
router.post("/products/edit/:id", uploadProductImage.single("image"), productController.patch);
router.post("/products/delete/:id", productController.delete);



module.exports = router;