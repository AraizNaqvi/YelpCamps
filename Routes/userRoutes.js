let express = require('express');
let router = express.Router();
let User = require('../models/user');
let AsyncError = require('../utils/AsyncError');
let ExpressError = require('../utils/ExpressError');
const passport = require('passport');

router.get('/register', (req, res) => {
    res.render('register');
})
router.get('/login', (req, res) => {
    res.render('login');
})
router.get('/logout', (req, res, next) => {
    req.logout(function(err){
        if(err) return next(err);
        res.redirect('/camps');
    });
});

router.post('/register', async(req, res, next) => {
    try{
        let {email, username, password} = req.body;
        let user = new User({email, username});
        let registeredUser = await User.register(user, password);
        console.log(registeredUser);
        req.login(registeredUser, err => {
            if(err) return next(err);
            res.redirect('/camps');
        })
    }
    catch(e){
        console.log("Problem with the form try changing username, password or email...");
        res.redirect('register');
    }
})
router.post('/login', passport.authenticate('local', { failureRedirect: '/login'}), (req, res) => {
    let redirectURL = req.session.returnTo || '/camps';
    delete req.session.returnTo;
    res.redirect(redirectURL);
})

module.exports = router;