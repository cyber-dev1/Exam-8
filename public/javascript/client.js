let token = localStorage.getItem("token") || "";
let role = localStorage.getItem("role") || "";
let clientT = document.getElementById("clientLog");
let cliTemp = document.getElementById('clTemp').content;
let boxs = document.getElementById("boxs")

if (!token) {
    window.location.href = "/";
}

function fs() {
    let page = window.location.pathname;
    if (role === "employe" && page !== ("/ishchi.html" || "/ishchi.akkaunt.html")) {
        window.location.href = "/ishchi.html"
    };
    if (role === "admin" && page !== ("/admin.html" || "/admin.akkaunt.html")) {
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



const url = "http://localhost:7000/api/action/client";


function handleRenders(data) {
    let frag = document.createDocumentFragment();
    data.forEach(item => {
        let clone = cliTemp.cloneNode(true);
        clone.querySelector(".card-title").textContent = item.techName;
        clone.querySelector('.card-text').textContent = item.date;
        if (item.status == 1){
            clone.querySelector('.stat').textContent = "Olib ketish !";

        }else if(item.status == 0){
            clone.querySelector('.stat').textContent = "Tayyorlanmoqda . . .";
        }

        frag.append(clone);
    });
    boxs.append(frag);
}

async function getClientTechnic() {
    try {
        const req = await fetch(url, {
            method: "GET",
            headers: {
                "Content-type": "application/json",
            }
        });
        const res = await req.json();
        handleRenders(res.data);
    } catch (error) {
        console.log(error)
    }
};

getClientTechnic();








