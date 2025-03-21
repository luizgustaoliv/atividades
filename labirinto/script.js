class MenuScene extends Phaser.Scene {
    constructor() {
        super("MenuScene");
    }

    preload() {
        this.load.image('startButton', 'assets/start.png');
        this.load.image('backgroundMenu', 'assets/background_menu.png');
    }

    create() {
        this.add.image(400, 300, 'backgroundMenu');
        this.add.text(250, 100, "Jogo do Labirinto", { fontSize: "48px", fill: "#fff" });
        let startButton = this.add.image(400, 400, 'startButton').setInteractive();
        startButton.on('pointerdown', () => {
            this.scene.start('GameScene');
        });
    }
}

class GameScene extends Phaser.Scene {
    constructor() {
        super("GameScene");
        this.score = 0;
        this.hasKey = false;
    }

    preload() {
        this.load.image('player', 'assets/player.png');
        this.load.image('key', 'assets/key.png');
        this.load.image('enemy', 'assets/enemy.png');
        this.load.image('door', 'assets/door.png');
        this.load.image('tiles', 'assets/tileset.png');
        this.load.tilemapTiledJSON('map', 'assets/map.json');
        this.load.image('backgroundGame', 'assets/background_game.png');
    }

    create() {
        this.add.image(400, 300, 'backgroundGame');
        const map = this.make.tilemap({ key: "map" });
        const tileset = map.addTilesetImage("tileset", "tiles");
        map.createLayer("Ground", tileset, 0, 0);
        
        this.player = this.physics.add.sprite(100, 100, 'player');
        this.player.setCollideWorldBounds(true);
        this.player.setBounce(0.2);
        
        this.spawnKey();
        this.door = this.physics.add.sprite(500, 200, 'door');
        this.physics.add.overlap(this.player, this.door, this.enterDoor, null, this);
        
        this.enemy = this.physics.add.sprite(400, 200, 'enemy');
        this.enemy.setVelocity(-100, -100);
        this.enemy.setBounce(1, 1);
        this.enemy.setCollideWorldBounds(true);

        this.scoreText = this.add.text(16, 16, 'Placar: 0', { fontSize: '32px', fill: '#fff' });

        this.physics.add.overlap(this.player, this.keyItem, this.collectKey, null, this);
        this.physics.add.overlap(this.player, this.enemy, () => {
            this.scene.start('GameOverScene');
        });

        this.cursors = this.input.keyboard.createCursorKeys();
    }

    update() {
        this.player.setVelocity(0);

        if (this.cursors.left.isDown) {
            this.player.setVelocityX(-160);
        } else if (this.cursors.right.isDown) {
            this.player.setVelocityX(160);
        }

        if (this.cursors.up.isDown) {
            this.player.setVelocityY(-160);
        } else if (this.cursors.down.isDown) {
            this.player.setVelocityY(160);
        }
    }

    spawnKey() {
        if (this.keyItem) {
            this.keyItem.destroy();
        }
        let x = Phaser.Math.Between(50, 750);
        let y = Phaser.Math.Between(50, 550);
        this.keyItem = this.physics.add.sprite(x, y, 'key');
        this.physics.add.overlap(this.player, this.keyItem, this.collectKey, null, this);
        this.hasKey = false;
    }

    collectKey(player, key) {
        this.score += 10;
        this.scoreText.setText('Placar: ' + this.score);
        key.destroy();
        this.hasKey = true;
    }

    enterDoor(player, door) {
        if (this.hasKey) {
            this.scene.start('GameScene2');
        }
    }
}

class GameScene2 extends Phaser.Scene {
    constructor() {
        super("GameScene2");
        this.score = 0;
        this.hasKey = false;
    }
    preload() {
        this.load.image('player', 'assets/player.png');
        this.load.image('key', 'assets/key.png');
        this.load.image('enemy', 'assets/enemy.png');
        this.load.image('door', 'assets/door.png');
        this.load.image('tiles2', 'assets/tileset.png');
        this.load.tilemapTiledJSON('map2', 'assets/map.json');
        this.load.image('backgroundGame2', 'assets/background_game2.png');
    }

    create() {
        this.add.image(400, 300, 'backgroundGame2');
        const map = this.make.tilemap({ key: "map2" });
        const tileset = map.addTilesetImage("tileset", "tiles2");
        map.createLayer("Tile Layer 1", tileset, 0, 0);

        this.player = this.physics.add.sprite(100, 100, 'player');
        this.player.setSize(20, 20);
        this.player.setCollideWorldBounds(true);
        this.player.setBounce(0.2);
        
        this.spawnKey();
        this.door = this.physics.add.sprite(750, 540, 'door');
        this.physics.add.overlap(this.player, this.door, this.enterDoor, null, this);
        
        this.enemies = this.physics.add.group();
        this.createEnemies();

        this.scoreText = this.add.text(16, 16, 'Placar: 0', { fontSize: '32px', fill: '#fff' });

        this.physics.add.overlap(this.player, this.keyItem, this.collectKey, null, this);
        this.physics.add.overlap(this.player, this.enemies, this.hitEnemy, null, this);

        this.cursors = this.input.keyboard.createCursorKeys();
    }

    update() {
        this.player.setVelocity(0);

        if (this.cursors.left.isDown) {
            this.player.setVelocityX(-200);
        } else if (this.cursors.right.isDown) {
            this.player.setVelocityX(200);
        }

        if (this.cursors.up.isDown) {
            this.player.setVelocityY(-200);
        } else if (this.cursors.down.isDown) {
            this.player.setVelocityY(200);
        }
    }

    spawnKey() {
        if (this.keyItem) {
            this.keyItem.destroy();
        }
        let x = Phaser.Math.Between(50, 750);
        let y = Phaser.Math.Between(50, 550);
        this.keyItem = this.physics.add.sprite(x, y, 'key');
        this.physics.add.overlap(this.player, this.keyItem, this.collectKey, null, this);
        this.hasKey = false;
    }

    collectKey(player, key) {
        this.score += 10;
        this.scoreText.setText('Placar: ' + this.score);
        key.destroy();
        this.hasKey = true;
    }

    enterDoor(player, door) {
        if (this.hasKey) {
            this.scene.start('WinScene');
        }
    }

    createEnemies() { // Cria vários inimigos em posições e direçôes diferentes 
        const enemyPositions = [
            { x: 400, y: 200, vx: 150, vy: 150 },
            { x: 300, y: 500, vx: 150, vy: 150 },
            { x: 400, y: 600, vx: 150, vy: 150 },
            { x: 400, y: 200, vx: 150, vy: 150 },
            { x: 100, y: 200, vx: 150, vy: 150 },
            { x: 700, y: 200, vx: 150, vy: -150 },
            { x: 400, y: 200, vx: 150, vy: -150 },
            { x: 500, y: 50, vx: 150, vy: -150 },
            { x: 750, y: 250, vx: 150, vy: -150 },
            { x: 600, y: 200, vx: -150, vy: 150 },
            { x: 700, y: 350, vx: -150, vy: 150 },
            { x: 300, y: 250, vx: -150, vy: 150 },
            { x: 400, y: 600, vx: -150, vy: 150 },
            { x: 400, y: 200, vx: -150, vy: 150 },
            { x: 100, y: 500, vx: 150, vy: 150 },
            { x: 700, y: 250, vx: -150, vy: -150 },
            { x: 400, y: 200, vx: -150, vy: -150 },
            { x: 500, y: 400, vx: -150, vy: -150 },
            { x: 450, y: 250, vx: -150, vy: -150 },
            { x: 600, y: 600, vx: -150, vy: -150 },
            { x: 150, y: 350, vx: -150, vy: -150 }
        ];

        enemyPositions.forEach(pos => {
            let enemy = this.enemies.create(pos.x, pos.y, 'enemy');
            enemy.setVelocity(pos.vx, pos.vy);
            enemy.setBounce(1, 1);
            enemy.setCollideWorldBounds(true);
        });
    }
    hitEnemy(player, enemy) {
        this.scene.start('GameOverScene');
    }
}

class GameOverScene extends Phaser.Scene {
    constructor() {
        super("GameOverScene");
    }

    preload() {
        this.load.image('backgroundGameOver', 'assets/background_gameover.png');
    }

    create() {
        this.add.image(400, 300, 'backgroundGameOver');
        this.add.text(300, 100, "Game Over", { fontSize: "48px", fill: "#f00" });
        this.input.on('pointerdown', () => {
            this.scene.start('MenuScene');
        });
    }
}

class WinScene extends Phaser.Scene {
    constructor() {
        super("WinScene");
    }

    preload() {
        this.load.image('backgroundWin', 'assets/background_win.png');
    }

    create() {
        this.add.image(400, 300, 'backgroundWin');
        this.add.text(300, 100, "Você Ganhou!", { fontSize: "48px", fill: "#0f0" });
        this.input.on('pointerdown', () => {
            this.scene.start('MenuScene');
        });
    }
}

const config = {
    type: Phaser.AUTO,
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        width: 800,
        height: 600,
    },
    physics: { default: 'arcade', arcade: { debug: false } },
    scene: [MenuScene, GameScene, GameScene2, GameOverScene, WinScene]
};

const game = new Phaser.Game(config);