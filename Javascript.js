
var running = false;
var totalTicks = 0;

function Tile(spriteSheet, x, y, collision) {
    this.spriteSheet = spriteSheet;
    this.x = x;
    this.y = y;
    this.collision = collision;
}

var mapImage = new Image();

var game = {};
game.map = [];

game.tiles = [];
game.tiles[0] = new Tile(spriteSheet, 0, 2, false);
game.tiles[1] = new Tile(spriteSheet, 0, 1, false);


function convertPixel(pixel) {
    pixel = "" + pixel[0] + " " + pixel[1] + " " + pixel[2] + " " + pixel[3];
    switch (pixel) {
        case "80 92 143 255": return 1;
        default: return 0;
    }
}

function loadMap(src) {
    mapImage.src = src;
    setTimeout(function() {
        var hiddenCanvas = document.createElement("canvas");
        var hiddenContext = hiddenCanvas.getContext("2d");
        hiddenContext.drawImage(mapImage, 0, 0);
        for (var x = 0; x < mapImage.width; x++) {
            game.map[x] = [];
            for (var y = 0; y < mapImage.height; y++) {
                var data = hiddenContext.getImageData(x,y,1,1).data;
                game.map[x][y] = convertPixel(data);
            }
        }
    },10)
}

var spriteSheet = new Image();
spriteSheet.src = "spriteSheet1.png";

var canvas, context;

setTimeout(function() {
    canvas = document.getElementById("canvas");
    context = canvas.getContext("2d");
    context.imageSmoothingEnabled = false;
    running = true;
},1);

function update() {
    
}

function render() {
    for (var x = 0; x < 16; x++) {
        for (var y = 0; y < 16; y++) {
            context.drawImage(spriteSheet, game.tiles[game.map[x][y]].x * 16, game.tiles[game.map[x][y]].y * 16, 16, 16, x*16, y*16, 16, 16);
        }
    }
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