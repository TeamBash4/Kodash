'use strict'

const overlay = document.querySelector(".overlay");
const cross = document.querySelector(".cross");
const run = document.querySelector(".run");

const hideOverlay = function(){
    overlay.classList.toggle("hide");
}


run.addEventListener("click", hideOverlay);
cross.addEventListener("click", hideOverlay);