const nameL = localStorage.getItem("name") || "";
const role = localStorage.getItem("role") || "";
const acToken = localStorage.getItem("token") || "";
const page = window.location.pathname;

function safeTextContent(id, value) {
    const el = document.getElementById(id);
    if (el) {
        el.textContent = value;
    }
}
if (nameL) {
    const firstLetter = "A"
    safeTextContent("logs", firstLetter);
    safeTextContent("royhat", firstLetter);
    safeTextContent("buyurtma", firstLetter);
    safeTextContent("ruyhat_ish", firstLetter);
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

if (page === "/royhat.ishchilar.html") {
    const renderBody = document.querySelector(".hero-inner");
    const emploeTempEl = document.querySelector(".employeTemplate");

    if (renderBody && emploeTempEl) {
        let resData = [];

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

        async function getEmployes() {
            try {
                const res = await fetch("http://localhost:7000/api/employes");
                if (res.ok) {
                    const json = await res.json();
                    resData = json.data;
                    handleRender(resData);
                } else {
                    console.error("API dan noto'g'ri javob qaytdiku:", await res.text());
                }
            } catch (err) {
                console.error("Xatolik:", err);
            }
        };

        async function handleCheckDel(dataId) {
            let yes = confirm("EMPLOYE muvaffaqiyatli O'chirildi . . . /ishchiQoshish.html ga qaytasizmi ?");
            if (yes) {
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
                        window.location.href = "/ishchi.qoshish.html";
                    } else {
                        console.error("O'chirish xatoligi:", await req.text());
                    }
                } catch (err) {
                    alert(err);
                    console.error("DELETE so'rovda xatolik:", err);
                }
            } else {
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
                    } else {
                        console.error("O'chirish xatoligi:", await req.text());
                    }
                } catch (err) {
                    alert(err);
                    console.error("DELETE so'rovda xatolik:", err);
                }
            }
        }

        renderBody.addEventListener("click", async (evt) => {
            if (evt.target.matches(".butun")) {
                handleCheckDel(evt.target.dataset.id)
            }
        });
        getEmployes();
    }
}
