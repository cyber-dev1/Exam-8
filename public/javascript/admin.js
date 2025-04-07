let token = localStorage.getItem("token") || "";
let role = localStorage.getItem("role") || "";
let logOut = document.getElementById("logOut");
let names = document.getElementById("adminname");
let nameL = localStorage.getItem("name") || "";

if (!token) {
    window.location.href = "/";
}
names.textContent = "A"

function fs(){
    let page = window.location.pathname;
    if(role === "employe" && page !== ("/ishchi.html" || "/ishchi.akkaunt.html")){
        window.location.href = "/ishchi.html"
    };
    if(role === "client" && page !== ("/client.html")){
        window.location.href = "/client.html"
    };
    logOut.addEventListener("click", () => {
        localStorage.removeItem("token");
        localStorage.removeItem("name");
        localStorage.removeItem("role");
        window.location.href = "/";
    });
};
fs();
    