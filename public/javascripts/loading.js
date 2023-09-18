function handleSubmit(loadingId, buttonClass) {
  const loadingEl = document.getElementById(loadingId);
  const buttonEl = document.querySelector(buttonClass);

  loadingEl.style.display = "block";
  buttonEl.disabled = true;
}

