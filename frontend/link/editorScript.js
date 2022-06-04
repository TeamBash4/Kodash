'use strict'

const overlay = document.querySelector(".overlay");
const cross = document.querySelector(".cross");
const run = document.querySelector(".run");
const share = document.querySelector(".share");
const shareOverlay = document.querySelector(".shareOverlay");

const hideOverlay = function(){
    overlay.classList.toggle("hide");
}

run.addEventListener("click", hideOverlay);
cross.addEventListener("click", hideOverlay);

const sharelink = function(){
    shareOverlay.classList.toggle("desk-Hide");
}

share.addEventListener('click', sharelink);