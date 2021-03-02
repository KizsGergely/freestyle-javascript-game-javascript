const GAME_WIDTH = 1366;
const GAME_HEIGHT = 1024;

const GAME_STATE = {
    playerX: 0,
    playerY: 0,
};

function setPosition($el, x, y) {
    $el.style.transform = `translate(${x}px, ${y}px)`;
}

function createPlayer($container) {
    GAME_STATE.playerX = GAME_WIDTH / 2 - 55;
    GAME_STATE.playerY = GAME_HEIGHT - 265;
    const $player = document.createElement("img");
    $player.src = "static/images/x.png";
    $player.className = "player";
    $container.appendChild($player);
    setPosition($player, GAME_STATE.playerX, GAME_STATE.playerY);
}

function initGame() {
    const $container = document.querySelector(".game");
    createPlayer($container);


}

initGame();