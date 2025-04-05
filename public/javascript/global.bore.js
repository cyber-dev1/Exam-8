let names = document.getElementById("logs");
let ruyhat = document.getElementById("royhat");
let buyurtma = document.getElementById("buyurtma") ;
let ruyhat_ish = document.getElementById("ruyhat_ish");
let nameL = window.localStorage.getItem("name") ? window.localStorage.getItem("name") : "";
let role = localStorage.getItem("role") || "";
let page = window.location.pathname;


if(page == "/ishchi.qoshish.html"){
    names.textContent = nameL.at(0)
}else if(page == "/buyurtma.html"){
    buyurtma.textContent = nameL.at(0)
}else if(page == '/royhat.ishchilar.html'){
    ruyhat_ish.textContent = nameL.at(0)
}else if(page == "/royhat.buyurtmalar.html"){
    ruyhat.textContent = nameL.at(0) ;
}

function fd() {
    if (role === "employe" && page !== ("/ishchi.html" || "/ishchi.akkaunt.html")) {
        window.location.href = "/client.html";
    };
    if (role === "client" && page !== ("/client.html")) {
        window.location.href = "/client.html";
    };
}
fd();