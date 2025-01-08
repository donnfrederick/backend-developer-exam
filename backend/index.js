const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

mongoose.connect('mongodb://localhost:27017/item_schema', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

const itemRouter = require('./routes/items');
app.use('/api/items', itemRouter);

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});