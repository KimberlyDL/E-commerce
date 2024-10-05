const express = require('express');
const multer = require('multer');
const { check, validationResult, body } = require('express-validator');
const router = express.Router();

var { uploadProductImage } = require("../config/multer");

//controllers
let mainController = require("../controller/main");
let authSessionController = require("../controller/authSession");
let registerUserController = require("../controller/registerUser");
let productController = require("../controller/admin/product");
let userController = require("../controller/admin/user");
let salesController = require("../controller/admin/sales");
let cartController = require("../controller/cart");
let catalogController = require("../controller/catalog");

// middlewares and validation
const { validateSignUp, validateLogIn } = require('../validations/userValidation');
const checkUserExists = require('../middlewares/checkUserExists');
const { isAdmin, isUser } = require('../middlewares/checkAuthorization');
const isAuthenticated = require('../middlewares/isAuthenticated');

const signUpMiddleware = [
    validateSignUp,
    checkUserExists
];

const isValidUser = [
    isAuthenticated,
    isUser
];

const isValidAdmin = [
    isAuthenticated,
    isAdmin
];

//routers
//main
router.get('/', mainController.welcome);

//auth
router.get('/signup', registerUserController.create);

router.post('/signup', signUpMiddleware, registerUserController.post);
router.get('/signin', authSessionController.create);
router.post('/signin', validateLogIn, authSessionController.post);
router.get('/logout', isAuthenticated, authSessionController.destroy);
router.get('/forgotpassword', registerUserController.forgotpassword);
router.get('/resetpassword', registerUserController.resetpassword);


//admin

//products
router.get("/admin/products/", isValidAdmin, productController.index);
router.get("/admin/products/create", isValidAdmin, productController.create);
router.post("/admin/products/post", isValidAdmin, uploadProductImage.single("image"), productController.post);
router.get("/admin/products/:id", isValidAdmin,  productController.show);
router.get("/admin/products/edit/:id", isValidAdmin, productController.edit);
router.post("/admin/products/edit/:id", isValidAdmin, uploadProductImage.single("image"), productController.patch);
router.post("/admin/products/delete/:id", isValidAdmin, productController.delete);

//users
router.get("/admin/users", isValidAdmin, userController.index);
router.get("/admin/reports", isValidAdmin, salesController.index);

//user
router.get("/shop", isValidUser, catalogController.index)
router.post("/addtocart", isValidUser, cartController.addtocart);

router.get("/cart", isValidUser, cartController.index);


module.exports = router;