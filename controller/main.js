const mainController = {

    welcome: (req, res) => {
        res.render('home', {
            title: 'Supreme Agribet Feeds Supply Store',
            currentUrl: req.url,
            session: req.session || {},
        })
    },
}


module.exports = mainController;