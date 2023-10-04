let hiveAmount = document.getElementById("hive_amount");
let hiveTableBody = document.querySelector("table tbody");
let form = document.getElementById("apiary_form");
let apiaryName = document.getElementById("apiary_name");
let apiaryImage = document.getElementById("apiary_image");
let imageInput = document.querySelector("input[type=file]");

let tr = hiveTableBody.querySelectorAll("tr")[0].cloneNode(true);
let len = 1;

hiveAmount.onchange = (event) => {
    while(len > hiveAmount.value){   
        hiveTableBody.removeChild(hiveTableBody.lastChild);
        len--;
    }
    
    while(len < hiveAmount.value){
        hiveTableBody.appendChild(tr.cloneNode(true));
        len++;
    }
};


imageInput.onchange = (event) => {
    let input = event.target;

    if (input.files && input.files[0]) {
        var reader = new FileReader();
    
        reader.onload = function (e) {
            let img = document.getElementById("apiary_image");
            img.src = e.target.result;
        };

        reader.readAsDataURL(input.files[0]);
    }
}



form.onsubmit = (event) => {
    let rows = hiveTableBody.querySelectorAll("tr");
    let data = { "apiary_name": apiaryName.value, "hives": [] }

    for (let row of rows){
        let hive = {};

        for (let cell of row.cells){
            let data = cell.getElementsByClassName("data")[0];
            hive[data.name] = data.value
        }

        data["hives"].push(hive);
    }

    fetch("/profile/createApiary", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    }).then(() => {
        return true;
    });
};
