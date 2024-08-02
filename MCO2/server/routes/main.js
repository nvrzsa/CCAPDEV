const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();
const path = require('path');
const User = require('../models/user');
const passport = require('passport');

router.get('/', (req, res) => {
    var name = 'brian';
    res.render('index', { name, title: 'Home' });
});

router.get('/about', (req, res) => {
    res.render('about', { title: 'About Us' });
});

router.get('/contact', (req, res) => {
    res.render('contact', { title: 'Contact Us' });
});

router.get('/profile', (req, res) => {
    res.render('profile', { title: 'User Profile' });
});

router.get('/lab_availability', (req, res) => {
    res.render('lab_availability', { title: 'Lab Availability' });
});

router.get('/reservation', (req, res) => {
    res.render('reservation', { title: 'Reserve a Slot' });
});

router.get('/users', (req, res) => {
    res.render('users', { title: 'Search Users' });
});

router.get('/login', (req, res) => {
    res.render('login', { title: 'Login' });
});

router.post('/login', passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: true
}),  (req, res) =>{
    res.redirect('/');
});

router.get('/register', (req, res) => {
    res.render('register', { title: 'Register' });
});

router.post('/register', async (req, res) => {
    const email = req.body.email;
    const password = req.body.password;
    const role = req.body.role;
    try{
        const hashed = await bcrypt.hash(password, 10);
        //check is username exists ; check validity of argument - !null
        User.create({email: email, password: hashed, role: role})
        .then(res.redirect('/login'))
    } catch(error){
        console.log(error);
        res.redirect('/register')
    }
});

//for 404 errors
// router.use((req, res) =>{
//     //make 404 hbs
//     res.status(404).render('404', {title: '404'})
// })
module.exports = router;