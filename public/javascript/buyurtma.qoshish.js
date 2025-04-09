let Tokenn = window.localStorage.getItem("token") || ""
const tovarSelect = document.getElementById("sel");
const priceInput = document.getElementById("price");
let priceData = [];

async function getPrices() {
    try {
        const res = await fetch("http://localhost:7000/api/price", {
            method: "GET",
            headers: {
                "Content-type": "application/json",
                "token": Tokenn,
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

    if (priceInput) {
        priceInput.value = "";
    }
}

tovarSelect?.addEventListener("change", () => {
    const selectedName = tovarSelect.value;
    const found = priceData.find(item => item.technicName === selectedName);
    if (priceInput) priceInput.value = found ? found.price : "";
});

getPrices();
