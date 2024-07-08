const express = require('express');
const path = require('path');

const app = express();
const port = 3000;

// Middleware to serve static files from the "public" directory
app.use('/css', express.static(path.join(__dirname, 'Public/CSS')));
app.use('/js', express.static(path.join(__dirname, 'Public/JS')));
app.use(express.static(path.join(__dirname, 'views')));

// Routes to serve HTML files
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'views/index.html'));
});

app.get('/about', (req, res) => {
    res.sendFile(path.join(__dirname, 'views/about.html'));
});

app.get('/contact', (req, res) => {
    res.sendFile(path.join(__dirname, 'views/contact.html'));
});

app.get('/lab_availability', (req, res) => {
    res.sendFile(path.join(__dirname, 'views/lab_availability.html'));
});

app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'views/login.html'));
});

app.get('/profile', (req, res) => {
    res.sendFile(path.join(__dirname, 'views/profile.html'));
});

app.get('/register', (req, res) => {
    res.sendFile(path.join(__dirname, 'views/register.html'));
});

app.get('/reservation', (req, res) => {
    res.sendFile(path.join(__dirname, 'views/reservation.html'));
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});