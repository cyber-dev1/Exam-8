let token = localStorage.getItem("token") || "";
let role = localStorage.getItem("role") || "";
let clientT = document.getElementById("clientLog") ;

if (!token) {
    window.location.href = "/";
}

function fs(){
    let page = window.location.pathname;
    if(role === "employe" && page !== ("/ishchi.html" || "/ishchi.akkaunt.html")){
        window.location.href = "/ishchi.html"
    };
    if(role === "admin" && page !== ("/admin.html" || "/admin.akkaunt.html")){
        window.location.href = "/admin.html"
    };
    clientT.addEventListener("click", () => {
        localStorage.removeItem("token");
        localStorage.removeItem("name");
        localStorage.removeItem("role");
        window.location.href = "/";
    });
};
fs();
    