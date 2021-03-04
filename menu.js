function menu(enter) {
    const cantina = new Audio("static/sounds/cantina.mp3");
    if (enter.keyCode === 32) {
    cantina.play()
    }
    let $crawl = document.querySelector(".star-wars");
    let $menupoints = document.querySelector(".menu");
    let $creators = document.getElementById('hide');
    if (enter.keyCode === 13) {
        $menupoints.style.display="none";
        $creators.style.display="none";
        const audio = new Audio("static/sounds/theme.mp3")
        audio.play()
        $crawl.style.display="flex";
        setTimeout(function() {window.location.href = "http://localhost:63342/freestyle-javascript-game-javascript-KizsGergely/index.html";}, 18960);
    }
}

window.addEventListener("keydown", menu);

