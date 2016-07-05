var running = false;
var totalTicks = 0;

var spriteSheet = new Image();
spriteSheet.src = "spriteSheet1.png";

var canvas, context;

setTimeout(function() {
    canvas = document.getElementById("canvas");
    context = canvas.getContext("2d");
    context.imageSmoothingEnabled = false;
    
},1);

function update() {
    
}

function render() {
    context.drawImage(spriteSheet, 0, 0, 16, 16, 0, 0, 16, 16);
}

function run() {
    var lastTime = +(new Date);
    var timer = +(new Date);
    var ms = 1000 / 60;
    var delta = 0;
    var frames = 0;
    var updates = 0;
    if (running) {
        var intervalId = setInterval(function() {
            var now = +(new Date);
            delta += (now - lastTime) / ms;
            lastTime = now;
            while (delta >= 1) {
                update();
                updates++;
                totalTicks++;
                delta--;
            }
            render();
            frames++;

            if (+(new Date) - timer > 1000) {
                timer += 1000;
                console.log("fps: " + frames + ", ups:" + updates);
                frames = 0;
                updates = 0;
            }
            if (!running) clearInterval(intervalId);
        },1);
    }
}