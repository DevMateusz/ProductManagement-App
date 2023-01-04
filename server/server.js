require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors');
const corsOptions = require('./config/corsOptions');
const { logger } = require('./middleware/logEvents');
const errorHandler = require('./middleware/errorHandler');
const auth = require('./middleware/auth')
const mongoose = require('mongoose');
const connectDB = require('./config/dbConn');
const PORT = process.env.PORT || 5000;

connectDB();

app.use(logger);
app.use(cors(corsOptions));
app.use(express.json({limit: '6mb'}));
app.use(express.urlencoded({limit: '6mb',extended: true}));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use('/register', require('./routes/register'));
app.use('/login', require('./routes/login'));
app.use('/api/product', auth, require('./routes/api/product'));
app.use('/api/products', auth, require('./routes/api/products'));
app.use('/api/image', require('./routes/api/image'));

app.all('*', (req ,res) => {
  res.status(404);
  res.json({ error: "404 Not Found" });
})

app.use(errorHandler);

mongoose.connection.once('open', () => {
  console.log('Connected to MongoDB');
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});