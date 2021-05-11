  
let jwt=require('jsonwebtoken');
let secret='djnk68kn8h';

function generatetoken(user)
{
	let payload={
		email:user.email,
		userid:user._id,
		password:user.password
	}
	return jwt.sign(payload,secret);
} 

function checktoken(token)
{
	return jwt.verify(token,secret);
}


module.exports={generatetoken,checktoken};