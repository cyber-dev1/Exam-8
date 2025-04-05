let names = document.getElementById("ishchiname");
let nameL = window.localStorage.getItem("name") ? window.localStorage.getItem("name") : "";
let role = localStorage.getItem("role") || "";

names.textContent = nameL ? nameL.at(0) : "E";

function fd() {
    let page = window.location.pathname;
    if (role === "admin" && page !== ("/admin.html" || "/admin.akkaunt.html")) {
        window.location.href = "/admin.html";
    };
    if (role === "client" && page !== ("/client.html")) {
        window.location.href = "/client.html";
    };
}
fd();