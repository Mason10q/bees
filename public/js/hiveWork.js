const workTable = document.getElementById("work_table");
const descriptions = document.querySelectorAll('.description');
const dates = document.querySelectorAll('.date');
const addButton = document.getElementById('add_work_btn');
const delButtons = document.getElementsByName('del_btn');
const checkboxes = document.getElementsByName("checkbox");
const submitButton = document.getElementById("submit_button");

let tagedWorks = []

function makeEditable(e) {
  var cell = e.target;
  console.log(cell);
  if (cell.dataset.editing !== 'true') {
    cell.dataset.editing = true;
    var text = cell.innerText;
    cell.innerHTML = '';
    var input = document.createElement('input');
    input.addEventListener('blur', makeNonEditable);
    input.type = "text";
    input.value = text;
    cell.appendChild(input);
  }
}

function makeNonEditable(e) {
  var input = e.target;
  var text = input.value;
  var cell = input.parentElement;
  if (cell.dataset.editing === 'true') {
    cell.dataset.editing = false;
    cell.innerHTML = text;
  }

  let row = cell.parentElement.parentElement;
  const description = row.querySelector('.description');
  const date = row.querySelector('.date');

  let body = { "id": row.id, "description": description.innerText, "date": date.innerText }

  updateWork(body);
}

descriptions.forEach((d) => {
  d.addEventListener('mousedown', makeEditable);
});

dates.forEach((d) => {
  d.addEventListener('mousedown', makeEditable);
});


checkboxes.forEach((box) => {
  box.onclick = (event) => {
    let id = box.parentElement.parentElement.id;
    
    if(box.checked){
      tagedWorks.push(id);
    } else {
      tagedWorks.splice(tagedWorks.indexOf(id), 1);
    }

    console.log(tagedWorks);
  }
});

addButton.onclick = (event) => {
  insertWork({ "description": "Работа", "date": "дд.мм.гг" });
};  



function del(btn){
  let cell = btn.parentElement.parentElement;
  deleteWork({"id": cell.id });
  workTable.deleteRow(cell.rowIndex);
}

delButtons.forEach((btn) => {
  btn.onclick = () => { del(btn) }
});


submitButton.onclick = (event) => {
  if(tagedWorks.length > 0){
    makeWorksDone({ "work_ids": tagedWorks });
  }
}


function makeWorksDone(body){
  fetch("/profile/apiary/hive/work/makeDone", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body)
  }).then(() => {
    window.location.reload();
  });
}


function deleteWork(body){
    fetch("/profile/apiary/hive/work/delete", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body)
    }).then(() => {
      window.location.reload();
    });
  }
  
  
function updateWork(body){
  fetch("/profile/apiary/hive/work/update", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body) 
  }).then(() => {})
}
  
function insertWork(body){
  fetch("/profile/apiary/hive/work/insert", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body)
  }).then(() => {
    window.location.reload();
  });
}