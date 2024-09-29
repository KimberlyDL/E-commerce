const PORT = 3000;
const express = require("express");
const bodyParser = require("body-parser");

// const mainRouter = require("./routes/mainRouter");
// const authRouter = require("./routes/authRouter");
// const userRouter = require("./routes/userRouter");
// const adminRouter = require("./routes/adminRouter");
const router = require("./routes/router");



const app = express();

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
    extended:true
}));
app.use(express.static('public'));



// app.use('/', mainRouter);
// app.use('/', authRouter);
// app.use('/', userRouter);
// app.use('/admin', adminRouter);
app.use('/', router);


app.listen(PORT || 8080, () => {
    console.log(`Server connected successfully to port ${PORT}...`);
})
