const nameL = localStorage.getItem("name") || "";
const role = localStorage.getItem("role") || "";
const page = window.location.pathname;
const acToken = localStorage.getItem("token") || "";

const tovarSelect = document.getElementById("sel");
const employeSelect = document.getElementById("employe");
const priceInput = document.getElementById("price");
const buyurtmaTemp = document.querySelector('.buyurtmaTemp');

const elActForm = document.querySelector(".js-act-form");
const elClientNameInp = document.querySelector(".js-client-name-inp");
const elClientPassInp = document.querySelector(".js-client-pass-inp");
const elPriceInp = elActForm.querySelector(".js-price-inp");
const elClientTellnumberInp = elActForm.querySelector(".js-client-tellnumber-inp");
const elClientEmailInp = elActForm.querySelector(".js-client-email-inp");
const elTechSel = elActForm.querySelector(".js-tech-sel");
const elEmployeSel = elActForm.querySelector(".js-employe-sel");

async function handleDel(id) {
    const req = await fetch(`http://localhost:7000/api/action/delete/${id}`, {
        method: "DELETE",
        headers: {
            "Content-type": "application/json",
            "token": acToken
        }
    });
    const res = await req.json();
    console.log(res);
}

async function getAndRenderActions() {
    const boxRender = document.getElementById('boxRender');
    try {
        const res = await fetch("http://localhost:7000/api/action/client", {
            method: "GET",
            headers: { "Content-type": "application/json" }
        });

        if (res.ok) {
            const json = await res.json();
            const actions = json.data || [];
            const docFragment = document.createDocumentFragment();
            const template = buyurtmaTemp.content;

            actions.forEach(action => {
                const clone = template.cloneNode(true);
                const title = clone.querySelector(".card-title");
                const date = clone.querySelector(".card-text");
                const statusBtn = clone.querySelector(".btn");

                if (title) title.textContent = action.techName || "Noma'lum";
                if (date) date.textContent = action.date || "Sana yo'q";

                if (action.status == 0) {
                    statusBtn.textContent = "Tayyorlanmoqda . . .";
                } else if (action.status == 2) {
                    statusBtn.textContent = "Olib ketish !";
                    statusBtn.dataset.id = action.id;
                    statusBtn.classList.remove("disabled");
                    statusBtn.addEventListener("click", (evt) => {
                        handleDel(evt.target.dataset.id);
                    });
                }

                docFragment.appendChild(clone);
            });

            boxRender.innerHTML = "";
            boxRender.appendChild(docFragment);
        } else {
            console.error("Action GET xatolik:", await res.text());
        }
    } catch (err) {
        console.error("Action API xatosi:", err);
    }
}

function safeTextContent(id, value) {
    const el = document.getElementById(id);
    if (el) el.textContent = value;
}

if (nameL) {
    const firstLetter = "A";
    ["logs", "royhat", "buyurtma", "ruyhat_ish"].forEach(id => safeTextContent(id, firstLetter));
}

function checkAccess() {
    if (role === "employe" && page !== "/ishchi.html" && page !== "/ishchi.akkaunt.html") {
        window.location.href = "/client.html";
    }
    if (role === "client" && page !== "/client.html") {
        window.location.href = "/client.html";
    }
}
checkAccess();

let employeData = [];

function renderEmployesToSelect(data) {
    if (!employeSelect) return;
    employeSelect.innerHTML = "";

    const defaultOption = document.createElement("option");
    defaultOption.textContent = "Ishchi tanlang";
    defaultOption.disabled = true;
    defaultOption.selected = true;
    employeSelect.appendChild(defaultOption);

    data.forEach(emp => {
        const option = document.createElement("option");
        option.value = emp.username; // faqat value ishlatiladi
        option.textContent = emp.username || "Noma'lum";
        employeSelect.appendChild(option);
    });
}

async function getEmployes() {
    try {
        const res = await fetch("http://localhost:7000/api/employes");
        if (res.ok) {
            const json = await res.json();
            employeData = json.data;
            renderEmployesToSelect(employeData);
            if (page === "/royhat.ishchilar.html") handleRender(employeData);
        } else {
            console.error("API noto‘g‘ri javob:", await res.text());
        }
    } catch (err) {
        console.error("Employes GET xatolik:", err);
    }
}

let priceData = [];

function renderPricesToSelect(data) {
    if (!tovarSelect) return;
    tovarSelect.innerHTML = "";

    const defaultOption = document.createElement("option");
    defaultOption.textContent = "Texnika tanlang";
    defaultOption.disabled = true;
    defaultOption.selected = true;
    tovarSelect.appendChild(defaultOption);

    data.forEach(item => {
        const option = document.createElement("option");
        option.value = item.technicName;
        option.textContent = item.technicName;
        tovarSelect.appendChild(option);
    });

    if (priceInput) priceInput.value = "";
}

async function getPrices() {
    try {
        const res = await fetch("http://localhost:7000/api/price", {
            method: "GET",
            headers: {
                "Content-type": "application/json",
                "token": acToken,
            }
        });

        if (res.ok) {
            const json = await res.json();
            priceData = json.data;
            renderPricesToSelect(priceData);
        } else {
            console.error("Prices GET xatolik:", await res.text());
        }
    } catch (err) {
        console.error("Prices GET xatolik:", err);
    }
}

tovarSelect?.addEventListener("change", () => {
    const selectedName = tovarSelect.value;
    const found = priceData.find(item => item.technicName === selectedName);
    if (priceInput) priceInput.value = found ? found.price : "";
});

if (page === "/royhat.ishchilar.html") {
    const renderBody = document.querySelector(".hero-inner");
    const emploeTempEl = document.querySelector(".employeTemplate");

    if (renderBody && emploeTempEl) {
        function handleRender(data) {
            renderBody.innerHTML = "";
            const template = emploeTempEl.content;
            const docFragment = document.createDocumentFragment();

            data.forEach(item => {
                const clone = template.cloneNode(true);
                const name = clone.querySelector('.card-title');
                const accCount = clone.querySelector('.card-text');
                const deleteBtn = clone.querySelector(".butun");

                if (name) name.textContent = item.username || "Noma'lum";
                if (accCount) accCount.textContent = item.accCount || 0;
                if (deleteBtn) deleteBtn.dataset.id = item.id;

                docFragment.appendChild(clone);
            });

            renderBody.appendChild(docFragment);
        }

        async function handleCheckDel(dataId) {
            let yes = confirm("EMPLOYE muvaffaqiyatli o'chirildi. /ishchiQoshish.html ga qaytasizmi?");
            const targetId = dataId;
            if (!targetId) return;

            try {
                const req = await fetch(`http://localhost:7000/api/employes/delete/${targetId}`, {
                    method: "DELETE",
                    headers: {
                        "Content-type": "application/json",
                        token: acToken,
                    },
                });

                if (req.ok) {
                    await getEmployes();
                    if (yes) window.location.href = "/ishchi.qoshish.html";
                } else {
                    console.error("O'chirish xatoligi:", await req.text());
                }
            } catch (err) {
                alert(err);
                console.error("DELETE xatolik:", err);
            }
        }

        renderBody.addEventListener("click", async (evt) => {
            if (evt.target.matches(".butun")) {
                handleCheckDel(evt.target.dataset.id);
            }
        });
    }
}

elActForm.addEventListener("submit", async (evt) => {
    evt.preventDefault();
    
    const data = {
        username: elClientNameInp.value.trim(),
        phone: `+${elClientTellnumberInp.value.trim()}`,
        email: elClientEmailInp.value.trim(),
        password: elClientPassInp.value.trim(),
        techId: elTechSel.value,
        employeId: elEmployeSel.value, // faqat value (string) yuboriladi
    };

    const req = await fetch("http://localhost:7000/api/action/create", {
        method: "POST",
        headers: {
            "Content-type": "application/json",
            "token": window.localStorage.getItem("token")
        },
        body: JSON.stringify(data)
    });

    const res = await req.json();
    console.log(res);

    if (req.status == 201 && req.ok) {
        elClientNameInp.value = "";
        elClientTellnumberInp.value = "";
        elClientEmailInp.value = "";
        elClientPassInp.value = "";
        elTechSel.value = "";
        elEmployeSel.value = "";
    }
});

getEmployes();
getPrices();
getAndRenderActions();
