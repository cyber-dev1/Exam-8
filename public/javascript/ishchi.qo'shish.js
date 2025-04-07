let elForm = document.getElementById("adIshchi");

let elIsmInput = document.querySelector(".ism");
let elContactInput = document.querySelector(".contact");
let elEmailInput = document.querySelector(".exampleInputEmail2");
let elPasswordInput = document.querySelector(".password");
let accToken = window.localStorage.getItem("token") ? window.localStorage.getItem("token") : window.location.href = "/"

elForm.addEventListener("submit", async (evt) => {
    evt.preventDefault();
    let email = elEmailInput.value;
    let password = elPasswordInput.value;
    let phones = elContactInput.value;
    let username = elIsmInput.value;
    let phone = `+${phones}`;
    try {
        const req = await fetch("http://localhost:7000/api/employes/create", {
            method: "POST",
            headers: {
                "Content-type": "application/json",
                "token": accToken,
            },
            body: JSON.stringify({ username, email, phone, password })
        });
        if (req.ok) {
            elEmailInput.value = '';
            elPasswordInput.value = '';
            elContactInput.value = '';
            elIsmInput.value = '';
            let son = confirm("Ishching qo'shildi uni ko'rasanmi yes or no !!");
            if(son){
                window.location.href = "/royhat.ishchilar.html"
            };
        }
        const res = await req.json();
    } catch (error) {
        alert(error);
        console.error(error)
    }
});
