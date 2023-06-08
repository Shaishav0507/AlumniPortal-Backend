const multer = require('multer');

const uuidv4 = require('uuid/v4');

const rootPathControl = require('./path');

const path = require('path');

let storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(rootPathControl.rootPath, 'uploads'))
    },
    filename: function (req, file, cb) {
        cb(null, uuidv4() + '_' + Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

module.exports = {
    uploadMulter: upload
};