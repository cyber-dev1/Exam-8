let elForm = document.getElementById("loginForm") ;
let elEmailInput = document.getElementById("loginEmailInput") ;
let elPasswordInput = document.getElementById("loginPassword") ;

elForm.addEventListener("submit", async (evt) => {
    evt.preventDefault() ;
    let email = elEmailInput.value ;
    let password = elPasswordInput.value ;
    try {
        const req = await fetch("http://localhost:7000/api/auth/login", {
            method : "POST",
            headers : {
                "Content-type" : "application/json"
            },
            body : JSON.stringify({email, password})
        });
        const res = await req.json() ;
        console.log(res)
        if(req.ok){
            let name = res.names ;
            let route = res.redirectUrl ;
            let role = res.role ;
            window.localStorage.setItem("role", role)
            window.localStorage.setItem("name", name) ;
            window.localStorage.setItem("token", res.token) ;
            window.location.href = route ;
        } ;
    } catch (error) {
        console.error(error)
    }
});
