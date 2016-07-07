var fps, ups;
const tileSize = 48;
var running = false;
var totalTicks = 0;

function Tile(spriteSheet, x, y, collision) {
    this.spriteSheet = spriteSheet;
    this.x = x;
    this.y = y;
    this.collision = collision;
}

var mapImage = new Image();

var player = {};
player.x = 0;
player.y = 0;
player.collide = function(x, y) {
    if ((game.tiles[game.map[(x - (x % tileSize)) / tileSize][(y - (y % tileSize)) / tileSize]].collision) ||
        (game.tiles[game.map[(x + tileSize - 1 - ((x + tileSize - 1) % tileSize)) / tileSize][(y - (y % tileSize)) / tileSize]].collision) ||
        (game.tiles[game.map[(x - (x % tileSize)) / tileSize][(y + tileSize - 1 - ((y + tileSize - 1) % tileSize)) / tileSize]].collision) ||
        (game.tiles[game.map[(x + tileSize - 1 - ((x + tileSize - 1) % tileSize)) / tileSize][(y + tileSize - 1 - ((y + tileSize - 1) % tileSize)) / tileSize]].collision)) {
        return true;
    }
    else {
        return false;
    }
}

player.move = function() {
    if (keys[38] && !player.collide(player.x, player.y-1)) player.y -= 1;
    if (keys[40] && !player.collide(player.x, player.y+1)) player.y += 1;
    if (keys[37] && !player.collide(player.x-1, player.y)) player.x -= 1;
    if (keys[39] && !player.collide(player.x+1, player.y)) player.x += 1;
}

player.update = function() {
    
}

var game = {};
game.map = [];

game.tiles = [];
game.tiles[0] = new Tile(spriteSheet, 0, 2, false);
game.tiles[1] = new Tile(spriteSheet, 0, 1, false);
game.tiles[2] = new Tile(spriteSheet, 0, 3, true);

function convertPixel(pixel) {
    switch (pixel.toString()) {
        case "80,92,143,255": return 1;
        case "255,0,0,255": return 2;
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
    },10);
}

var spriteSheet = new Image();
spriteSheet.src = "spriteSheet1.png";

var canvas, context;

function setPixelated(context){
    context['imageSmoothingEnabled'] = false;       /* standard */
    context['mozImageSmoothingEnabled'] = false;    /* Firefox */
    context['oImageSmoothingEnabled'] = false;      /* Opera */
    context['webkitImageSmoothingEnabled'] = false; /* Safari */
    context['msImageSmoothingEnabled'] = false;     /* IE */
}

setTimeout(function() {
    canvas = document.getElementById("canvas");
    context = canvas.getContext("2d");
    setPixelated(context);
    running = true;
    loadMap("mapImage.png");
    run();
},1);

var keys = [];
document.onkeydown = function(e) {
    keys[e.keyCode] = true;
}

document.onkeyup = function(e) {
    keys[e.keyCode] = false;
}

function update() {
    for(var i = 0; i < 5; i++) {
        player.move();
    }
}

function render() {
    canvas.width = canvas.width;
    for (var x = 0; x < game.map.length; x++) {
        for (var y = 0; y < game.map[0].length; y++) {
            if (x * tileSize - player.x + (canvas.height/2-8) >= -tileSize &&
                y * tileSize - player.y + (canvas.height/2-8) >= -tileSize &&
                x * tileSize - player.x + (canvas.height/2-8) <= tileSize * 16 &&
                y * tileSize - player.y + (canvas.height/2-8) <= tileSize * 16) {
                context.drawImage(spriteSheet, game.tiles[game.map[x][y]].x * 16, game.tiles[game.map[x][y]].y * 16, 16, 16, x*tileSize-player.x+(canvas.height/2-8), y*tileSize-player.y+(canvas.height/2-8), tileSize, tileSize);
            }
        }
    }
    context.drawImage(spriteSheet, 0, 0, 16, 16, canvas.width/2-8, canvas.height/2-8, 48, 48);
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
//                console.log("fps: " + frames + ", ups:" + updates);
                ups = updates;
                fps = frames;
                frames = 0;
                updates = 0;
            }
            if (!running) clearInterval(intervalId);
        },1);
    }
}