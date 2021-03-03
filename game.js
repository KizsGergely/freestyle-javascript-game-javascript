const KEY_CODE_LEFT = 37;
const KEY_CODE_RIGHT = 39;
const KEY_CODE_SPACE = 32;

const GAME_WIDTH = document.querySelector(".game").clientWidth;
const GAME_HEIGHT = document.querySelector(".game").clientHeight;

const PLAYER_WIDTH = 30;
const PLAYER_MAX_SPEED = 730;
const LASER_MAX_SPEED = 700.0;
const LASER_COOLDOWN = 0.5;

const ENEMIES_PER_ROW = 4;
const ENEMIES_ROW_NUMBER = 2;
const ENEMY_HORIZONTAL_PADDING = 100;
const ENEMY_VERTICAL_PADDING = 80;
const ENEMY_VERTICAL_SPACING = 80;


const GAME_STATE = {
    lastTime: Date.now(),
    leftPressed: false,
    rightPressed: false,
    spacePressed: false,
    playerX: 0,
    playerY: 0,
    playerCooldown: 0,
    lasers: [],
    enemies: []
};

function setPosition($el, x, y) {
    {
        $el.style.transform = `translate(${x}px, ${y}px)`;
    }
}

function widthLimit(x, min, max) {
    if (x < min) {
        return min
    } else if (x > max) {
        return max
    } else {
        return x
    }
}

function createPlayer($container) {
    GAME_STATE.playerX = GAME_WIDTH / 2;
    GAME_STATE.playerY = GAME_HEIGHT - 100;
    const $player = document.createElement("img");
    $player.src = "static/images/x.png";
    $player.className = "player";
    $container.appendChild($player);
    setPosition($player, GAME_STATE.playerX, GAME_STATE.playerY);
}

function createEnemy($container, x, y) {
    const $element = document.createElement("img");
    $element.src = "static/images/enemy-blue-1.png";
    $element.className = "enemy";
    $container.appendChild($element);
    const enemy = {
        x,
        y,
        $element
    };
    GAME_STATE.enemies.push(enemy);
    setPosition($element, x, y);
}
function initGame() {
    const $container = document.querySelector(".game");
    createPlayer($container);


    const enemySpacing =  (GAME_WIDTH - ENEMY_HORIZONTAL_PADDING * 2) / (ENEMIES_PER_ROW - 1);
    for (let j = 0; j < ENEMIES_ROW_NUMBER; j++) {
        let y = ENEMY_VERTICAL_PADDING + j * ENEMY_VERTICAL_SPACING;
    for (let i = 0; i < ENEMIES_PER_ROW; i++) {
        let x = i * enemySpacing + ENEMY_HORIZONTAL_PADDING;
        createEnemy($container, x, y);
    }
  }
}

function updatePlayer(dt, $container) {
    if (GAME_STATE.leftPressed) {
    GAME_STATE.playerX -= dt * PLAYER_MAX_SPEED;
    }
    if (GAME_STATE.rightPressed) {
    GAME_STATE.playerX += dt * PLAYER_MAX_SPEED;
    }

    GAME_STATE.playerX = widthLimit(GAME_STATE.playerX, PLAYER_WIDTH, GAME_WIDTH - PLAYER_WIDTH);

    if (GAME_STATE.spacePressed && GAME_STATE.playerCooldown <= 0) {
    createLaser($container, GAME_STATE.playerX, GAME_STATE.playerY, "left");
    createLaser($container, GAME_STATE.playerX, GAME_STATE.playerY, "right");
    GAME_STATE.playerCooldown = LASER_COOLDOWN;
    }
    if (GAME_STATE.playerCooldown > 0) {
    GAME_STATE.playerCooldown -= dt;
    }
    const $player = document.querySelector(".player");
    setPosition($player, GAME_STATE.playerX, GAME_STATE.playerY);
}

function createLaser($container, x, y, side) {
    (side === "left") ? x -= PLAYER_WIDTH : (side === "right") ? x+= PLAYER_WIDTH : x===x;
    const $element = document.createElement("img");
    $element.src = "/static/images/laserRed.png";
    $element.className = "laser";
    $container.appendChild($element);
    const laser = { x, y, $element };
    GAME_STATE.lasers.push(laser);
    const audio = new Audio("static/sound/XWingFire.mp3");
    audio.play();
    setPosition($element, x, y);
}

function updateLasers(dt, $container) {
  const lasers = GAME_STATE.lasers;
  for (let i = 0; i < lasers.length; i++) {
    const laser = lasers[i];
    laser.y -= dt * LASER_MAX_SPEED;
    if (laser.y < 0) {
        removeLaser($container, laser);
    }
    setPosition(laser.$element, laser.x, laser.y);
  }
  GAME_STATE.lasers = GAME_STATE.lasers.filter(e => !e.isRemoved);
}

function removeLaser($container, laser) {
    $container.removeChild(laser.$element);
    laser.isRemoved = true;
}

function update(e) {
    const currentTime = Date.now();
    const dt = (currentTime - GAME_STATE.lastTime) / 1000;

    const $container = document.querySelector(".game");
    updatePlayer(dt, $container);
    updateLasers(dt, $container);

    GAME_STATE.lastTime = currentTime;
    window.requestAnimationFrame(update);
}

function onKeyDown(e) {
    if (e.keyCode === KEY_CODE_LEFT) {
        GAME_STATE.leftPressed = true;
    } else if (e.keyCode === KEY_CODE_RIGHT) {
        GAME_STATE.rightPressed = true;
    } else if (e.keyCode === KEY_CODE_SPACE) {
        GAME_STATE.spacePressed = true;
    }
}

function onKeyUp(e) {
    if (e.keyCode === KEY_CODE_LEFT) {
        GAME_STATE.leftPressed = false;
    } else if (e.keyCode === KEY_CODE_RIGHT) {
        GAME_STATE.rightPressed = false;
    } else if (e.keyCode === KEY_CODE_SPACE) {
        GAME_STATE.spacePressed = false;
    }
}

initGame();
window.addEventListener("keydown", onKeyDown);
window.addEventListener("keyup", onKeyUp);
window.requestAnimationFrame(update);