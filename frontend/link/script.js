'use strict'

const hamburger = document.querySelector(".hamburger");
const navBar = document.querySelector('.navBar');
const tm = document.querySelector('.tm');
const closeBtn = document.querySelector('.close');

const showHideHamburger = function(){
    navBar.classList.toggle('hide');
    tm.classList.toggle('hide');
}

hamburger.addEventListener("click", showHideHamburger);
closeBtn.addEventListener('click', showHideHamburger);