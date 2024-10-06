const fs = require('fs');
const path = require('path');
const express = require('express');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const { User } = require('../../models');

const userController = {
  index: async (req, res) => {
    try {
      const users = await User.findAll();

      res.render('admin/user/users', {
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
  },
  create: async (req, res) => {
    try {
      res.render('admin/user/addUser', {
        title: 'Supreme Agribet Feeds Supply Store',
        currentUrl: req.url,
        session: req.session || {},
      });
    } catch (error) {
      console.error('Error rendering create user page:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  },
  post: async (req, res) => {
    try {
      const { firstName, lastName, username, email, password, phone, address } = req.body;  // Extract phone as well
      let imagePath = '';
  
      if (req.file) {
        const filename = req.file.filename;
        imagePath = `/uploads/user/${filename}`;
      }
  
      const hashedPassword = await bcrypt.hash(password, saltRounds);
  
      const user = {
        avatar: imagePath,
        firstname: firstName,
        lastname: lastName,
        username: username,
        email: email,
        phone: phone,
        address: address,
        role: 'user',
        password: hashedPassword,
      };
  
      await User.create(user);
  
      res.redirect('/admin/users');

    } catch (error) {
      console.error('Error creating user:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  },

  show: async (req, res) => {
    try {
      const userId = req.params.id;

      const user = await User.findByPk(userId);

      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      console.log(user);

      res.render('admin/user/viewUser', {
        title: 'Supreme Agribet Feeds Supply Store',
        currentUrl: req.url,
        session: req.session || {},
        user,
      });
    } catch (error) {
      console.error('Error displaying user info:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  },
  edit: async (req, res) => {
    try {
      const userId = req.params.id;

      const user = await User.findByPk(userId);

      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      res.render('admin/user/editUser', {
        title: 'Edit User',
        currentUrl: req.url,
        session: req.session || {},
        user,
      });
    } catch (error) {
      console.error('Error rendering edit user page:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  },
  patch: async (req, res) => {
    try {
      const userId = req.params.id;

      const { firstName, lastName, username, phone, address, oldImage, email } = req.body;  // Get updated fields from request body
      let image = oldImage;

      if (req.file) {
        const filename = req.file.filename;
        image = `/uploads/user/${filename}`;
  
        if (oldImage) {
          const sanitizedOldImage = oldImage.startsWith('/') ? oldImage.substring(1) : oldImage;
          const oldImageFullPath = path.join(__dirname, '..', '..', 'public', sanitizedOldImage);
          if (fs.existsSync(oldImageFullPath)) {
            fs.unlinkSync(oldImageFullPath);
          }
        }
      }

      await User.update({
        avatar: image,
        firstname: firstName,
        lastname: lastName,
        username: username,
        phone: phone,
        address: address,
      },{
        where: { id: userId }
      });

      res.redirect('/admin/users');

    } catch (error) {

      console.error('Error updating user:', error);
      res.status(500).json({ message: 'Internal server error' });

    }
  },

  updateProfile: async (req, res) => {
    try {
      const userId = req.session.userId;  // Assuming user is logged in and userId is stored in session
      const { firstname, lastname, username } = req.body;

      // Find user by ID
      const user = await User.findByPk(userId);

      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      // Update user information
      user.firstname = firstname || user.firstname;  // Only update if new value is provided
      user.lastname = lastname || user.lastname;
      user.username = username || user.username;

      // Save updated user data
      await user.save();

      res.json({
        success: true,
        message: 'Profile updated successfully',
        user: {
          firstname: user.firstname,
          lastname: user.lastname,
          username: user.username,
          email: user.email,
        }
      });
    } catch (error) {
      console.error('Error updating profile:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  },
  delete: async (req, res) => {
    try {
      const userId = req.params.id;  // Get user ID from route params

      const user = await User.findByPk(userId);  // Find the user by ID

      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      // Delete the user from the database
      await user.destroy();

      // Respond with success
      res.redirect('/admin/users');
    } catch (error) {
      console.error('Error deleting user:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }
};

module.exports = userController;
