// if(process.env.NODE_ENV !== 'production'){
//     require('dotenv').config()
// }
const express = require('express');
const path = require('path');
const exphbs = require('express-handlebars');
const app = express();
const passport = require('passport');
const flash = require('express-flash');
const session = require('express-session');
const User = require('./server/models/user');
const port = 3000;

// Set up Handlebars view engine
app.engine('hbs', exphbs.engine({ 
    extname: '.hbs', // Ensure the extension is prefixed with a dot
    defaultLayout: 'mainLayout', // Name of the default layout file
    layoutsDir: path.join(__dirname, 'Public', 'layouts'), // Directory where layout files are located
    runtimeOptions:{allowProtoPropertiesByDefault:true,
    allowedProtoMethodsByDefault:true} 
}));
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'Public')); // Directory where view files are located

// Serve static files from the 'Public' directory
app.use(express.static(path.join(__dirname, 'Public')));
//
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(flash());
app.use(session({
    secret: "secret",
    resave: false,
    saveUninitialized: false,
}));
app.use(passport.initialize());
app.use(passport.session());

//connect database
const connectDB = require('./server/config/db');
connectDB();

//init passport
const initializePassport = require('./server/config/passport');
const exp = require('constants');
initializePassport(passport);

// Define routes
app.use('/', require('./server/routes/main'));



// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
