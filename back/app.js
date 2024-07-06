// app.js
const express = require('express');
const mongoose = require('mongoose');
const imageRoutes = require('./routes/imageRoutes');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log(err));

app.use(express.json());
app.use('/api', imageRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
