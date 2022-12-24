const bcrypt = require('bcryptjs');

const User = require('../models/user');
const phn = require('../models/phn-no');

exports.getLogin = (req, res, next) => {
  let message = req.flash('error');
  if(message.length > 0){
    message = message[0];
  } else {
    message = null;
  }
  res.render('auth/login', {
    path: '/login',
    pageTitle: 'Login',
    errorMessage: message
  });
};

exports.getSignup = (req, res, next) => {
  let message = req.flash('error');
  if(message.length > 0){
    message = message[0];
  } else {
    message = null;
  }
  res.render('auth/signup', {
    path: '/signup',
    pageTitle: 'Signup',
    errorMessage: message
  });
};

exports.postLogin = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  User.findOne({ where: { email: email } })
    .then(user => {
      if(!user) {
        req.flash('error', 'Invalid email or password.');
        return res.redirect('/login');
      }
      bcrypt
      .compare(password, user.password)
      .then(doMatch => {
        if(doMatch){
          req.session.isLoggedIn = true;
          req.session.user = user;
          return req.session.save(err => {
          console.log(err);
          res.redirect('/');
      });
     }
       req.flash('error', 'Invalid email or password.');
       res.redirect('/login');
      })
      .catch(err => {
        console.log(err);
      });
    })
    .catch(err => console.log(err));
};

exports.postSignup = (req, res, next) => {
  const name = req.body.name;
  const phnNo = req.body.phnNo;
  const phnNoAlt = req.body.phnNoAlt;
  const email = req.body.email;
  const password = req.body.password;
  const confirmPassword = req.body.confirmPassword;
  User.findOne({ where: { email: email } })
    .then(userDoc => {
      if (userDoc) {
        req.flash('error', 'E-Mail exists already. Please use another email.');
        return res.redirect('/signup');
      }
      return  bcrypt
      .hash(password, 12)
      .then(hashedPassword => {
        return User.create({
          name: name,
          password: hashedPassword, 
          email: email
          })
      }) 
      .then(user => {
        return user.createCart();
      })
    .then(user => {
      if(phnNoAlt.length > 0){
        phn.create({
          userId: user.id,
          phn_Number: phnNo
        });
        return phn.create({
          userId: user.id,
          phn_Number: phnNoAlt
        })
      }
      return phn.create({
        userId: user.id,
        phn_Number: phnNo
      })
    })
    .then(result => {
      res.redirect('/login');
    })
    .catch(err => {
      console.log(err);
    });
  })
};

exports.postLogout = (req, res, next) => {
  req.session.destroy(err => {
    console.log(err);
    res.redirect('/');
  });
};
