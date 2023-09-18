document.addEventListener("DOMContentLoaded", function () {
  const tabEls = document.querySelectorAll(".tabs li");
  const problemEls = document.querySelectorAll(".problems li");

  function setActiveProblems(level) {
    problemEls.forEach(problem => {
      problem.classList.remove("active");
    });

    if (level === "all") {
      problemEls.forEach(problem => {
        problem.classList.add("active");
      });
    } else {
      const selectedProblemEls = document.querySelectorAll(
        `.problems li[data-level="${level}"]`
      );
      selectedProblemEls.forEach(problem => {
        problem.classList.add("active");
      });
    }
  }

  problemEls.forEach(problem => {
    problem.classList.add("active");
  });

  tabEls.forEach(tab => {
    tab.addEventListener("click", function() {
      const selectedLevel = this.getAttribute("data-level");
      setActiveProblems(selectedLevel);
    });
  });
});
