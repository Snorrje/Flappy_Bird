let cvs = document.getElementById("canvas");
let ctx = cvs.getContext("2d");
let startBtn = document.getElementById("startBtn");

// Loader bilder
let bird = new Image();
let bg = new Image();
let fg = new Image();
let pipeNorth = new Image();
let pipeSouth = new Image();

bird.src = "bilder/bird.png";
bg.src = "bilder/bg.jpg";
fg.src = "bilder/fg.png";
pipeNorth.src = "bilder/pipeNorth.png";
pipeSouth.src = "bilder/pipeSouth.png";

// Variabler
let gap = 103;
let constant;

let bX, bY, gravity, lift, velocity, score, fgHeight, pipe;
let animationId;
let gameStarted = false;

// Initialiserer variabler
function initializeVariables() {
    bX = 10;
    bY = 150;
    gravity = 0.20;
    lift = -4.5;
    velocity = 0;
    score = 0;
    fgHeight = 80;

    pipe = [];
    pipe[0] = {
        x: cvs.width,
        y: 0
    };
}

// Trykker på space
document.addEventListener("keydown", moveUp);

function moveUp() {
    if (gameStarted) {
        velocity = lift;
    }
}

// Pipe koordinater
function draw() {
    ctx.drawImage(bg, 0, 0);

    for (let i = 0; i < pipe.length; i++) {
        constant = pipeNorth.height + gap;
        ctx.drawImage(pipeNorth, pipe[i].x, pipe[i].y);
        ctx.drawImage(pipeSouth, pipe[i].x, pipe[i].y + constant);

        pipe[i].x -= 2;

        if (pipe[i].x == 450) {
            pipe.push({
                x: cvs.width,
                y: Math.floor(Math.random() * pipeNorth.height) - pipeNorth.height
            });
        }

        // Sjekker etter kollisjon
        if (bX + bird.width >= pipe[i].x && bX <= pipe[i].x + pipeNorth.width &&
            (bY <= pipe[i].y + pipeNorth.height || bY + bird.height >= pipe[i].y + constant) || bY + bird.height >= cvs.height - fgHeight) {
            cancelAnimationFrame(animationId); // Fryser spillet
            startBtn.textContent = "Restart Game"; // Endrer knappttekst
            startBtn.style.display = "block"; // Viser startknappen igjen
            gameStarted = false; // Setter spillet som stoppet
            return;
        }

        if (pipe[i].x + pipeNorth.width == bX) {
            score++;
        }
    }

    // Tegner forgrunn
    ctx.drawImage(fg, 0, cvs.height - fgHeight, cvs.width, fgHeight);

    // Tegner fuglen
    ctx.drawImage(bird, bX, bY);

    // Fuglebevegelse
    velocity += gravity;
    bY += velocity;

    // Tegner score
    ctx.fillStyle = "#000";
    ctx.font = "20px Verdana";
    ctx.fillText("Score : " + score, 10, cvs.height - 20);

    animationId = requestAnimationFrame(draw);
}

// Funksjon for å starte spillet
function startGame() {
    initializeVariables();
    startBtn.style.display = "none";
    gameStarted = true;
    draw();
}

// Initialiserer variabler og viser startknappen
initializeVariables();
startBtn.style.display = "block";

// Legger til hendelse for startknappen
startBtn.addEventListener("click", startGame);