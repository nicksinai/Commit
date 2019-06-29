const express = require('express');
const db = require('./config/db');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();

// Connect Database
db.connectDB();

// Init Middleware
app.use(express.json({ extended: false }));
app.use(morgan('combined'));
app.use(bodyParser.json());
app.use(cors());
// Confirm API Running
app.get('/', (req, res) => res.send('API Running'));

// Define Routes
app.use('/api/auth', require('./routes/api/auth'));
app.use('/api/users', require('./routes/api/users'));
app.use('/api/commitment', require('./routes/api/commitment'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
