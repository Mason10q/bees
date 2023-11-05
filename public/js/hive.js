const hiveName = document.getElementById("hive_name");
const apiaryName = document.getElementById("apiary_name");
const apiaryImage = document.getElementById("hive_image");
let imageInput = document.querySelector("input[type=file]");
let saveBtn = document.getElementById("save_btn");
let img = document.getElementById("hive_image");
let imageChanged = false;

document.getElementById("scheduled_work").onclick = (event) => {
    window.location.assign(`/profile/apiary/hive/work/scheduled?hive_name=${hiveName.innerText}`);
};


document.getElementById("done_work").onclick = (event) => {
    window.location.assign(`/profile/apiary/hive/work/done?hive_name=${hiveName.innerText}`);
};


imageInput.onchange = (event) => {
    let input = event.target;

    imageChanged = true;

    if (input.files && input.files[0]) {
        var reader = new FileReader();

        reader.onload = function (e) {
            img.src = e.target.result;
        };

        reader.readAsDataURL(input.files[0]);
    }
}



saveBtn.onclick = (event) => {
    let description = document.getElementById("description");
    let formData = new FormData();

    if(imageChanged){
        formData.append("image", imageInput.files[0]);
    }

    formData.append("description", description.value);

    fetch(`/profile/apiary/hive/update`, {
        method: "PUT",
        body: formData
    })
    .then((res) => {
        imageChanged = false;
        window.location.reload();
    });
        
};
