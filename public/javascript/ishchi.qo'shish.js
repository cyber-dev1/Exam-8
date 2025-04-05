let elForm = document.getElementById("adIshchi");

let elIsmInput = document.querySelector(".ism");
let elContactInput = document.querySelector(".contact");
let elEmailInput = document.querySelector(".exampleInputEmail2");
let elPasswordInput = document.querySelector(".password");

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
                "Content-type": "application/json"
            },
            body: JSON.stringify({ username, email, phone, password })
        });
        if (req.ok) {
            elEmailInput.value = '';
            elPasswordInput.value = '';
            elContactInput.value = '';
            elIsmInput.value = '';
            alert("TEKIN ishching muvaffaqqiyatli qo'shildi !"); 
        }
        const res = await req.json();
        console.log(res);
    } catch (error) {
        console.error(error)
    }
});
