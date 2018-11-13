const constants = {
    houseSpriteLocation: {
        x: 20,
        y: 30
    },
    redRidingHoodStartLocation: {
        x: 130,
        y: 100
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
        this.movingDirection = {
            up: false,
            down: false,
            left: false,
            right: false
        };
        this.speed = 2.25;
        this.animationStep = 0;
        this.animationSpeed = 0.2;
    }

    update() {
        if (this.movingDirection.right) {
            this.x += this.speed;
            this.state = 2;
            this.animationStep = (this.animationStep + this.animationSpeed) % 4;
        } else if (this.movingDirection.left) {
            this.x -= this.speed;
            this.state = 1;
            this.animationStep = (this.animationStep + this.animationSpeed) % 4;
        } else if (this.movingDirection.up) {
            this.y -= this.speed;
            this.state = 3;
            this.animationStep = (this.animationStep + this.animationSpeed) % 4;
        } else if (this.movingDirection.down) {
            this.y += this.speed;
            this.state = 0;
            this.animationStep = (this.animationStep + this.animationSpeed) % 4;
        }
    }
}

let initCanvas = (canvasId) => {
    let canvas = $("#" + canvasId).get(0);
    let ctx = canvas.getContext("2d");

    return ctx;
}

let imageLoader = (imagePath) => {
    return new Promise((resolve, reject) => {
        try {
            let img = new Image();
            img.src = imagePath;
            img.onload = () => {
                resolve(img);
            };
        } catch (e) {
            reject(e);
        }
    })
}

$(document).ready(async () => {

    let animate = await (async() => {
        // Load canvas, set BG image
        let ctx = initCanvas("main-canvas");

        // Load assets
        let bgImage = await imageLoader('images/bg.jpg');
        let houseSprite = await imageLoader("sprites/houseSprite.png");
        let redRidingHoodSprite = await imageLoader("sprites/redRidingHoodSprite.png");

        let redRidingHood = new RedRidingHood(
            constants.redRidingHoodStartLocation.x,
            constants.redRidingHoodStartLocation.y,
            redRidingHoodSprite
        );

        window.addEventListener("keydown", (e) => {
            if (e.keyCode == 37) {
                redRidingHood.movingDirection.left = true;
            } else if (e.keyCode == 39) {
                redRidingHood.movingDirection.right = true;
            } else if (e.keyCode == 38) {
                redRidingHood.movingDirection.up = true;
            } else if (e.keyCode == 40) {
                redRidingHood.movingDirection.down = true;
            }
        });

        window.addEventListener("keyup", (e) => {
            if (e.keyCode == 37) {
                redRidingHood.movingDirection.left = false;
            } else if (e.keyCode == 39) {
                redRidingHood.movingDirection.right = false;
            } else if (e.keyCode == 38) {
                redRidingHood.movingDirection.up = false;
            } else if (e.keyCode == 40) {
                redRidingHood.movingDirection.down = false;
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
                Math.floor(redRidingHood.animationStep) * 32, // sprite offset
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
