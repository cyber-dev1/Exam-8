let names = document.getElementById("adminname");
let nameL = window.localStorage.getItem("name") ? window.localStorage.getItem("name") : "";
let role = localStorage.getItem("role") || "";
let adminForm = document.querySelector('.adminForm');
let adminName = document.querySelector('.adminName');
let adminEmail = document.querySelector('.adminEmail');
let adminPassword = document.querySelector('.adminPassword');
let AdToken = window.localStorage.getItem("token") || '';

names.textContent = "A"

function bs() {
    let page = window.location.pathname;
    if (role === "employe" && page !== ("/ishchi.html" || "/ishchi.akkaunt.html")) {
        window.location.href = "/ishchi.html";
    };
    if (role === "client" && page !== ("/client.html")) {
        window.location.href = "/client.html";
    }
};
bs();

// Formani yuborish
adminForm.addEventListener("submit", async (evt) => {
    evt.preventDefault();

    // Yuboriladigan o'zgartirilgan ma'lumotlarni saqlash
    const updatedData = {};

    // Agar adminName o'zgartirilgan bo'lsa
    if (adminName.value !== adminName.defaultValue) {
        updatedData.adminname = adminName.value;
    }

    // Agar adminEmail o'zgartirilgan bo'lsa
    if (adminEmail.value !== adminEmail.defaultValue) {
        updatedData.email = adminEmail.value;
    }

    // Agar adminPassword o'zgartirilgan bo'lsa
    if (adminPassword.value !== adminPassword.defaultValue) {
        updatedData.password = adminPassword.value;
    }

    // Agar hech qanday o'zgarish bo'lmasa, xabar berish
    if (Object.keys(updatedData).length === 0) {
        alert("Hech qanday ma'lumot o'zgartirilmagan!");
        return;
    }

    // Yuboriladigan o'zgartirishlar mavjud bo'lsa
    try {
        const req = await fetch("http://localhost:7000/api/admin/edit/1", {
            method: "PATCH",  // PATCH metodiga o'zgartirdik
            headers: {
                "Content-type": "application/json",
                "token": AdToken,
            },
            body: JSON.stringify(updatedData)
        });

        const res = await req.json();
        console.log(res);
        if (req.ok) {
            alert("Ma'lumot muvaffaqiyatli yangilandi!");
        } else {
            alert("Xatolik yuz berdi!");
        }
    } catch (error) {
        alert("Xatolik yuz berdi: " + error.message);
    }
});

// Admin ma'lumotlarini render qilish
function renderAdmin(admin) {
    adminName.value = admin[0].adminname;
    adminEmail.value = admin[0].email;
    adminPassword.value = admin[0].password;

    // Default qiymatlar
    adminName.defaultValue = admin[0].adminname;
    adminEmail.defaultValue = admin[0].email;
    adminPassword.defaultValue = admin[0].password;
}

// Admin ma'lumotlarini olish
async function getAdmin() {
    const req = await fetch("http://localhost:7000/api/admin");
    if (req.ok) {
        let res = await req.json();
        renderAdmin(res.data);
    }
};

// Sayt yuklanganda admin ma'lumotlarini olish
getAdmin();
