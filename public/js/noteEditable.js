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

const buttons = document.querySelectorAll('.note');

buttons.forEach((currentTd) => {
  currentTd.addEventListener('mousedown', makeEditable)
});

window.addEventListener('mousedown', () => {
  buttons.forEach((currentTd) => {
      makeNonEditable(currentTd);
  });
});