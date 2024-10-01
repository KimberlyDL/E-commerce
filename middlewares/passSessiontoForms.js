app.use((req, res, next) => {
    res.locals.session = req.session;  // Makes session available in all views
    next();
});

