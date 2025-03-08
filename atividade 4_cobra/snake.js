const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    backgroundColor: '#100c08', // cor marrom
    scene: {
        preload: preload,
        create: create,
        update: update
    },
    physics: {
        default: 'arcade',
        arcade: {
            debug: false
        }
    }
};

const game = new Phaser.Game(config);

// Variáveis
let snake;
let food;
let cursors;
let score = 0;
let scoreText;
let direction = 'right';
let newDirection = 'right';
let lastMoveTime = 0;
let moveInterval = 150;
let gameOverFlag = false;

function preload() {
    // Carregar as imagens da comida e corpo da cobra
    this.load.image('food', 'assets/food.png');
    this.load.image('body', 'assets/body.png');
}

// Função para gerar uma textura com cor
function generateTexture(scene, key, color) {
    const graphics = scene.add.graphics();
    graphics.fillStyle(color, 1);
    graphics.fillRect(0, 0, 20, 20); // Ajustar o tamanho da textura para 20x20 pixels
    graphics.generateTexture(key, 20, 20);
    graphics.destroy();
}

function create() {
    gameOverFlag = false;
    snake = this.physics.add.group();
    food = this.physics.add.image(Phaser.Math.Between(0, 39) * 20, Phaser.Math.Between(0, 29) * 20, 'food');
    food.displayWidth = 25;
    food.displayHeight = 25;
    scoreText = this.add.text(10, 10, 'Score: 0', { fontSize: '20px', fill: '#fff' });

    // Texturas para a cobra
    for (let i = 0; i < 3; i++) {
        snake.create(100 - i * 20, 100, 'body');
    }

    cursors = this.input.keyboard.createCursorKeys();
    
    // Referência para a função moveSnake
    this.moveSnake = moveSnake.bind(this);
}

function update(time) {
    if (gameOverFlag) return;
    
    if (time >= lastMoveTime + moveInterval) {
        lastMoveTime = time;
        this.moveSnake();
    }

    // Controles
    if (Phaser.Input.Keyboard.JustDown(cursors.left) && direction !== 'right') {
        newDirection = 'left';
    } else if (Phaser.Input.Keyboard.JustDown(cursors.right) && direction !== 'left') {
        newDirection = 'right';
    } else if (Phaser.Input.Keyboard.JustDown(cursors.up) && direction !== 'down') {
        newDirection = 'up';
    } else if (Phaser.Input.Keyboard.JustDown(cursors.down) && direction !== 'up') {
        newDirection = 'down';
    }
}

function moveSnake() {
    direction = newDirection;

    const head = snake.getChildren()[0];
    let newHead;

    // Criar a novo corpo da cobra
    if (direction === 'left') {
        newHead = snake.create(head.x - 20, head.y, 'body');
    } else if (direction === 'right') {
        newHead = snake.create(head.x + 20, head.y, 'body');
    } else if (direction === 'up') {
        newHead = snake.create(head.x, head.y - 20, 'body');
    } else if (direction === 'down') {
        newHead = snake.create(head.x, head.y + 20, 'body');
    }

    // Mover a cabeça para o início do grupo (para manter a lógica do corpo)
    snake.getChildren().unshift(snake.getChildren().pop());

    if (checkOverlap(newHead, food)) {
        score += 10;
        scoreText.setText('Score: ' + score);
        food.setPosition(Phaser.Math.Between(0, 39) * 20, Phaser.Math.Between(0, 29) * 20);
    } else {
        snake.getChildren()[snake.getChildren().length - 1].destroy();
    }

    // Checar colisão com as bordas da tela
    if (newHead.x < 0 || newHead.x >= config.width || newHead.y < 0 || newHead.y >= config.height || checkCollision(newHead)) {
        gameOverFlag = true;
        this.add.text(config.width / 2, config.height / 2, 'GAME OVER', { fontSize: '48px', fill: '#ff0000' }).setOrigin(0.5);
        this.add.text(config.width / 2, config.height / 2 + 60, 'Clique para reiniciar', { fontSize: '24px', fill: '#ffffff' }).setOrigin(0.5);
        
        this.input.once('pointerdown', function () {
            score = 0;
            direction = 'right';
            newDirection = 'right';
            this.scene.restart();
        }, this);
    }
}

// Função para checar se dois objetos estão sobrepostos
function checkOverlap(object1, object2) {
    return Math.abs(object1.x - object2.x) < 20 && Math.abs(object1.y - object2.y) < 20;
}

// Função para checar colisão com o próprio corpo
function checkCollision(newHead) {
    const body = snake.getChildren();
    for (let i = 1; i < body.length; i++) {
        if (newHead.x === body[i].x && newHead.y === body[i].y) {
            return true;
        }
    }
    return false;
}
