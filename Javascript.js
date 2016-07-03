
var spriteSheet = new Image();
spriteSheet.src = "spriteSheet1.png";


$(document).ready(function() {
    var canvas = document.getElementById("canvas");
    var context = canvas.getContext("2d");
    context.imageSmoothingEnabled = false;
    setTimeout(function() {
        context.drawImage(spriteSheet, 0, 0, 16, 16, 0, 0, 16, 16);
    },10);
    
});