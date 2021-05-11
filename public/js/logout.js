let logoutbtn=document.querySelector('.log-out-btn');
logoutbtn.addEventListener('click',function(){
	document.cookie.split(";").forEach(function(c) { document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/"); });
	window.location.href='/';
})