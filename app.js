const PORT = 3000;
const express = require("express");
const bodyParser = require("body-parser");
const adminRouter = require("./routes/adminRouter");
const indexRouter = require("./routes/indexRouter");

const app = express();

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
    extended:true
}));
app.use(express.static('public'));
app.use('/', indexRouter);
app.use('/products', adminRouter);

app.listen(PORT || 8080, () => {
    console.log(`Server connected successfully to port ${PORT}...`);
})
