function makeEditable(e) {
  var cell = e.target;
  if (cell.dataset.editing !== 'true') {
    cell.dataset.editing = true;
    var text = cell.innerHTML;
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
}

const noteTable = document.getElementById("note_table");
const _notes = document.querySelectorAll('.note');
const addButton = document.getElementById('add_note_btn');

_notes.forEach((note) => {
  note.addEventListener('mousedown', makeEditable);
});

addButton.onclick = (event) => {
  let row = noteTable.insertRow(-1);
  let c1 = row.insertCell(0);
  c1.classList.add("note");
  c1.innerText = "Заметка";
  row.addEventListener('mousedown', makeEditable);
};  