let names = document.getElementById("ishchiname");
let nameL = window.localStorage.getItem("name") ? window.localStorage.getItem("name") : "";
let role = localStorage.getItem("role") || "";

let profileForm = document.querySelector('.ishchi_form');
let profileName = document.querySelector('.profile_name');
let profilEmail = document.querySelector('.profile_email');
let profileNumber = document.querySelector('.profile_number');
let profilePassword = document.querySelector('.profile_password');
let inputs = document.querySelectorAll('input');


let btne = document.querySelector('.btne');

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

async function loadProfile() {
    let token = window.localStorage.getItem("token");
    let userId = JSON.parse(atob(token.split('.')[1])).id;
    const req = await fetch(`http://localhost:7000/api/employes/${userId}`, {
        method: 'GET',
        headers: {
            'token': token
        }
    });
    let res = await req.json();
    console.log(res);
    if (req.ok) {
        profileName.value = res.data.username || "";
        profilEmail.value = res.data.email || "";
        profileNumber.value = res.data.phone;
        profilePassword.value = res.data.password || "";
        setInitialValues();
    } else {
        console.log("Malumotlar olinmadi");
    }
}

let initialValues = {
    username: '',
    email: '',
    phone: '',
    password: ''
};

function setInitialValues() {
    initialValues.username = profileName.value;
    initialValues.email = profilEmail.value;
    initialValues.phone = profileNumber.value;
    initialValues.password = profilePassword.value;
}

function checkButtonState() {
    const isChanged = profileName.value !== initialValues.username ||
        profilEmail.value !== initialValues.email ||
        profileNumber.value !== initialValues.phone ||
        profilePassword.value !== initialValues.password;

    btne.classList.add('disabled');
}

profileName.addEventListener('input', checkButtonState);
profilEmail.addEventListener('input', checkButtonState);
profileNumber.addEventListener('input', checkButtonState);
profilePassword.addEventListener('input', checkButtonState);

async function updateProfile() {
    const token = localStorage.getItem("token");
    const userId = JSON.parse(atob(token.split('.')[1])).id;

    const updatedProfile = {
        username: profileName.value,
        email: profilEmail.value,
        phone: profileNumber.value,
        password: profilePassword.value,
    };

    const response = await fetch(`http://localhost:7000/api/employes/edit/${userId}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            'token': token,
        },
        body: JSON.stringify(updatedProfile),
    });

    if (response.ok) {
        alert("Ma'lumotlar muvaffaqiyatli yangilandi!");
        setInitialValues();
        checkButtonState();
    } else {
        alert("Ma'lumotlarni yangilashda xatolik yuz berdi!");
    }
}

profileForm.addEventListener('submit', (e) => {
    e.preventDefault();
    updateProfile();
});

loadProfile();

