let names = document.getElementById("adminname");
let nameL = window.localStorage.getItem("name") ? window.localStorage.getItem("name") : "";
let role = localStorage.getItem("role") || "";

names.textContent = nameL ? nameL.at(0) : "A";

function bs() {
    let page = window.location.pathname;
    if (role === "employe" && page !== ("/ishchi.html" || "/ishchi.akkaunt.html")) {
        window.location.href = "/ishchi.html"
    };
    if (role === "client" && page !== ("/client.html")) {
        window.location.href = "/client.html"
    }
};
bs();