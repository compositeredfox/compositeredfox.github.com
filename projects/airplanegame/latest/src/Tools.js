

function Label(context, x, y, text, fontSize, fontColor, align) {
    var t = new Phaser.Text(context.game, x, y, text, { font: fontSize + "px Arial", fill: fontColor, align: align })
    if (align=='center')t.anchor.set(0.5,0.5);
    if (align=='left')t.anchor.set(0,0.5);
    if (align=='right')t.anchor.set(1,0.5);
    return t;
}

function ButtonWithText(context, x, y, text, graphic, fontSize, fontColor, onHit) {
    var group = new Phaser.Group(context.game);
    group.position.set(x, y);
    var b = new Phaser.Button(context.game, 0,0, graphic);
    b.onInputDown.add(onHit, context);
    b.anchor.set(0.5,0.5);
    group.add(b);
    var t = new Phaser.Text(context.game, 0, 3, text, { font: fontSize + "px Arial", fill: fontColor, align: "center" }); 
    t.anchor.set(0.5,0.5);
    group.add(t);
    return group;
}
