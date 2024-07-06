// routes/imageRoutes.js
const express = require('express');
const multer = require('multer');
const Image = require('../models/Image');
const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.post('/upload', upload.single('image'), async (req, res) => {
    const newImage = new Image({
        name: req.body.name,
        img: {
            data: req.file.buffer,
            contentType: req.file.mimetype
        }
    });

    await newImage.save();
    res.send('Image uploaded successfully');
});

router.get('/images', async (req, res) => {
    const images = await Image.find();
    res.json(images);
});

module.exports = router;
