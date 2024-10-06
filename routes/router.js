const express = require('express');
const multer = require('multer');
const { check, validationResult, body } = require('express-validator');
const router = express.Router();

var { uploadProductImage, uploadUserAvatar } = require("../config/multer");

//controllers
let mainController = require("../controller/main");
let authSessionController = require("../controller/authSession");
let registerUserController = require("../controller/registerUser");
let productController = require("../controller/admin/product");
let userController = require("../controller/admin/user");
let dashboardController = require("../controller/admin/dashboard");
let cartController = require("../controller/cart");
let catalogController = require("../controller/catalog");

// middlewares and validation
const { validateEdit, validateFullRegistration, validateSignUp, validateLogIn } = require('../validations/userValidation');
const checkUserExists = require('../middlewares/checkUserExists');
const { isAdmin, isUser } = require('../middlewares/checkAuthorization');
const isAuthenticated = require('../middlewares/isAuthenticated');

const signUpMiddleware = [
    validateSignUp,
    checkUserExists
];

const fullRegistrationMiddleware = [
    validateFullRegistration,
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
router.get("/admin/products/:id", isValidAdmin, productController.show);
router.get("/admin/products/edit/:id", isValidAdmin, productController.edit);
router.post("/admin/products/edit/:id", isValidAdmin, uploadProductImage.single("image"), productController.patch);
router.post("/admin/products/delete/:id", isValidAdmin, productController.delete);

//users
router.get("/admin/users", isValidAdmin, userController.index);
router.get("/admin/users/create", isValidAdmin, userController.create);
router.post("/admin/users/create", isValidAdmin, uploadUserAvatar.single("image"), fullRegistrationMiddleware,  userController.post);
router.get("/admin/users/edit/:id", isValidAdmin, userController.edit);
router.post("/admin/users/edit/:id", isValidAdmin, uploadUserAvatar.single("image"), validateEdit, userController.patch);
router.post("/admin/users/delete/:id", isValidAdmin, userController.delete);
router.get("/admin/users/:id", isValidAdmin, userController.show);

router.get("/admin/reports", isValidAdmin, dashboardController.index);
router.get("/admin/check-out", isValidAdmin, dashboardController.viewOrders);
router.get('/admin/check-out/:id', isValidAdmin, cartController.getCheckoutDetails);

//user
router.get("/shop", isValidUser, catalogController.index)
router.post("/addtocart", isValidUser, cartController.addtocart);

router.get("/cart", isValidUser, cartController.index);
router.post("/cart/update-quantity", isValidUser, cartController.updateCartQuantity);
router.post("/cart/check-out", isValidUser, cartController.completeOrder);
router.get("/cart/check-out", isValidUser, cartController.viewOrders);
router.get('/cart/check-out/:id', isValidUser, cartController.getCheckoutDetails);

//router.post('/profile', isValidUser, userController.viewProfile);
//router.post('/profile/update', isValidUser, userController.updateProfile);

module.exports = router;