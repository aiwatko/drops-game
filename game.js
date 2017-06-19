console.log('boo');

// a key map of allowed keys
const allowedKeys = {
    37: 'left',
    38: 'up',
    39: 'right',
    40: 'down',
    65: 'a',
    66: 'b',
};

// the 'official' Konami Code sequence
const konamiCode = ['up', 'up', 'down', 'down', 'left', 'right', 'left', 'right', 'b', 'a'];

// a variable to remember the 'position' the user has reached so far.
let konamiCodePosition = 0;

function activateCheats() {
    console.log('boo');
    const canvas = document.createElement('canvas');
    canvas.id = 'game-canvas';
    canvas.width = 1224;
    canvas.height = 768;
    canvas.style.zIndex = 99999999;
    canvas.style.position = 'absolute';
    canvas.style.top = '0';
    canvas.style.background = 'rgba(255, 255, 255, .5)';
    const body = document.getElementsByTagName('body')[0];
    body.appendChild(canvas);


    const gameCanvas = document.getElementById('game-canvas');
    const ctx = gameCanvas.getContext('2d');
    const drops = [];
    const dropColor = '#45d4e1';
    const textColor = '#e5264d';
    const dropWidth = 25;
    const dropHeight = 35;
    const droppedHeight = 10;
    let destroyedDrops = 0;
    let stepInterval;
    let gameStarted = false;
    let waterHeight = gameCanvas.height - droppedHeight;

    function drawDrop() {
        ctx.beginPath();
        ctx.lineTo(0, 0);
        ctx.arc(0, 25, 12, -0.4, Math.PI * 1.15, false);
        ctx.lineTo(0, 0);
        ctx.fill();
        ctx.fillStyle = 'white';
        ctx.beginPath();
        ctx.arc(0, 25, 5, 0, 2 * Math.PI, false);
        ctx.fill();
    }

    function drawPauseButton() {
        ctx.fillStyle = 'black';
        ctx.fillRect((gameCanvas.width - 15) - 35, 5, 5, 20);
        ctx.fillRect((gameCanvas.width - (10 * 2.3)) - 35, 5, 5, 20);
    }

    function drawCloseButton() {
        ctx.fillStyle = 'black';
        ctx.save();
        ctx.translate(gameCanvas.width - 10, 4);
        ctx.rotate((45 * Math.PI) / 180);
        ctx.fillRect(0, 0, 5, 25);
        ctx.restore();

        ctx.save();
        ctx.translate(gameCanvas.width - 28, 8);
        ctx.rotate((315 * Math.PI) / 180);
        ctx.fillRect(0, 0, 5, 25);
        ctx.restore();
    }

    (function () {
        // resize the canvas to fill browser window dynamically
        // window.addEventListener('resize', resizeCanvas, false);
        function draw() {
            ctx.clearRect(0, 0, gameCanvas.width, gameCanvas.height);
            drawPauseButton();
            drawCloseButton();

            if (!gameStarted) {
                ctx.font = '55px sans-serif';
                ctx.fillStyle = textColor;
                ctx.fillText('Collect all the drops!', (gameCanvas.width / 2) - (ctx.measureText('Collect all the drops!').width / 2), gameCanvas.height / 2);
            }
            for (let i = 0; i < drops.length; i += 1) {
                ctx.fillStyle = drops[i].color;
                ctx.save();
                ctx.translate(drops[i].x, drops[i].y);
                ctx.scale(drops[i].scale, drops[i].scale);
                drawDrop();
                ctx.restore();
            }
            ctx.fillRect(0, waterHeight, gameCanvas.width, gameCanvas.height - waterHeight);
            window.requestAnimationFrame(draw);
        }

        function resizeCanvas() {
            gameCanvas.width = window.innerWidth;
            gameCanvas.height = window.innerHeight;
            waterHeight = window.innerHeight - droppedHeight;

            for (let i = (Math.random() * 5) + 10; i > 0; i -= 1) {
                drops.push({
                    x: Math.random() * (gameCanvas.width - dropWidth),
                    y: Math.random() * (gameCanvas.height - dropHeight),
                    scale: Math.random() + 1.5,
                    color: dropColor,
                });
            }

            draw();
        }
        resizeCanvas();
        window.requestAnimationFrame(draw);
    }());

    function step() {
        for (let i = 0; i < drops.length; i += 1) {
            if (drops[i].y >= waterHeight) {
                drops.splice(i, 1);
                i -= 1;
                waterHeight -= droppedHeight;
                drops.push({
                    x: Math.random() * (gameCanvas.width - dropWidth),
                    y: -dropHeight,
                    scale: Math.random() + 1.5,
                    color: dropColor,
                });
                if (waterHeight < 0) {
                    window.clearInterval(stepInterval);
                }
            } else {
                drops[i].y += 1;
            }
        }

        if (drops.length === 0) {
            window.clearInterval(stepInterval);
            stepInterval = false;
        }
    }
    setTimeout(() => {
        stepInterval = window.setInterval(step, 1000 / 70);
    gameStarted = true;
}, 3000);

    function destroyDrops(event) {
        const cX = event.clientX;
        const cY = event.clientY;

        const closeButtonX1 = gameCanvas.width - 5 - 20;
        const closeButtonX2 = gameCanvas.width - 5;
        const closeButtonY1 = 4;
        const closeButtonY2 = 8 + 25;
        if (closeButtonX1 <= cX && closeButtonX2 >= cX && closeButtonY1 <= cY && closeButtonY2 >= cY) {
            gameCanvas.style.display = 'none';
            window.clearInterval(stepInterval);
            stepInterval = false;
        }


        const pauseButtonX1 = (gameCanvas.width - (10 * 2.3)) - 35;
        const pauseButtonX2 = ((gameCanvas.width - 15) - 35) + 5;
        const pauseButtonY1 = 5;
        const pauseButtonY2 = 5 + 20;
        if (pauseButtonX1 <= cX && pauseButtonX2 >= cX && pauseButtonY1 <= cY && pauseButtonY2 >= cY) {
            if (stepInterval) {
                window.clearInterval(stepInterval);
                stepInterval = false;
            } else {
                stepInterval = window.setInterval(step, 1000 / 70);
            }
        }

        if (stepInterval) {
            for (let i = 0; i < drops.length; i += 1) {
                const dX1 = drops[i].x - ((dropWidth / 2) * drops[i].scale);
                const dX2 = drops[i].x + ((dropWidth / 2) * drops[i].scale);
                const dY1 = drops[i].y;
                const dY2 = drops[i].y + (dropHeight * drops[i].scale);

                if (dX1 <= cX && dX2 >= cX && dY1 <= cY && dY2 >= cY) {
                    drops.splice(i, 1);
                    i -= 1;
                    destroyedDrops += 1;
                    if (destroyedDrops <= 30) {
                        drops.push({
                            x: Math.random() * (gameCanvas.width - dropWidth),
                            y: -dropHeight,
                            scale: Math.random() + 1.5,
                            color: dropColor,
                        });
                    }
                }
            }
        }
    }

    gameCanvas.addEventListener('mousedown', destroyDrops);
}

// add keydown event listener
document.addEventListener('keydown', (e) => {
    // get the value of the key code from the key map
    const key = allowedKeys[e.keyCode];
// get the value of the required key from the konami code
const requiredKey = konamiCode[konamiCodePosition];

// compare the key with the required key
if (key === requiredKey) {
    // move to the next key in the konami code sequence
    konamiCodePosition += 1;

    // if the last key is reached, activate cheats
    if (konamiCodePosition === konamiCode.length) {
        activateCheats();
    }
} else {
    konamiCodePosition = 0;
}
});
