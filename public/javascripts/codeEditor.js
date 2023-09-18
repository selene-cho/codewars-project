const codeEditorEl = document.getElementById("codeEditor");
const initialCode = codeEditorEl.getAttribute("data-initial-code");
const problemId = codeEditorEl.getAttribute("data-problem-id");
const solutionInputEl = document.getElementById("hiddenSolution");

const editorContentKey = `editorContent_${problemId}`;
const editorContent = sessionStorage.getItem(editorContentKey);

const editor = CodeMirror.fromTextArea(codeEditorEl, {
  lineNumbers: true,
  lineWrapping: true,
  styleActiveLine: true,
  matchBrackets: true,
  autofocus: true,
  tabSize: 2,
});

if (editorContent) {
  editor.setValue(editorContent);
} else {
  editor.setValue(initialCode);
}

editor.on("change", () => {
  sessionStorage.setItem(editorContentKey, editor.getValue());
});

document.querySelector("#form").addEventListener("submit", function (e) {
  e.preventDefault();

  handleSubmit('loading-grading', '.problemsButton.buttonRight');

  const solution = editor.getValue();
  solutionInputEl.value = solution;
  this.submit();
});

function clearCode() {
  sessionStorage.removeItem(editorContentKey);
  editor.setValue(initialCode);
}
