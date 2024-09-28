const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');

const userUploadDir = path.join(__dirname, '..', 'public', 'uploads', 'user');

const uploadDir = './public/uploads/product';

function getUniqueFilename(destination, originalName) {
    const extension = path.extname(originalName);
    const baseName = path.basename(originalName, extension).replace(/\s+/g, '-');
    let newFilename = `${baseName}${extension}`;
    let counter = 1;

    while (fs.existsSync(path.join(destination, newFilename))) {
        newFilename = `${baseName}-${counter}${extension}`;
        counter++;
    }

    return newFilename;
}

const storageProductImage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        const uniqueFilename = getUniqueFilename(uploadDir, file.originalname); // Generate a unique filename
        cb(null, uniqueFilename);
    }
});


const storageUserAvatar = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, userUploadDir);
    },
    filename: function (req, file, cb) {
        const uniqueFilename = getUniqueFilename(userUploadDir, file.originalname); // Generate a unique filename
        cb(null, uniqueFilename);
    },
});

const uploadProductImage = multer({ storage: storageProductImage });
const uploadUserAvatar = multer({ storage: storageUserAvatar });

module.exports = {
    uploadProductImage,
    uploadUserAvatar,
};
