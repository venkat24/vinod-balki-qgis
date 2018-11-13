var redRidingHoodXLocation = 0;
var redRidingHoodYLocation = 0;
var animationStep = 0;
let moveDownAnimation = 0;
let moveLeftAnimation = 48;
let moveRightAnimation = 96;
let moveUpAnimation = 144;
let redRidingHoodImage = new Image();
redRidingHoodImage.src = "sprites/redRidingHoodSprite.png";

let initCanvas = (canvasId) => {
    let canvas = $("#" + canvasId).get(0);
    let ctx = canvas.getContext("2d");

    return ctx;
}

let setBgImage = (ctx, bgImagePath) => {
    let img = new Image();
    img.src = bgImagePath;
    img.onload = () => {
        ctx.drawImage(img, 0, 0, 800, 600);
    }
}

function keyDetected(e) {
    let canvas = document.getElementsByTagName("canvas")[0];
    let ctx = canvas.getContext("2d");
    var moveAnimation;

    if (e.keyCode == 37) {
        // Left
        moveAnimation = moveLeftAnimation;
        redRidingHoodXLocation -= 5;
    } else if (e.keyCode == 39) {
        // Right
        moveAnimation = moveRightAnimation;
        redRidingHoodXLocation += 5;
    } else {
        return;
    }

    ctx.clearRect(0,0,canvas.width, canvas.height);
    animationStep = (animationStep+1)%4
    ctx.drawImage(redRidingHoodImage, 
        animationStep*32, 
        moveAnimation, 
        32, 
        48, 
        redRidingHoodXLocation, 
        redRidingHoodYLocation, 
        32, 
        48
    );
}


$(document).ready(() => {
    let ctx = initCanvas("main-canvas");
    setBgImage(ctx, 'images/bg.jpg');

    window.addEventListener("keydown", keyDetected, false);

    // Total sprite size is 128 x 192 => 32 x 48 for every individual sprite
    redRidingHoodImage.onload = () => {
        ctx.drawImage(redRidingHoodImage, 
            animationStep*32, 
            moveRightAnimation, 
            32, 
            48, 
            redRidingHoodXLocation, 
            redRidingHoodYLocation, 
            32, 
            48
        );
    }
});
