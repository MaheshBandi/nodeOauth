const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20');
const keys = require('./keys');
const User = require('../models/users-model');

passport.serializeUser((user,done)=>{

    done(null,user.id);
});


passport.deserializeUser((id,done)=>{
    User.findById(id).then((user)=>{
        done(null,user);
    });
   
});


passport.use(new GoogleStrategy({
//options for Strategy
callbackURL:'/auth/google/redirect',
clientID:keys.google.clientID,
clientSecret:keys.google.clientSecret
},(accessToken,refreshToken,profile,done)=>{
//passport callback function

//check if user already exist in our db

User.findOne({googleid:profile.id}).then((currentUser)=>{

    if(currentUser){
        // already have the user
        done(null,currentUser);
        console.log('invoked');
    }else{
        //if not ,create a new user in db
        console.log(profile.displayname);
        new User({
            username:profile.displayname,
            googleid:profile.id
        }).save().then((newUser)=>{
            console.log('new user created'+newUser);
            done(null,newUser);
        });
    }
});
   
})
);