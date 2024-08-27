const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    backgroundColor: '#000000',
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            debug: false
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

const game = new Phaser.Game(config);
let player;
let obstacles;
let score = 0;
let scoreText;
let gameOver = false;

function preload() {
    this.load.image('square', 'imagenes/nave.png');
    this.load.image('obstacle', 'imagenes/asteroide.png');
}

function create() {
    player = this.physics.add.image(400, 500, 'square').setDisplaySize(50, 50).setCollideWorldBounds(true);

    obstacles = this.physics.add.group({
        key: 'obstacle',
        repeat: 4,
        setXY: { x: Phaser.Math.Between(50, 750), y: Phaser.Math.Between(-200, -50), stepX: 200 }
    });

    obstacles.children.iterate(function (child) {
        child.setDisplaySize(75, 75);
        child.setVelocityY(Phaser.Math.Between(200, 400));
    });

    scoreText = this.add.text(16, 16, 'Score: 0', { fontSize: '32px', fill: '#ffffff' });

    this.input.on('pointermove', function (pointer) {
        player.x = pointer.x;
        player.y = pointer.y;
    });

    this.physics.add.collider(player, obstacles, hitObstacle, null, this);
}

function update() {
    if (gameOver) {
        return;
    }

    obstacles.children.iterate(function (child) {
        if (child.y > 600) {
            child.y = Phaser.Math.Between(-200, -50);
            child.x = Phaser.Math.Between(50, 750);
            score += 10;
            scoreText.setText('Score: ' + score);
        }
    });
}

function hitObstacle(player, obstacle) {
    this.physics.pause();
    player.setTint(0xff0000);
    gameOver = true;
    scoreText.setText('Game Over! Final Score: ' + score);
}
