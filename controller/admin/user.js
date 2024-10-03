const fs = require('fs');
const path = require('path');
const { User} = require('../../models');

const userController = {
  index: async (req, res) => {
    try {
      const users = await User.findAll();
      

      res.render('users', {
        title: 'Supreme Agribet Feeds Supply Store',
        currentUrl: req.url,
        session: req.session || {},
        users: users,
      });

    } catch (error) {
      console.error('Error:', error);

      res.status(500).render('errorpage', {
        title: 'Supreme Agribet Feeds Supply Store',
        currentUrl: req.url,
        session: req.session || {},
        message: 'Internal server error. Please try again later.',
      });
    }
  }
};

module.exports = userController;
