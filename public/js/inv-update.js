const form = document.querySelector("#updateForm");
console.log("HERE!");
form.addEventListener("change", function () {
  const updateBtn = document.querySelector("button");
  updateBtn.removeAttribute("disabled");
});
