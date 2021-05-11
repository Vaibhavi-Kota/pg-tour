let signinform=document.querySelector('.sign-in-form');
let registerform=document.querySelector('.register-form');
let complaintform=document.querySelector('.complaint-form');
signinform.addEventListener('submit',function(e)
						   {
	e.preventDefault();
	let email=document.getElementById('sign-in-email').value;
	let password=document.getElementById('sign-in-password').value;
	let subdomain=document.getElementById('subdomain').value;
	fetch('http://'+subdomain+'/users/login',{
		method: 'POST',
		headers:{
			'Content-Type' :'application/json'
		},
		body:JSON.stringify({email,password})
	}).then((resp)=>{
		if(resp.status ===400)
			{
				return new Error();
			}
	return resp.json();
	}).then((data)=>{
		window.location.href=data.redirectURL;
	}).catch(()=>alert('wrong email or password'));
})
registerform.addEventListener('submit',function(e)
						   {
	e.preventDefault();
	let email=document.getElementById('register-email').value;
	let password=document.getElementById('register-password').value;
	let repassword=document.getElementById('register-re-enter-password').value;
	let name=document.getElementById('register-name').value;
	let phoneno=document.getElementById('register-phoneno').value;
	let subdomain=document.getElementById('subdomain').value;
	if(password!=repassword)
		{
			return;
		}
	fetch('http://'+subdomain+'/users/register',{
		method: 'POST',
		headers:{
			'Content-Type' :'application/json'
		},
		body:JSON.stringify({email,password,name,phoneno})
	}).then((resp)=>resp.text()).then((data)=>alert(data));
})
