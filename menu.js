const THEME = new Audio('static/sounds/theme.mp3')
const cantina = new Audio('static/sounds/cantina.mp3');
const $init = document.querySelector('#init');
const $crawl = document.querySelector('.star-wars');
const $menupoints = document.querySelector('.menu');
const $creators = document.getElementById('hide');

function menu(event) {
    if (event.keyCode === 13) {
        cantina.pause();
        if (!THEME.pause()) {
            $menupoints.classList.add('hidden');
            $creators.classList.add('hidden');
            $crawl.classList.remove('hidden');
            $crawl.style.display = 'flex';
            THEME.play();
            setTimeout(function () {
                window.location.href = 'game.html';
            }, 18960);
        }
    }
}

function cantinaPlay() {
    cantina.play()
    $init.classList.add('hidden')
    $menupoints.classList.remove('hidden');
    $creators.classList.remove('hidden');
    $creators.style.display = 'initial';
}

$init.addEventListener('click', cantinaPlay);
cantina.addEventListener('ended', cantinaPlay, false);
window.addEventListener('keydown', menu);