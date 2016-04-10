var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Login' });
});

router.get('/helloworld', function(req, res) {
	res.render('helloworld', {title: 'Hello World!'});
});

router.get('/userlist', function(req,res) {
	var db = req.db;
	var collection = db.get('usercollection');
	collection.find({},{},function(e,docs){
		res.render('userlist', {
			"userlist": docs
		});
	});
});

/* Get new user page */
router.get('/newuser', function(req,res){
	res.render('newuser', {title: 'Add New User'});
});

router.post('/adduser', function(req, res){
	//Set our internal db var
	var db = req.db;
	
	//get form values
	var userName = req.body.username;
	var userEmail = req.body.useremail;
	
	//set out collection
	var collection = db.get('usercollection');
	
	// submit to db 
	collection.insert({
		"username" : userName,
		"email" : userEmail
	}, function(err, doc){
		if(err) {
			//If it failed return an error
			res.send("There was a problem adding info to database.");
		}
		else {
			// And forward to success
			res.redirect("userlist");
		}
	});
});
module.exports = router;
