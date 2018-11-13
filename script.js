$(document).ready(() => {
    let canvas = document.getElementsByTagName("canvas")[0];
    let ctx = canvas.getContext("2d");
    ctx.beginPath();
    ctx.rect(20, 20, 150, 100);
    ctx.fillStyle = "red";
    ctx.fill();
});
