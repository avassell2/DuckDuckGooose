const express = require('express');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');

// Initialize Express app
const app = express();
app.use(bodyParser.json());
app.use(cors());

// Initialize SQLite database
const db = new sqlite3.Database('./scores.db', (err) => {
    if (err) {
        console.error('Error opening database:', err);
    } else {
        db.run(`
            CREATE TABLE IF NOT EXISTS scores (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                score INTEGER
            )
        `);
        console.log('Database initialized.');
    }
});

// Endpoint to get top 3 scores


// Endpoint to get top 3 scores
app.get('/scores', (req, res) => {
    db.all('SELECT score FROM scores ORDER BY score DESC LIMIT 3', [], (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
        } else {
            res.json(rows); // Send the top 3 scores
        }
    });
});


// Endpoint to save a new score
app.post('/scores', (req, res) => {
    const { score } = req.body;
    if (!score) {
        res.status(400).json({ error: 'Score is required' });
    } else {
        db.run('INSERT INTO scores (score) VALUES (?)', [score], function (err) {
            if (err) {
                res.status(500).json({ error: err.message });
            } else {
                res.json({ id: this.lastID });
            }
        });
    }
});



// Start server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running on https://duckduckgooose.onrender.com:${PORT}`);
});
