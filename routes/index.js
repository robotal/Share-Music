var express = require('express');
var router = express.Router();
var crypto = require('crypto');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Login'});
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

/* Login a user */
router.post('/login', function(req,res){
	var db = req.db;
	
	var userName= req.body.loginUsername;
	var userPassword= req.body.loginPassword;
	var hash = crypto.createHmac("sha1",'I am a beautiful gopherA98DF23').update(userPassword).digest('hex');
		
	var collection = db.get('usercollection').find({'username': {$eq : userName} },{},function(e,docs){
		
		var dbHash=docs[0].passwordHash;
		
		if(dbHash === hash){
			
			res.render('loggedin', {title: 'Logged in Succesfully'});
			
		}
		else{
			
			res.render('index', { title: 'Login', failed: 'true' });
		}
	});	
});

router.post('/register', function(req,res){
	var db = req.db;
	
	var firstname=req.body.registerFirstName;
	var lastname=req.body.registerLastName;
	var username=req.body.registerUserName;
	var email=req.body.registerEmail;
	var password=req.body.registerPassword;
	var confirm=req.body.registerConfirm;
	
	if(password !== confirm){
		
		res.render('index', {title: 'Login', registerError: 'Passwords do not match'});
	}
	else{
		
		var collection = db.get('usercollection').find({ $or: [ {'username': {$eq : username}} , {'email': {$eq : email}} ] },{},function(e,docs){
			
			if(docs.length >= 1){
				
				if(docs[0].username === username){
						
					res.render('index', {title: 'Login', registerError: 'Username already exists'});
				}
				else{
					
					res.render('index', {title: 'Login', registerError: 'Email already registered'});
				}
			}
			else{
				
				//write to the database
			}
		});
		
		collection = db.get('usercollection').find({'email': {$eq : email}},{},function(e,docs){
			
			if(docs.length >= 1){
				
				res.render('index', {title: 'Login', registerError: 'Email already exists'});
			}
		});
	
	}	
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
