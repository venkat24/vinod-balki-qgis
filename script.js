const constants = {
    momHouseSprite: {
        x: 0,
        y: 40,
        size: 13
    },
    grandmaHouseSprite: {
        x: 450,
        y: 40,
        size: 13
    },
    forestSprite: {
        x: 295,
        y: 350,
        size: 4
    },
    redRidingHood: {
        startLocation: {
            x: 130,
            y: 130
        },
        spriteSize: {
            width: 32,
            height: 48
        },
        actualSize: {
            width: 32,
            height: 48
        },
        speed: 2.25,
        animationSpeed: 0.2,
        startingState: 0
    },
    wolf: {
        startLocation: {
            x: 520,
            y: 330
        },
        spriteSize: {
            width: 48,
            height: 48
        },
        actualSize: {
            width: 48,
            height: 48
        },
        speed: 0.7,
        animationSpeed: 0.1,
        startingState: 3,
        isMoving: false
    },
    woodcutter: {
        startLocation: {
            x: 630,
            y: 330
        },
        spriteSize: {
            width: 30,
            height: 38
        },
        actualSize: {
            width: 30,
            height: 38
        },
        speed: 0.5,
        animationSpeed: 0.1,
        startingState: 0,
        isMoving: true
    },
    pathWidth: 70,
}

class PathBlock {
    constructor(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }

    draw(ctx) {
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }

    checkIfInsidePathBlock(x, y) {
        let isInsideX = false;
        let isInsideY = false;
        if (this.height < 0) {
            isInsideY = (y<=this.y && y>=(this.y+this.height));
        } else {
            isInsideY = (y>=this.y && y<=(this.y+this.height));
        }

        if (this.width < 0) {
            isInsideX = (x<=this.x && x>=(this.x+this.width));
        } else {
            isInsideX = (x>=this.x && x<=(this.x+this.width));
        }

        if (isInsideX && isInsideY) {
            return true;
        } else {
            return false;
        }
    }
}

let path = [
    new PathBlock(120,120,310,constants.pathWidth),
    new PathBlock(220,120,constants.pathWidth, 300),
    new PathBlock(220,420,480,constants.pathWidth),
    new PathBlock(700,420+constants.pathWidth,constants.pathWidth, -300),
    new PathBlock(700+constants.pathWidth,120,-200,constants.pathWidth)
]

let isInsideAPath = (x, y) => {
    isInsidePath = false;
    for (var i = 0; i < path.length; i++) {
        isInsidePath = isInsidePath || path[i].checkIfInsidePathBlock(x,y);
    }
    return isInsidePath;
}

class Character {
    constructor(x, y, image, speed, animationSpeed, state) {
        this.x = x;
        this.y = y;
        this.image = image;
        this.speed = speed
        this.animationSpeed = animationSpeed

        /**
         * State is the direction map
         * Down -> 0
         * Left -> 1
         * Right -> 2
         * Up -> 3
         */
        this.state = state;
        this.movingDirection = {
            up: false,
            down: false,
            left: false,
            right: false
        };
        this.animationStep = 0;
    }

    update() {
        if (this.movingDirection.right) {
            this.x += this.speed;
            if (!isInsideAPath(this.x+constants.redRidingHood.actualSize.width/2, this.y+constants.redRidingHood.actualSize.height)) {
                this.x -= this.speed;
            }

            this.state = 2;
            this.animationStep = (this.animationStep + this.animationSpeed) % 4;
        } else if (this.movingDirection.left) {
            this.x -= this.speed;
            if (!isInsideAPath(this.x+constants.redRidingHood.actualSize.width/2, this.y+constants.redRidingHood.actualSize.height)) {
                this.x += this.speed;
            }

            this.state = 1;
            this.animationStep = (this.animationStep + this.animationSpeed) % 4;
        } else if (this.movingDirection.up) {
            this.y -= this.speed;
            if (!isInsideAPath(this.x+constants.redRidingHood.actualSize.width/2, this.y+constants.redRidingHood.actualSize.height)) {
                this.y += this.speed;
            }

            this.state = 3;
            this.animationStep = (this.animationStep + this.animationSpeed) % 4;
        } else if (this.movingDirection.down) {
            this.y += this.speed;
            if (!isInsideAPath(this.x+constants.redRidingHood.actualSize.width/2, this.y+constants.redRidingHood.actualSize.height)) {
                this.y -= this.speed;
            }

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

let drawPath = (ctx) => {
    ctx.fillStyle="#afafaf";
    for (var i = 0; i < path.length; i++) {
        path[i].draw(ctx);
    }
}

$(document).ready(async () => {

    let animate = await (async() => {
        // Load canvas, set BG image
        let ctx = initCanvas("main-canvas");

        // Load assets
        let bgImage = await imageLoader('images/bg.jpg');
        let houseSprite = await imageLoader("sprites/houseSprite.png");
        let redRidingHoodSprite = await imageLoader("sprites/redRidingHoodSprite.png");
        let forestSprite = await imageLoader("sprites/forestSprite.png");
        let wolfSprite = await imageLoader("sprites/wolfSprite.png");
        let woodcutterSprite = await imageLoader("sprites/woodcutterSprite.png");

        let redRidingHood = new Character(
            constants.redRidingHood.startLocation.x,
            constants.redRidingHood.startLocation.y,
            redRidingHoodSprite,
            constants.redRidingHood.speed,
            constants.redRidingHood.animationSpeed,
            constants.redRidingHood.startingState
        );

        let wolf = new Character(
            constants.wolf.startLocation.x,
            constants.wolf.startLocation.y,
            wolfSprite,
            constants.wolf.speed,
            constants.wolf.animationSpeed,
            constants.wolf.startingState
        );

        let woodcutter = new Character(
            constants.woodcutter.startLocation.x,
            constants.woodcutter.startLocation.y,
            woodcutterSprite,
            constants.woodcutter.speed,
            constants.woodcutter.animationSpeed,
            constants.woodcutter.startingState
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
            drawPath(ctx);
            ctx.drawImage(
                houseSprite,
                constants.momHouseSprite.x,
                constants.momHouseSprite.y,
                14*constants.momHouseSprite.size,
                11*constants.momHouseSprite.size
            );
            ctx.drawImage(
                houseSprite,
                constants.grandmaHouseSprite.x,
                constants.grandmaHouseSprite.y,
                14*constants.grandmaHouseSprite.size,
                11*constants.grandmaHouseSprite.size
            );

            redRidingHood.update();
            ctx.drawImage(redRidingHoodSprite,
                Math.floor(redRidingHood.animationStep) * constants.redRidingHood.spriteSize.width, // sprite offset
                redRidingHood.state * constants.redRidingHood.spriteSize.height,
                constants.redRidingHood.spriteSize.width,
                constants.redRidingHood.spriteSize.height,
                redRidingHood.x,
                redRidingHood.y,
                constants.redRidingHood.actualSize.width,
                constants.redRidingHood.actualSize.height
            );

            if (constants.wolf.isMoving) {
                wolf.animationStep = (wolf.animationStep + wolf.animationSpeed)%4;
                wolf.y -= wolf.speed;
                ctx.drawImage(wolfSprite,
                    Math.floor(wolf.animationStep) * constants.wolf.spriteSize.width, // sprite offset
                    wolf.state * constants.wolf.spriteSize.height,
                    constants.wolf.spriteSize.width,
                    constants.wolf.spriteSize.height,
                    wolf.x,
                    wolf.y,
                    constants.wolf.actualSize.width,
                    constants.wolf.actualSize.height
                );
                if (wolf.y < 130) {
                    alert('Cutscene now');
                    constants.wolf.isMoving = false;
                }
            }

            if (constants.woodcutter.isMoving) {
                woodcutter.animationStep = (woodcutter.animationStep + woodcutter.animationSpeed)%5;
                woodcutter.y -= woodcutter.speed;
                ctx.drawImage(woodcutterSprite,
                    woodcutter.state * constants.woodcutter.spriteSize.width,
                    Math.floor(woodcutter.animationStep) * constants.woodcutter.spriteSize.height, // sprite offset
                    constants.woodcutter.spriteSize.width,
                    constants.woodcutter.spriteSize.height,
                    woodcutter.x,
                    woodcutter.y,
                    constants.woodcutter.actualSize.width,
                    constants.woodcutter.actualSize.height
                );
                if (woodcutter.y < 130) {
                    alert('Final cutscene now');
                    constants.woodcutter.isMoving = false;
                }
            }

            ctx.drawImage(
                forestSprite,
                constants.forestSprite.x,
                constants.forestSprite.y,
                69*constants.forestSprite.size,
                45*constants.forestSprite.size
            );

            requestAnimationFrame(animate);
        }
    })();

    animate();
});
