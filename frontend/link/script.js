'use strict'

const hamburger = document.querySelector(".hamburger");
const navBar = document.querySelector('.navBar');
const tm = document.querySelector('.tm');
const closeBtn = document.querySelector('.close');

const showHamburger = function(){
    navBar.style.left = 0;
    navBar.style.transitionDuration = "400ms";
    navBar.style.opacity = 1;
    tm.style.left = "50px";
    tm.style.transitionDuration = "400ms";
    tm.style.opacity = 1;
}

const HideHamburger = function(){
    navBar.style.left = "100%";
    navBar.style.transitionDuration = "400ms";
    navBar.style.opacity = 0;
    tm.style.left = "100%";
    tm.style.transitionDuration = "400ms";
    tm.style.opacity = 0;
}

hamburger.addEventListener("click", showHamburger);
closeBtn.addEventListener('click', HideHamburger);