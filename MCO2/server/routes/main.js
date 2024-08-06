const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();
const path = require('path');
const User = require('../models/user');
const Reservation = require('../models/reservation');
const passport = require('passport');

router.get('/', (req, res) => {
    if(req.user !== undefined){
        res.render('index', { title: 'Home', name: req.user.email });        
    }
    console.log(req.user)
    res.render('index', { title: 'Home' });
});

router.get('/about', (req, res) => {
    res.render('about', { title: 'About Us' });
});

router.get('/contact', (req, res) => {
    res.render('contact', { title: 'Contact Us' });
});

router.get('/profile', checkAuthenticated, async (req, res) => {
    try{
        const id = req.user._id;
        const user = await User.findById(id);
        console.log(user);
        res.render('profile', { title: 'User Profile', user: user });
    }
    catch(e){
        console.log(e);
    }
    
});

router.get('/lab_availability', (req, res) => {
    res.render('lab_availability', { title: 'Lab Availability' });
});


router.get('/reservation', checkAuthenticated, (req, res) => {
    res.render('reservation', { title: 'Reserve a Slot' });
});

router.post('/reservation', checkAuthenticated, async (req, res) => {
    const userEmail = req.user.email;
    const lab = req.body.lab;
    const seat = req.body.seat;
    const date = req.body.date;
    const time = req.body.time;
    try{
        //add to reservations
        Reservation.create({userEmail: userEmail, lab: lab, seat: seat, date: date, time: time})
        .then(res.redirect('/'));
        //add to user reservations -- can just query instead to avoid double storage
        // User.findByIdAndUpdate({_id: req.user._id},
        //     {$push: {reservations: {userEmail: userEmail, lab: lab, seat: seat, date: date, time: time}}}
        // )
    } catch(error){
        console.log(error);
        res.redirect('/reservation')
    }
});


router.get('/users', checkAuthenticated, (req, res) => {
    res.render('users', { title: 'Search Users' });
});

router.get('/login', checkNotAuthenticated, (req, res) => {
    res.render('login', { title: 'Login' });
});

router.post('/login', checkNotAuthenticated, passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: true
}));

router.get('/register', checkNotAuthenticated, (req, res) => {
    res.render('register', { title: 'Register' });
});

router.post('/register',checkNotAuthenticated, async (req, res) => {
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

function checkAuthenticated(req, res, next){
    if (req.isAuthenticated()){
        return next()
    }

    res.redirect('/login')
}

function checkNotAuthenticated(req, res, next){
    if (req.isAuthenticated()){
        return res.redirect('/')
    }
    next()
}
module.exports = router;