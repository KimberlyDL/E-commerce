const PORT = 3000;
const express = require("express");
const bodyParser = require("body-parser");
const session = require('express-session');
const flash = require('connect-flash');


// const mainRouter = require("./routes/mainRouter");
// const authRouter = require("./routes/authRouter");
// const userRouter = require("./routes/userRouter");
// const adminRouter = require("./routes/adminRouter");
const router = require("./routes/router");



const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.json());

app.use(bodyParser.urlencoded({
    extended:true
}));

app.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: false,
    cookie: {secure: false}
}));

app.use(flash());

app.use((req, res, next) => {
    res.locals.success = req.flash('success');
    res.locals.errors = req.flash('errors');
    res.locals.formData = req.flash('formData');
    next();
});

app.use(express.static('public'));



// app.use('/', mainRouter);
// app.use('/', authRouter);
// app.use('/', userRouter);
// app.use('/admin', adminRouter);
app.use('/', router);


app.listen(PORT || 8080, () => {
    console.log(`Server connected successfully to port ${PORT}...`);
})
