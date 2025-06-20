const express = require('express');
const crypto = require('crypto');
const cors = require('cors');

const app = express();
const PORT = 3000;


app.use(cors());
app.use(express.json());

const dataStore = {};

app.post('/generate', (req, res) => {
    const inputs = req.body.inputs;
    if (!inputs || inputs.length !== 5) {
        return res.status(400).json({ error: 'Five inputs are required.' });
    }

    const inputString = inputs.join('|');
    const key = crypto.createHash('sha256').update(inputString).digest('hex').substring(0, 10);

    dataStore[key] = inputs;

    res.json({ key });
});

app.get('/search/:key', (req, res) => {
    const key = req.params.key;
    if (dataStore[key]) {
        res.json({ inputs: dataStore[key] });
    } else {
        res.status(404).json({ error: 'Key not found.' });
    }
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
