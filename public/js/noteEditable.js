const noteTable = document.getElementById("note_table");
const notes = document.querySelectorAll('.note');
const addButton = document.getElementById('add_note_btn');
const delButtons = document.getElementsByName('del_btn');

function makeEditable(e) {
  var cell = e.target;
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

  let body = { "id": cell.parentElement.id, "text": text }

  updateNote(body);
}


function del(btn){
  let cell = btn.parentElement;
  let body = {"id": cell.id };
  deleteNote(body);
  noteTable.deleteRow(cell.parentElement.rowIndex);
}

delButtons.forEach((btn) => {
  btn.onclick = () => { del(btn) }
});


notes.forEach((note) => {
  note.addEventListener('mousedown', makeEditable);
});


addButton.onclick = (event) => {
  let body = { "text": "Заметка" };
  insertNote(body);
};  


function deleteNote(body){
  fetch("/profile/notes/delete", {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body)
  }).then(() => {});
}


function updateNote(body){
  fetch("/profile/notes/update", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body)
  }).then(() => {})
}

function insertNote(body){
  fetch("/profile/notes/insert", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body)
  }).then(() => {
    window.location.reload();
  });
}