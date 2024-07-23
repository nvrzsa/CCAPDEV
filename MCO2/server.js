const express = require('express');
const path = require('path');
const exphbs = require('express-handlebars');
const app = express();
const port = 3000;

// Set up Handlebars view engine
app.engine('hbs', exphbs.engine({ 
    extname: '.hbs', // Ensure the extension is prefixed with a dot
    defaultLayout: 'mainLayout', // Name of the default layout file
    layoutsDir: path.join(__dirname, 'Public', 'layouts') // Directory where layout files are located
}));
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'Public')); // Directory where view files are located

// Serve static files from the 'Public' directory
app.use(express.static(path.join(__dirname, 'Public')));

// Define routes
app.get('/', (req, res) => {
    res.render('index', { title: 'Home' });
});

app.get('/about', (req, res) => {
    res.render('about', { title: 'About Us' });
});

app.get('/contact', (req, res) => {
    res.render('contact', { title: 'Contact Us' });
});

app.get('/profile', (req, res) => {
    res.render('profile', { title: 'User Profile' });
});

app.get('/lab_availability', (req, res) => {
    res.render('lab_availability', { title: 'Lab Availability' });
});

app.get('/reservation', (req, res) => {
    res.render('reservation', { title: 'Reserve a Slot' });
});

app.get('/users', (req, res) => {
    res.render('users', { title: 'Search Users' });
});

app.get('/login', (req, res) => {
    res.render('login', { title: 'Login' });
});

app.get('/register', (req, res) => {
    res.render('register', { title: 'Register' });
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
