document.getElementsByName("hive_name").forEach((name) => {
    name.onclick = (event) => {
        window.location.assign(`/profile/apiary/hive?hive_name=${name.innerText}`);
    }
});