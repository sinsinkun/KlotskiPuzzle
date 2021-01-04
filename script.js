//initalize positions
let pieceList = [
    { name: "red", x: 105, y: 0, type: "red" }, 
    { name: "long1", x: 0, y: 0, type: "long" },
    { name: "long2", x: 315, y: 0, type: "long"}, 
    { name: "long3", x: 0, y: 210, type: "long"},
    { name: "long4", x: 315, y: 210, type: "long" }, 
    { name: "wide1", x: 105, y: 210, type: "wide" },
    { name: "square1", x: 0, y: 420, type: "sm" }, 
    { name: "square2", x: 105, y: 315, type: "sm" },
    { name: "square3", x: 210, y: 315, type: "sm" }, 
    { name: "square4", x: 315, y: 420, type: "sm" }
]

let curPiece = {name: "", mouseX: 0, mouseY: 0, originalx: 0, originaly: 0};

pieceList.forEach(piece => {
    document.getElementById(piece.name).style.left = piece.x + 'px';
    document.getElementById(piece.name).style.top = piece.y + 'px';
    document.getElementById(piece.name).addEventListener("mousedown", e => initDrag(piece, e));
    document.getElementById(piece.name).addEventListener("mousemove", e => whileDrag(piece, e));
    document.getElementById(piece.name).addEventListener("mouseup", () => endDrag(piece));
    document.getElementById(piece.name).addEventListener("mouseout", () => endDrag(piece));
    //touchscreen support
    document.getElementById(piece.name).addEventListener("touchstart", e => initDrag(piece, e));
    document.getElementById(piece.name).addEventListener("touchmove", e => whileDrag(piece, e));
    document.getElementById(piece.name).addEventListener("touchend", () => endDrag(piece));
    document.getElementById(piece.name).addEventListener("touchcancel", () => endDrag(piece));
})

function initDrag(piece, e) {
    curPiece.name = piece.name;
    curPiece.mouseX = e.clientX;
    curPiece.mouseY = e.clientY;
    curPiece.originalx = piece.x;
    curPiece.originaly = piece.y;
    document.getElementById(piece.name).style.zIndex = 10;
}

function whileDrag(piece, e) {
    let deltax = e.clientX - curPiece.mouseX;
    let deltay = e.clientY - curPiece.mouseY;

    if (curPiece.name === piece.name && isInBounds(piece.type, piece.x, piece.y)) {
        document.getElementById(piece.name).style.left = piece.x + deltax + 'px';
        document.getElementById(piece.name).style.top = piece.y + deltay + 'px';
        piece.x += deltax;
        piece.y += deltay;
        curPiece.mouseX = e.clientX;
        curPiece.mouseY = e.clientY;
    }
}

function endDrag(piece) {
    //round to nearest multiple of 105
    let newLeft = Math.round(piece.x/105) * 105;
    let newTop = Math.round(piece.y/105) * 105;
    //check if final position is a valid position & is not overlapping with another piece
    if (isInBounds(piece.type, newLeft, newTop) && isNoOverlap(piece.name, piece.type, newLeft, newTop)) {
            piece.x = newLeft;
            piece.y = newTop;
            document.getElementById(piece.name).style.left = newLeft + 'px';
            document.getElementById(piece.name).style.top = newTop + 'px';
    }
    else {
        piece.x = curPiece.originalx;
        piece.y = curPiece.originaly;
        document.getElementById(piece.name).style.left = curPiece.originalx + 'px';
        document.getElementById(piece.name).style.top = curPiece.originaly + 'px';
    }
    //reset curPiece attributes
    document.getElementById(piece.name).style.zIndex = 5;
    curPiece.name = '';
    curPiece.mouseX = 0;
    curPiece.mouseY = 0;
    curPiece.originalx = 0;
    curPiece.originaly = 0;
    //check if goal reached
    if (pieceList[0].x === 105 && pieceList[0].y === 315) {
        document.getElementById('win-display').innerHTML = "You win!";
    }
}

function isInBounds(type,x,y) {
    if (x < -20) return false;
    if (y < -20) return false;
    if (type === "red" && (x > 230 || y > 335)) return false;
    if (type === "long" && (x > 335 || y > 335)) return false;
    if (type === "wide" && (x > 230 || y > 440)) return false;
    if (type === "sm" && (x > 335 || y > 440)) return false;

    return true;
}

function isNoOverlap(name,type,newx,newy) {
    
    for (let i=0; i<pieceList.length; i++) {
        if (name != pieceList[i].name) {
            //check if current piece position conflicts with existing pieces
            if (newx === pieceList[i].x && newy === pieceList[i].y) return false;
            if (newx === pieceList[i].x + 105 && newy === pieceList[i].y && pieceList[i].type === "wide") return false;
            if (newx === pieceList[i].x && newy === pieceList[i].y + 105 && pieceList[i].type === "long") return false;
            if (newx === pieceList[i].x + 105 && newy === pieceList[i].y + 105 && pieceList[i].type === "red") return false;
            //check if existing piece positions conflict with current piece
            if ((type === "long" || type === "red") && newx === pieceList[i].x && newy === pieceList[i].y - 105) return false;
            if ((type === "wide" || type === "red") && newx === pieceList[i].x - 105 && newy === pieceList[i].y) return false;
            if (type === "red" && newx === pieceList[i].x - 105 && newy === pieceList[i].y - 105) return false;
        }
    }

    return true;
}