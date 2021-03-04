function onKeyDown(space) {
    let $crawl = document.querySelector(".star-wars");
    let $menupoints = document.querySelector(".menu");
    let $creators = document.getElementById('hide');
    if (space.keyCode === 32) {
        $menupoints.style.display="none";
        $creators.style.display="none";
        $crawl.style.display="flex";
    }
    let $lastp = document.getElementById("lastp");
    if ($lastp.style.position === '0'); {

    }
}

window.addEventListener("keydown", onKeyDown);