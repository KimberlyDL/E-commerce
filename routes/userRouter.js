const express = require('express');
const multer = require('multer');
const router = express.Router();

var { uploadProductImage } = require("../config/multer");

var catalogController = require("../controller/catalog");

router.get("/", catalogController.home)
router.get("/shop", catalogController.index)
router.get("/addtocart", catalogController.addtocart);

// router.post("/post", uploadProductImage.single("image"), catalogController.post);
// router.post("/:id", catalogController.show);
// router.get("/edit/:id", catalogController.edit);
// router.post("/edit/:id", catalogController.patch);
// router.delete("/edit/:id", catalogController.delete);



module.exports = router;