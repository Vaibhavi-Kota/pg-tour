let User=require('../modules/user').user;
let express=require('express');
let router=express.Router();
let auth=require("../controllers/auth");
let bcrypt = require('bcrypt');
let cur=[];

router.post('/login',async(req,res)=>{
	let email=req.body.email;
	let password=req.body.password;
	let user=await User.findOne().where({emailid:email});
	
	if(user){
		let compareres=await bcrypt.compare(password,user.password);
		if(compareres)
			{
				cur.push(user);
		
		
		
			let token=auth.generatetoken(user);
			res.cookie('auth_token',token);
			if(user.emailid==="admin@gmail.com")
				{
					res.send({
				redirectURL:'/admin'
			})
				}
			else{
			res.send({
				redirectURL:'/userpage'
			})}
			}
		else{
			res.status(400);
            res.send('Rejected');
		}
		
	}
	else{
		res.status(400);
		res.send('rejected');
	}
})

router.post('/register',async(req,res)=>{
	let email=req.body.email;
	let password=req.body.password;
	let name=req.body.name;
	let phoneno=req.body.phoneno;
	let user=await User.find().where({emailid:email}).where({phoneno:phoneno}).where({name:name});
	if(user.length===0){
		let encryptedpass=await bcrypt.hash(password,12);
		let newUser=new User({
			 emailid:email,
			password:encryptedpass,
			name:name,
			mobnum:phoneno
			
		})
		await newUser.save();
		res.send("done!! you can login now.");
	}
	else{
		res.send('rejected');
	}
})
module.exports={router:router,cur:{cur}};