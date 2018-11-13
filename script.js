// let moveDownAnimation = 0;
// let moveLeftAnimation = 48;
// let moveRightAnimation = 96;
// let moveUpAnimation = 144;

let animationStep = 0;

const constants = {
    houseSpriteLocation: {
        x: 20,
        y: 30
    },
    redRidingHoodStartLocation: {
        x: 0,
        y: 0
    }
}

class RedRidingHood {
    constructor(x, y, image) {
        this.x = x;
        this.y = y;
        this.image = image;

        /**
         * State is the direction map
         * Down -> 0
         * Left -> 1
         * Right -> 2
         * Up -> 3
         */
        this.state = 0;
        this.isMovingLeft = false;
        this.isMovingRight = false;
    }

    update() {
        if (this.isMovingRight) {
            this.x += 5;
            this.state = 2;
            animationStep = (animationStep + 1) % 4;
        } else if (this.isMovingLeft) {
            this.x -= 5;
            this.state = 1;
            animationStep = (animationStep + 1) % 4;
        }
    }
}

let initCanvas = (canvasId) => {
    let canvas = $("#" + canvasId).get(0);
    let ctx = canvas.getContext("2d");

    return ctx;
}


let imageLoader = (imagePath) => {
    let img = new Image();
    img.src = imagePath;

    return img;
}

$(document).ready(() => {

    let animate = (() => {
        // Load canvas, set BG image
        let ctx = initCanvas("main-canvas");

        // Load assets
        let bgImage = imageLoader('images/bg.jpg');
        bgImage.onload = () => {
            ctx.drawImage(bgImage, 0, 0, 800, 600);
        };

        let houseSprite = imageLoader("sprites/houseSprite.png");
        houseSprite.onload = () => {
            ctx.drawImage(
                houseSprite,
                constants.houseSpriteLocation.x,
                constants.houseSpriteLocation.y
            );
        };
        let redRidingHoodSprite = imageLoader("sprites/redRidingHoodSprite.png");

        let redRidingHood = new RedRidingHood(
            constants.redRidingHoodStartLocation.x,
            constants.redRidingHoodStartLocation.y,
            redRidingHoodSprite
        );

        window.addEventListener("keydown", (e) => {
            if (e.keyCode == 37) {
                redRidingHood.isMovingLeft = true;
                redRidingHood.isMovingRight = false;
            } else if (e.keyCode == 39) {
                redRidingHood.isMovingRight = true;
                redRidingHood.isMovingLeft = false;
            }
        });

        window.addEventListener("keyup", (e) => {
            if (e.keyCode == 37) {
                redRidingHood.isMovingLeft = false;
            } else if (e.keyCode == 39) {
                redRidingHood.isMovingRight = false;
            }
        });

        return () => {
            // Clear the canvas
            ctx.clearRect(0, 0, 800, 600);
            ctx.drawImage(bgImage, 0, 0, 800, 600);
            ctx.drawImage(
                houseSprite,
                constants.houseSpriteLocation.x,
                constants.houseSpriteLocation.y,
                140,
                110
            );

            redRidingHood.update();

            ctx.drawImage(redRidingHoodSprite,
                animationStep * 32, // sprite offset
                redRidingHood.state * 48,
                32, // sprite width
                48, // sprite height
                redRidingHood.x,
                redRidingHood.y,
                32, // actual width
                48 // actual height
            );

            requestAnimationFrame(animate);
        }
    })();

    animate();

});
