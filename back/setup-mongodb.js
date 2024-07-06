const Docker = require('dockerode');
const mongoose = require('mongoose');
const fs = require('fs');
const { exec } = require('child_process');
require('dotenv').config();

const docker = new Docker();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://root:example@localhost:27017/face_recognition_db?authSource=admin';

async function setupMongoDB() {
  // Start Docker Compose
  await new Promise((resolve, reject) => {
    exec('docker-compose up -d', (error, stdout, stderr) => {
      if (error) {
        console.error(`exec error: ${error}`);
        return reject(error);
      }
      console.log(`stdout: ${stdout}`);
      console.error(`stderr: ${stderr}`);
      resolve();
    });
  });

  // Wait for MongoDB to be ready
  console.log('Waiting for MongoDB to start...');
  await new Promise(resolve => setTimeout(resolve, 10000));

  // Connect to MongoDB
  await mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
  console.log('MongoDB connected');

  // Create database and collection
  const faceRecognitionSchema = new mongoose.Schema({
    name: String,
    img: {
      data: Buffer,
      contentType: String
    }
  });

  const FaceRecognition = mongoose.model('FaceRecognition', faceRecognitionSchema);

  await FaceRecognition.create({
    name: 'example',
    img: {
      data: Buffer.from('exampledata'),
      contentType: 'image/png'
    }
  });

  console.log('Database and collection created');
  mongoose.disconnect();
}

setupMongoDB().catch(err => {
  console.error(err);
  process.exit(1);
});
