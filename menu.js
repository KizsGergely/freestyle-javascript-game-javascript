const THEME = new Audio("static/sounds/theme.mp3")
const cantina = new Audio("static/sounds/cantina.mp3");
const $init = document.querySelector("#init");
const $crawl = document.querySelector(".star-wars");
const $menupoints = document.querySelector(".menu");
const $creators = document.getElementById('hide');

function menu(enter) {
    if (enter.keyCode === 13) {
        cantina.pause();
        if (!THEME.pause()) {
            $menupoints.style.display = "none";
            $creators.style.display = "none";
            $crawl.style.display = "flex";
            THEME.play();
            setTimeout(function () {
                window.location.href = "game.html";
            }, 18960);
        }
    }
}

function cantinaPlay() {
    cantina.play()
    $init.style.display = "none";
    $menupoints.style.display = "initial";
    $creators.style.display = "initial";
}

$init.addEventListener('click', cantinaPlay);
cantina.addEventListener("ended", cantinaPlay, false);
window.addEventListener("keydown", menu);