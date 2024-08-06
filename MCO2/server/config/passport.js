const localStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt')
const User = require('../models/user');

function initialize(passport){
    const authenticateUser = async (email, password, done) => {
        try{
            const user = await User.findOne({email: email}).then(user=>{
                if(!user){
                    console.log("null user");
                }
                return user;
            }).catch(err=>{console.log(err)});
            if (user == null){ return done(null, false, {message: 'no user with that email'});}
            console.log(await bcrypt.compare(password, user.password));
            if(await bcrypt.compare(password, user.password)){ 
                return done(null, user);
            } else{
                return done(null, false, {message: 'Incorrect Password'});
            }
        }catch (e){
            return done(e);
        }
    }
    passport.use(new localStrategy({usernameField:'email', passwordField: 'password'}, authenticateUser))
    passport.serializeUser((user, done) => done(null,user.id))
    passport.deserializeUser((id, done) => {
        User.findById(id).then(function(user){
            done(null, user);
        }).catch(function(err){
            done(err);
        })
})
}
module.exports = initialize;