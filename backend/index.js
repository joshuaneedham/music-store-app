const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

mongoose.connect('mongodb://mongo:27017/musicstore', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => console.log('✅ MongoDB connected'))
    .catch(err => console.error(err));

app.use('/api/tracks', require('./routes/tracks'));
app.use('/api/albums', require('./routes/albums'));
app.use('/api/samplePacks', require('./routes/samplePacks'));
app.use('/api/sounds', require('./routes/sounds'));

app.get('/', (req, res) => {
    res.send('API is working!');
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});
