let express=require("express");
let app=express();
let bodyparser=require("body-parser");
let cookieparser=require("cookie-parser");
let mongoose=require("mongoose");
let jwt=require('jsonwebtoken');
let auth=require("./controllers/auth");
let alert = require('alert');
const url = require('url');
window:true;
mongoose.connect(process.env.MONGODB_URI || 'mongodb+srv://Vaibhavi-Kota:vaibhu9999@travingo.vfkhz.mongodb.net/pgtour?retryWrites=true&w=majority', {
	useNewUrlParser: true,
	useUnifiedTopology:true
});

let usersRouter=require('./routes/users');
let {cur}=usersRouter.cur;

app.use(express.static('public'));
app.use(express.json());
app.use('/users',usersRouter.router);
app.use(bodyparser.urlencoded({extended:false})) ;
app.use(bodyparser.json()) ;
app.use(cookieparser()); 
app.set("view engine",'ejs');
let db=mongoose.connection;
db.on("error",console.error.bind(console,"connection error:"));
db.once("open",()=>{
	console.log("database connected");
})
let user=require("./modules/user").user;
let room=require("./modules/user").room;
let payment=require("./modules/user").feedetails;
let complaint=require("./modules/user").complaint;

// let newroom=new room({
// 		roomnum:101,
// 		occupancy:false,
// 	sharing:2

// 				})
// newroom.save();

// room.find({}, function (err,Allusers){if(err){console.log("oops");}
// else {
// console.log(Allusers);
// }
// });

function getSubdomain(h) {
  var parts = h.split(".");
	if(parts.length == 2) return "www";
	return parts[0];
}
app.get('/',async(req,res)=>
	   {
	let token=req.cookies['auth_token'];
	   	let allrooms=await room.find({});
	res.render("home",{rooms:allrooms,token:token});
})
app.get('/continue',(req,res)=>
	   {

	res.render("continue");
})
app.get('/home',async(req,res)=>
	   {
	   	let token=req.cookies['auth_token'];
	   	let allrooms=await room.find({});
	res.render("home",{rooms:allrooms,token:token});
})

app.get('/login',async(req,res)=>
	   {
	let token=req.cookies['auth_token'];
	var subdomain = getSubdomain(req.headers.host);
	if(token && auth.checktoken(token)){
		let someuser=auth.checktoken(token);
		 let curr=someuser.userid;
		let curuser=await user.findOne().where({_id:curr});
		let curroomid=curuser.room_id;

		let curroom=null;
		if(curroomid)
		{
			let curroom=await room.findOne().where({_id:curroomid});
			
		}
		if(curuser!=null && curuser.emailid=="admin@gmail.com")
		{
			res.redirect("/admin");
		}
		res.render("userpage",{curuser:curuser,curroom:curroom});
	}
	else{
		res.render("login",{subdomain:subdomain});
	}
})
app.get('/userpage',async(req,res)=>
	   {
	   		let token=req.cookies['auth_token'];
	   		if(token && auth.checktoken(token)){
	   	let someuser=auth.checktoken(token);
		 let curr=someuser.userid;
		let curuser=await user.findOne().where({_id:curr});
		let payments=await payment.find().where({_id:curuser.payments});
		let curroomid=curuser.room_id;
		let curroom=null;
		if(curroomid)
		{
			curroom=await room.findOne().where({_id:curroomid});
		}
		if(curroom===null)
		{
			res.redirect('/home');
		}
		res.render("userpage",{curuser:curuser,curroom:curroom,payments:payments});}
		else{
			res.redirect("/continue");
		}
})
app.post('/addcomplaint',async(req,res)=>{
	let token=req.cookies['auth_token'];
	if(token && auth.checktoken(token)){
		let roomnumber=req.body.roomno;
		let complaintstring=req.body.complaintstring;
		let newcomplaint=new complaint({
					roomnum:roomnumber,
					complaint:complaintstring
				})
				
				await newcomplaint.save();
				alert('Done!! complaint registered');
				res.redirect('/userpage');
			}
			else{
				res.redirect("/continue");
			}

})

app.get('/admin',async(req,res)=>{
	let token=req.cookies['auth_token'];
	if(token && auth.checktoken(token)){
	let someuser=auth.checktoken(token);
		 let curr=someuser.userid;
	let curuser=await user.findOne().where({_id:curr});
	if(curuser.emailid==="admin@gmail.com"){
	let allrooms=await room.find({});
	let allusers=await user.find({});
	let allpayments=await payment.find({});
	let allcomplaints=await complaint.find({});
	res.render("admin",{rooms:allrooms,users:allusers,payments:allpayments,complaints:allcomplaints});
}
	else{
		res.send("Only admin has access");
	}
	}
	else{
		res.redirect("/continue");
	}
		
})
app.get('/payments',async(req,res)=>
	   {
	let token=req.cookies['auth_token'];
	if(token && auth.checktoken(token)){
		let someuser=auth.checktoken(token);
		 let curr=someuser.userid;
	let curuser=await user.findOne().where({_id:curr});
	
	if(curuser.emailid==="admin@gmail.com"){
	
	let allpayments=await payment.find({});
		
	res.render("payments",{payments:allpayments});	
	}
	else{
		res.send("Only admin has access");
	}}
	else{
		res.redirect("/continue");
	}
})
app.get('/allcomplaints',async(req,res)=>
	   {
	let token=req.cookies['auth_token'];
	if(token && auth.checktoken(token)){
		let someuser=auth.checktoken(token);
		 let curr=someuser.userid;
	let curuser=await user.findOne().where({_id:curr});
	
	if(curuser.emailid==="admin@gmail.com"){
	
	let allcomplaints=await complaint.find({});
		
	res.render("complaints",{complaints:allcomplaints});	
	}
	else{
		res.send("Only admin has access");
	}}
	else{
		res.redirect("/continue");
	}
})
app.get('/room',async(req,res)=>{
	let token=req.cookies['auth_token'];
	let loggedinuser=null;
	if(token && auth.checktoken(token)){
		let someuser=auth.checktoken(token);
		 let curr=someuser.userid;
	loggedinuser=await user.findOne().where({_id:curr});}
	var roomnum =await req.query.room;
	let curroom=await room.findOne().where({roomnum:roomnum});
	let curusers=[]	;
	for(i=0;i<curroom.users.length;i++)
	{
		let curuser=await user.findOne().where({_id:curroom.users[i]._id});
		await curusers.push(curuser);
	}
	let curpayments=await payment.find().where({_id:curroom.payments});
	await res.render("room",{room:curroom,users:curusers,payments:curpayments,curuser:loggedinuser});
})

app.post('/selectroom',async(req,res)=>{
	let token=req.cookies['auth_token'];
	let loggedinuser=null;
	if(token && auth.checktoken(token)){
		let someuser=auth.checktoken(token);
		 let curr=someuser.userid;
	loggedinuser=await user.findOne().where({_id:curr});}
		let roomnum=req.body.roomno;
		let curroom=await room.findOne().where({ roomnum:roomnum});
		let curusers=await user.find().where({_id:curroom.users});
		let curpayments=await payment.find().where({roomnum:roomnum});
		
	res.render("room",{room:curroom,users:curusers,payments:curpayments,curuser:loggedinuser});
	
	
})
app.get('/logout',(req,res)=>{
	let token=req.cookies['auth_token'];
	
	if(token && auth.checktoken(token)){
		
		res.render("logout");
		
	}
	else{
		res.render("home");
	}
})
app.post('/logout',async(req,res)=>{
	let token=req.cookies['auth_token'];
	if(token && auth.checktoken(token)){
		res.clearCookie("auth_token");
	res.redirect("/home");
	}
	
})

app.post('/addmember',async(req,res)=>{
		
		let token=req.cookies['auth_token'];
	if(token && auth.checktoken(token)){
	let someuser=auth.checktoken(token);
		 let curr=someuser.userid;
	let loggedinuser=await user.findOne().where({_id:curr});
	if(loggedinuser.emailid==="admin@gmail.com"){
	let emailid=req.body.email;
		let username=req.body.username;
		let roomnum=req.body.roomnum;
		let curuser=null;
		curuser=await user.findOne().where({emailid:emailid,name:username});
		let curroom=await room.findOne().where({roomnum:roomnum});
		
		if(curuser!=null)
		{
			let curruserroomno=null;
			let curuserroomid=curuser.room_id;
			let curuserroom=null;
			curuserroom=await room.findOne().where({_id:curuserroomid});
			
			if(curuserroom!==null)
			{
				res.send("user already belongs to a room");
			}
			else
			{
				curroom.users.push(curuser);
				
				await curroom.save();
				curuser.room_id=curroom;
				
				await curuser.save();
   				 res.redirect(url.format({
			       pathname:"/room",
			       query: {
			          "room": curroom.roomnum,
			        }
			     }));

			}
		}
		else{
			res.send("user doesn't exist");
		}
	}
	else{
		res.send("Only admin has access");
	}
	}
	else{
		res.redirect("/continue");
	}	
})
app.post('/removemember',async(req,res)=>{
	let token=req.cookies['auth_token'];
	if(token && auth.checktoken(token)){
	let someuser=auth.checktoken(token);
		 let curr=someuser.userid;
	let loggedinuser=await user.findOne().where({_id:curr});
	if(loggedinuser.emailid==="admin@gmail.com"){
		let usernum=req.body.usernum;
		let roomnum=req.body.roomnum;
		let curroom=await room.findOne().where({roomnum:roomnum});
		let curuserid=curroom.users[usernum-1]._id;
		
		let curuser=await user.findOne().where({_id:curuserid});
		
		if(usernum-1<0 || usernum>curroom.users.length)
		{
			res.send("Cannot delete invalid user number");
		}
		else{
			curroom.users.splice(usernum-1, 1);
			await curroom.save();
				curuser.room_id=null;
				await curuser.save();
   				 res.redirect(url.format({
			       pathname:"/room",
			       query: {
			          "room": curroom.roomnum,
			        }
			     }));
		}
	}
	else{
		res.send("Only admin has access");
	}
	}
	else{
		res.redirect("/continue");
	}	
	
})
app.post('/addpayment',async(req,res)=>{
		try{
			let token=req.cookies['auth_token'];
			if(token && auth.checktoken(token)){
				let someuser=auth.checktoken(token);
		 		let curr=someuser.userid;
				let loggedinuser=await user.findOne().where({_id:curr});
				if(loggedinuser.emailid==="admin@gmail.com"){
					let emailid=req.body.emailid;
					let username=req.body.username;
					let roomnum=req.body.roomno;
					let curuser=null,curroom=null;
					curuser=await user.findOne().where({emailid:emailid});
					curroom=await room.findOne().where({roomnum:roomnum});
					
					if(curuser!=null && curroom!=null)
					{
						let newpayment=await new payment({
							roomnum:roomnum,
							user_id:curuser,
							payment_date:new Date(),
							username:username
						})
						newpayment.save();
						curroom.payments.push(newpayment);
						await curroom.save();
						curuser.payments.push(newpayment);
						await curuser.save();	
						res.send("Added payment");
					}
					else{
						res.send("Invalid payment");
					}
				}
				else{
					res.send("Only admin has access");
				}
			}
			else{
				res.redirect("/continue");
			}	
			
		}
		catch(err){
			console.log(err);
		}
	
})
let port=process.env.PORT||3000;
app.listen(port,'0.0.0.0',()=>{
	console.log(`listening to port ${port}`);
})
