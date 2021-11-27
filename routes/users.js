var express = require('express');
var router = express.Router();
var db = require('../connection')
var fun = require('../functions')


/* GET users listing. */

router.get('/', function(req, res) {
  res.render('index');
});
router.get('/signup',(req,res)=>{
  res.render('signup')
})
router.post('/signup',(req,res)=>{
  fun.doSignup(req.body).then((user)=>{
    console.log(user);
    res.render('index',{user})
  })

})
router.get('/login',  function(req, res) {
  res.render('login');
});
router.get('/logout',  function(req, res) {
  req.session.destroy()
  res.redirect('login');
});
router.post('/login',(req,res)=>{
  fun.doLogin(req.body).then((response)=>{
    console.log(response);
    if(response.status){
      //req.session.loggedIn = true
      req.session.user = response.user
      res.redirect('/')
    }else{
      res.redirect('/users/login')
    }

  })
})

module.exports = router;