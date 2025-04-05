let role = localStorage.getItem("role") || "";
let names = document.getElementById("myAction");
let nameL = localStorage.getItem("name") || "";

names.textContent = nameL ? nameL.at(0) : "A";
