// const express = require('express');
// const router = express.Router();
// const multer = require('multer');
// const pool = require('../modules/pool');

// const upload = multer();

// router.post('/', upload.single('audio'), (req, res) => {
//   const audioData = req.file.buffer; // Get the audio data as a buffer
//   const sqlQuery = 'INSERT INTO samples (audio_data) VALUES ($1) RETURNING id';

//   pool.query(sqlQuery, [audioData], (err, result) => {
//     if (err) {
//       console.error('Error inserting audio data:', err);
//       res.sendStatus(500);
//     } else {
//       const newId = result.rows[0].id;
//       res.status(201).json({ id: newId });
//     }
//   });
// });

// module.exports = router;