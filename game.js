const KEY_CODE_LEFT = 37;
const KEY_CODE_RIGHT = 39;
const KEY_CODE_SPACE = 32;

const GAME_WIDTH = document.querySelector(".game").clientWidth;
const GAME_HEIGHT = document.querySelector(".game").clientHeight;

const PLAYER_WIDTH = 30;
const PLAYER_MAX_SPEED = 800;
const LASER_MAX_SPEED = 700.0;
const LASER_COOLDOWN = 0.5;

const ENEMIES_PER_ROW = 4;
const ENEMIES_ROW_NUMBER = 2;
const ENEMY_HORIZONTAL_PADDING = 100;
const ENEMY_VERTICAL_PADDING = 80;
const ENEMY_VERTICAL_SPACING = 80;
const ENEMY_COOLDOWN = 5.0;


const GAME_STATE = {
    lastTime: Date.now(),
    leftPressed: false,
    rightPressed: false,
    spacePressed: false,
    playerX: 0,
    playerY: 0,
    playerCooldown: 0,
    lasers: [],
    enemies: [],
    enemyLasers: [],
    gameOver : false
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

function rand(min, max) {
  if (min === undefined) min = 0;
  if (max === undefined) max = 1;
  return min + Math.random() * (max - min);
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

function destroyPlayer($container, player) {
  $container.removeChild(player);
  GAME_STATE.gameOver = true;
  const audio = new Audio("static/sounds/XWingExplode.mp3");
  audio.play();
  const hateYou = new Audio("static/sounds/hateyou.mp3");
  setTimeout(function(){hateYou.play()}, 2000);
}

function createEnemy($container, x, y) {
    const $element = document.createElement("img");
    $element.src = "static/images/tie.png";
    $element.className = "enemy";
    $container.appendChild($element);
    const enemy = {
        x,
        y,
        cooldown: rand(0.5, ENEMY_COOLDOWN),
        $element
    };
    GAME_STATE.enemies.push(enemy);
    setPosition($element, x, y);
}

function updateEnemies(dt, $container) {
    const dx = Math.sin(GAME_STATE.lastTime / 1000.0) * 50;
    const dy = Math.cos(GAME_STATE.lastTime / 1000.0) * 10;

    const enemies = GAME_STATE.enemies;
    for (let i=0; i<enemies.length; i++) {
        const enemy = enemies[i];
        const x = enemy.x + dx;
        const y = enemy.y + dy;
        setPosition(enemy.$element, x, y);
        enemy.cooldown -= dt;
        if (enemy.cooldown <= 0) {
            createEnemyLaser($container, x, y);
            enemy.cooldown = ENEMY_COOLDOWN;
        }
    }
    GAME_STATE.enemies = GAME_STATE.enemies.filter(e => !e.isDead);

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
    $element.src = "static/images/laserRed.png";
    $element.className = "laser";
    $container.appendChild($element);
    const laser = { x, y, $element };
    GAME_STATE.lasers.push(laser);
    const audio = new Audio("static/sounds/XWingFire.mp3");
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
    const laserBeam = laser.$element.getBoundingClientRect();
    const enemies = GAME_STATE.enemies;
    for (let i=0; i<enemies.length; i++) {
        const enemy = enemies[i];
        if (enemy.isDead) continue;
        const target = enemy.$element.getBoundingClientRect();
        if (laserHit(laserBeam, target)) {
            destroyEnemy($container, enemy);
            removeLaser($container, laser);
            break;
        }
    }
  }
  GAME_STATE.lasers = GAME_STATE.lasers.filter(e => !e.isRemoved);
}

function removeLaser($container, laser) {
    $container.removeChild(laser.$element);
    laser.isRemoved = true;
}

function createEnemyLaser($container, x, y) {
  const $element = document.createElement("img");
  $element.src = "static/images/laserGreen.png";
  $element.className = "enemy-laser";
  $container.appendChild($element);
  const laser = { x, y, $element };
  GAME_STATE.enemyLasers.push(laser);
  const audio = new Audio("static/sounds/tieFire.mp3");
  audio.play();
  setPosition($element, x, y);
}

function updateEnemyLasers(dt, $container) {
    const lasers = GAME_STATE.enemyLasers;
    for (let i = 0; i < lasers.length; i++) {
        const laser = lasers[i];
        laser.y += dt * LASER_MAX_SPEED;
        if (laser.y > GAME_HEIGHT - 30) {
            removeLaser($container, laser);
        }
        setPosition(laser.$element, laser.x, laser.y);
            const laserbeam = laser.$element.getBoundingClientRect();
            const player = document.querySelector(".player");
            const target = player.getBoundingClientRect();
            if (laserHit(laserbeam, target)) {
            destroyPlayer($container, player);
            removeLaser($container, laser);
            break;
    }
    }
    GAME_STATE.enemyLasers = GAME_STATE.enemyLasers.filter(e => !e.isRemoved);
}


function destroyEnemy($container, enemy) {
    enemy.$element.src = "static/images/explosion.png";
    const audio = new Audio("static/sounds/tieExplode.mp3");
    audio.play();
    setTimeout(function() {$container.removeChild(enemy.$element);}, 100);
    enemy.isDead = true;
}

function laserHit(laser, target) {
    return !(
        laser.right < target.left || laser.left > target.right ||
        laser.bottom < target.top || laser.top > target.bottom
    );
}

function hasWon() {
    return GAME_STATE.enemies.length === 0;
}

function update(e) {
    const currentTime = Date.now();
    const dt = (currentTime - GAME_STATE.lastTime) / 1000.0;

    if (GAME_STATE.gameOver) {
        document.querySelector(".game-over").style.display = "block";
        return;
    }
    if (hasWon()) {
        const won = new Audio("static/sounds/won.mp3");
        setTimeout(function() {won.play();}, 3000);
        document.querySelector(".congratulations").style.display = "block";
        return;
    }
    const $container = document.querySelector(".game");
    updatePlayer(dt, $container);
    updateLasers(dt, $container);
    updateEnemies(dt, $container);
    updateEnemyLasers(dt, $container);

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