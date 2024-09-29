const express = require('express');
const multer = require('multer');
const router = express.Router();

var { uploadProductImage } = require("../config/multer");

//controllers
let mainController = require("../controller/main");
let authSessionController = require("../controller/authSession");
let registerUserController = require("../controller/registerUser");
let productController = require("../controller/admin/product");
let catalogController = require("../controller/catalog");

// middlewares and validation
const { validateSignUp, validateLogIn } = require('../validations/userValidation');
const checkUserExists = require('../middlewares/checkUserExists');


const signUpMiddleware = [
    validateSignUp,
    checkUserExists
];


//routers
//main
router.get('/', mainController.home);
router.get('/dashboard', mainController.dashboard);

//auth
router.get('/signup', registerUserController.create);
router.post('/signup', signUpMiddleware, registerUserController.post);
router.get('/signin', authSessionController.create);
router.post('/signin', validateLogIn, authSessionController.post);
router.get('/forgotpassword', registerUserController.forgotpassword);

//admin
router.get("/admin/products/", productController.index)
router.get("/admin/products/create", productController.create);
router.post("/admin/products/post", uploadProductImage.single("image"), productController.post);
router.get("/admin/products/:id", productController.show);
router.get("/admin/products/edit/:id", productController.edit);
router.post("/admin/products/edit/:id", uploadProductImage.single("image"), productController.patch);
router.post("/admin/products/delete/:id", productController.delete);


//user
router.get("/", catalogController.home)
router.get("/shop", catalogController.index)
router.get("/addtocart", catalogController.addtocart);


module.exports =  router;