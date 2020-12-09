const urlParams = new URLSearchParams(window.location.search);
const gameTitleInput = document.getElementById("gameTitle");
const bgImageInput = document.getElementById("bgImage");
const playerImageInput = document.getElementById("playerImage");
const enemyImageInput = document.getElementById("enemyImage");
const pointImageInput = document.getElementById("pointImage");
const playerSpeedInput = document.getElementById("playerSpeed");
const playerWidthInput = document.getElementById("playerWidth");
const playerHeightInput = document.getElementById("playerHeight");
const pointWidthInput = document.getElementById("pointWidth");
const pointHeightInput = document.getElementById("pointHeight");
const enemyWidthInput = document.getElementById("enemyWidth");
const enemyHeightInput = document.getElementById("enemyHeight");

const config = {
    pointSpawnInterval: 2500,
    addEnemyInterval: 2000,
    respawnEnemiesInterval: 500,
    type: Phaser.AUTO,
    parent: "game-container",
    width: 960,
    height: 640,
    physics: {
        default: "arcade",
        arcade: {
            gravity: { y: 300 },
            debug: false,
        },
    },
    scene: {
        preload,
        create,
        update,
    },
};

const game = new Phaser.Game(config);
let gameScene;
let cursors;
let player;
let point;
let enemies;
let gameOver;
let score = 0;
let scoreText;

function preload() {
    renderParamsInInspector();
    document.getElementById("js-game-title").innerHTML = gameTitleInput.value;
    document.title = `${gameTitleInput.value} - a game created using Asset Flipper Arcade`;
    this.load.image("bg", bgImageInput.value);
    this.load.image("player", playerImageInput.value);
    this.load.image("point", pointImageInput.value);
    this.load.image("enemy", enemyImageInput.value);
}

function renderParamsInInspector() {
    gameTitleInput.value = urlParams.get("gameTitle") || "Thirsty Viking!"
    bgImageInput.value = urlParams.get("bgImage") || "https://i.ibb.co/pLsmfxn/airadventurelevel4.png";
    playerImageInput.value = urlParams.get("playerImage") || "https://i.imgur.com/hFQ9U0U.png";
    pointImageInput.value = urlParams.get("pointImage") || "https://i.imgur.com/aRFc6nu.png";
    enemyImageInput.value = urlParams.get("enemyImage") || "https://i.ibb.co/0nDF55T/spike.png";
    playerSpeedInput.value = urlParams.get("playerSpeed") || 600;
    playerWidthInput.value = urlParams.get("playerWidth") || 70;
    playerHeightInput.value = urlParams.get("playerHeight") || 70;
    pointWidthInput.value = urlParams.get("pointWidth") || 40;
    pointHeightInput.value = urlParams.get("pointHeight") || 40;
    enemyWidthInput.value = urlParams.get("enemyWidth") || 50;
    enemyHeightInput.value = urlParams.get("enemyHeight") || 50;
}

function create() {
    gameScene = this;
    cursors = this.input.keyboard.createCursorKeys();

    const bgImage = this.add.image(
        config.width / 2,
        config.height / 2,
        "bg"
    );
    bgImage.displayWidth = config.width;
    bgImage.displayHeight = config.height;

    player = this.physics.add.sprite(
        config.width / 2,
        config.height - 50,
        "player"
    );
    player.displayWidth = playerWidthInput.value;
    player.displayHeight = playerHeightInput.value;
    player.setCollideWorldBounds(true);

    enemies = this.physics.add.group();

    point = this.physics.add.sprite(100, 1000, "point");
    point.displayWidth = pointWidthInput.value;
    point.displayHeight = pointHeightInput.value;

    this.time.addEvent({
        delay: config.pointSpawnInterval,
        loop: true,
        callback: spawnPoint,
        callbackScope: this,
    });

    this.time.addEvent({
        delay: config.addEnemyInterval,
        loop: true,
        callback: addEnemy,
        callbackScope: this,
    });

    this.time.addEvent({
        delay: config.respawnEnemiesInterval,
        loop: true,
        callback: respawnEnemies,
        callbackScope: this,
    });

    this.physics.add.collider(player, enemies, hitEnemy, null, this);
    this.physics.add.overlap(player, point, scorePoint, null, this);

    scoreText = this.add.text(16, 16, "0", {
        fontSize: "32px",
        fill: "#fff",
    });
}

function update(time, delta) {
    if (gameOver) {
        return;
    }

    if (cursors.left.isDown) {
        player.setVelocityX(-playerSpeedInput.value);
    } else if (cursors.right.isDown) {
        player.setVelocityX(+playerSpeedInput.value);
    } else {
        player.setVelocityX(0);
    }
}

function spawnPoint() {
    point.setY(-100);
    point.setX(Phaser.Math.RND.between(0, config.width));
    point.setVelocityY(0);
}

function hitEnemy() {
    this.physics.pause();
    player.setTint(0xff0000);
    gameOver = true;
}

function scorePoint() {
    score += 1;
    scoreText.setText(score);
    point.setY(1000);
}

function respawnEnemies() {
    enemies.children.iterate(function (child) {
        if (child.y > config.height) {
            child.setY(
                Phaser.Math.RND.between(-enemyHeightInput.value, (+enemyHeightInput.value) * 10)
            );
            child.setX(Phaser.Math.RND.between(0, config.width));
            child.setVelocityY(0);
        }
    });
}

function addEnemy() {
    const enemy = enemies.create(
        Phaser.Math.RND.between(0, config.width),
        -100,
        "enemy"
    );
    enemy.displayWidth = enemyWidthInput.value;
    enemy.displayHeight = enemyHeightInput.value;
    enemy.setVelocityY(0);
}

function build() {
    window.location = `/?gameTitle=${gameTitleInput.value}&bgImage=${bgImageInput.value}` + 
    `&playerImage=${playerImageInput.value}&enemyImage=${enemyImageInput.value}&pointImage=${pointImageInput.value}` +
    `&playerSpeed=${playerSpeedInput.value}` +
    `&playerWidth=${playerWidthInput.value}` +
    `&playerHeight=${playerHeightInput.value}` +
    `&pointWidth=${pointWidthInput.value}` +
    `&pointHeight=${pointHeightInput.value}` +
    `&enemyWidth=${enemyWidthInput.value}` +
    `&enemyHeight=${enemyHeightInput.value}`;
}