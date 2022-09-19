export const speakerFunction = (txt:string) => {
  const el = document.createElement("p");
  const id = "speak-" + Date.now();
  el.setAttribute("id", id);
  el.setAttribute("aria-live", "assertive");
  document.body.appendChild(el);
  el.style.maxHeight = "0"; 
  
  window.setTimeout(function () {
    document.getElementById(id).innerHTML = txt;
  }, 100);

  window.setTimeout(function () {
      document.body.removeChild(document.getElementById(id));
  }, 3000);
};
