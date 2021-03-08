const cantinaMusic = new Audio('static/sounds/cantina.mp3');
const $init = document.querySelector('#init');
const $menupoints = document.querySelector('.menu');
const $creators = document.getElementById('credits');

function menu(event) {
    if (event.keyCode === 13) {
        cantinaMusic.pause();

        const fun = new Audio('static/sounds/fun.mp3');
        fun.play();
            setTimeout(function () {
                $menupoints.classList.add('hidden');
                $creators.classList.add('hidden');
                window.location.href = 'game.html';
            }, 2000);
        }
}

function cantinaPlay() {
    cantinaMusic.play()
    $init.classList.add('hidden')
    $menupoints.classList.remove('hidden');
    $creators.classList.remove('hidden');
    $creators.style.display = 'initial';
    document.body.style.backgroundImage="url('static/images/img.png')";
}

$init.addEventListener('click', cantinaPlay);
cantinaMusic.addEventListener('ended', cantinaPlay, false);
window.addEventListener('keydown', menu);