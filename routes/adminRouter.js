const express = require('express');
const router = express.Router();
var { uploadProductImage } = require("../config/multer");

var productController = require("../controller/admin/product");

router.get("/", productController.createProduct);
router.post("/product/post", uploadProductImage.array("image"), productController.post);
router.get("/product/show", productController.show);


module.exports = router;