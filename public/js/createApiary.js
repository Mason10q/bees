let hiveAmount = document.getElementById("hive_amount");
let hiveTableBody = document.getElementById("hive_table_body");
let saveBtn = document.getElementById("save_btn");
let apiaryName = document.getElementById("apiary_name");
let apiaryImage = document.getElementById("apiary_image");
let imageInput = document.querySelector("input[type=file]");

let tr = hiveTableBody.querySelectorAll("tr")[0].cloneNode(true);
let imageChanged = false;

hiveAmount.onchange = (event) => {
    while (hiveTableBody.querySelectorAll("tr").length > hiveAmount.value) {
        hiveTableBody.removeChild(hiveTableBody.lastChild);
    }

    while (hiveTableBody.querySelectorAll("tr").length < hiveAmount.value) {
        hiveTableBody.appendChild(tr.cloneNode(true));
    }
};


imageInput.onchange = (event) => {
    let input = event.target;

    imageChanged = true;

    if (input.files && input.files[0]) {
        var reader = new FileReader();

        reader.onload = function (e) {
            let img = document.getElementById("apiary_image");
            img.src = e.target.result;
        };

        reader.readAsDataURL(input.files[0]);
    }
}



saveBtn.onclick = (event) => {
    let rows = hiveTableBody.querySelectorAll("tr");
    let data = { "apiary_name": apiaryName.value, "hives": [] }

    for (let row of rows) {
        let hive = {};

        for (let cell of row.cells) {
            let data = cell.getElementsByClassName("data")[0];
            hive[data.name] = data.value
        }

        data["hives"].push(hive);
    }

    fetch("/profile/apiary/create", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data)
    })
    .then((res) => {

        if (imageChanged) {
            let formData = new FormData();
            formData.append("image", imageInput.files[0]);

            fetch("/profile/apiary/avatar/update", {
                method: "PUT",
                body: formData
            })
                .then((res) => {
                    window.location.assign("/profile/apiary");
                });
        } else {
            window.location.assign("/profile/apiary");
        }
    });
};
