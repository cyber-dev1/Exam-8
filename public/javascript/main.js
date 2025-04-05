let token = window.localStorage.getItem("token") ? window.localStorage.getItem("token") : "" ;

if(token){
    window.location.href = "/admin.html";
};