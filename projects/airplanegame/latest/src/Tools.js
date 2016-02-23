function getGameSize() {
    var w = window.innerWidth * window.devicePixelRatio, h = window.innerHeight * window.devicePixelRatio;
    var aspect = w/h;
    var targetaspect = 1280/720;
    aspect = clamp(aspect, 1.32, 1.9);
    var res = {x:1280,y:720};
    
    if (aspect > targetaspect)
        res.x = res.y  * aspect;
    else
        res.y = res.x / aspect;

    console.log("screen size " + w+"x"+h+" aspect: " + aspect + " target aspect:" + targetaspect + " result: " + res.x+"x"+res.y);
    return res;
}

function Label(context, x, y, text, fontSize, fontColor, align, font) {
    if (font == null) font = "Pebble"
    var t = new Phaser.Text(context.game, x, y, text, { font: fontSize + "px " + font, fill: fontColor, align: align })
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
    var t = new Phaser.Text(context.game, 0, 3, text, { font: fontSize + "px Pebble", fill: fontColor, align: "center" }); 
    t.anchor.set(0.5,0.5);
    if (graphic == '') {
        b.alpha = 0;
        b.width = t.width + 10;
        b.height = t.height + 10;
    }
    group.text = t;
    group.button = b;
    group.add(t);
    return group;
}
function ButtonWithTextOver(context, x, y, text, outFrame, overFrame, fontSize, fontColor, onHit) {
    var group = new Phaser.Group(context.game);
    group.position.set(x, y);
    var b = new Phaser.Button(context.game, 0,0, 'buttons', null, context, overFrame, outFrame, overFrame, outFrame);
    b.onInputDown.add(onHit, context);
    b.anchor.set(0.5,0.5);
    group.add(b);
    var t = new Phaser.Text(context.game, 0, 3, text, { font: fontSize + "px Helvetica", fill: fontColor, align: "center" }); 
    t.anchor.set(0.5,0.5);
    group.text = t;
    group.button = b;
    group.add(t);
    return group;
}

function lerp(a, b, u) {
    return (1 - u) * a + u * b;
}
function towards(a, b, speed, deltatime) {
    if (a==b) return a;
    return clamp01(a + deltatime * speed * (b < a ? -1 : 1));
}
function clamp(a,min,max) {
    if (a<min) a=min;
    if (a>max) a=max;
    return a;
}
function clamp01(a) { return clamp(a,0,1) }

function TransitionToState(nextState, stage) {
    if (BasicGame.transition.visible)
       return;
    if (stage == null) {
        console.log("No stage!");
        return;
    }
    BasicGame.transition.bg.width = stage.width;
    BasicGame.transition.bg.height = stage.height;
    //BasicGame.transition.bg.y = stage.height;
    //BasicGame.transition.x = stage.game.width * .5;
    //BasicGame.transition.y = stage.game.height * .5;
    //BasicGame.transition.bg.scale.set(0,0);
    BasicGame.transition.visible = true;

    stage.addChildAt(BasicGame.transition,stage.children.length-1);
    
    /*
    var duration = 600;
    scaleTo = (stage.game.width / BasicGame.transition.bg.texture.width) * 1.5;

    var tweenIn = stage.game.add.tween(BasicGame.transition.bg.position);
    tweenIn.to( { y:0 }, duration, Phaser.Easing.Circular.InOut);
    tweenIn.onStart.add(function(context, tween){
        //BasicGame.transition.bg.scale.set(0,0);
        BasicGame.transition.bg.y = tween.game.stage.height;
    }, this);
    tweenIn.onComplete.add(function(context, tween){ 
        tween.game.sound.stopAll();
        tween.game.tweens.removeAll();
        tween.game.state.start(nextState);
        tween.game.state.onStateChange.add(TransitionFromState, tween.game.state, 0, tween.game);
    }, this);

    tweenIn.start();
    */

    var anim = BasicGame.transition.bg.animations.play("in");
    anim.onComplete.add(function(context, tween){ 
        tween.game.sound.stopAll();
        tween.game.tweens.removeAll();
        //tween.game.scale.onSizeChange.removeAll();
        tween.game.state.start(nextState);
        tween.game.state.onStateChange.add(TransitionFromState, tween.game.state, 0, tween.game);
    }, this);
}
function TransitionFromState() {

    this.onStateChange.remove(TransitionFromState, this);
    /*
    var duration = 400;
    var tweenOut = this.game.add.tween(BasicGame.transition.bg.position);
    tweenOut.to( { y:-this.game.stage.height }, duration, Phaser.Easing.Circular.In);
    tweenOut.onComplete.add(function(context, tween){ 
        tween.game.stage.removeChild(BasicGame.transition);
        BasicGame.transition.visible = false;
    }, game);
    */

    //tweenOut.start();

    var anim = BasicGame.transition.bg.animations.play("out");
    anim.onComplete.add(function(context, tween){ 
        tween.game.stage.removeChild(BasicGame.transition);
        BasicGame.transition.visible = false;
    }, game);

}

function MenuBackground(game, x, y, width, height) {
    var g = new Phaser.Group(game);

    var tl = new Phaser.Image(game,0,0,'popupbg_corner');
    var tr = new Phaser.Image(game,width,0,'popupbg_corner');
    tr.width *= -1;
    var br = new Phaser.Image(game,tr.x,height,'popupbg_corner');
    br.width *= -1;
    br.height *= -1;
    var bl = new Phaser.Image(game,0,br.y,'popupbg_corner');
    bl.height *= -1;

    var top = new Phaser.Image(game,tl.width,0,'popupbg_top');
    top.width = width-tl.width*2;
    var bottom = new Phaser.Image(game,top.x,height,'popupbg_top');
    bottom.width = top.width;
    bottom.height *= -1;

    var left = new Phaser.Image(game,0,tl.height,'popupbg_side');
    left.height = height - tl.height * 2;
    var right = new Phaser.Image(game,width,tl.height,'popupbg_side');
    right.width *= -1;
    right.height = left.height;

    var fill = new Phaser.Image(game,tl.width-5,tl.height-5,'popupbg_fill');
    fill.width = width - tl.width * 2 + 10;
    fill.height = height - tl.height * 2 + 10;

    g.add(fill);
    g.add(tl);
    g.add(tr);
    g.add(br);
    g.add(bl);
    g.add(top);
    g.add(bottom);
    g.add(left);
    g.add(right);

    g.x = x - width * .5;
    g.y = y - height * .5;

    return g;
}

function UpdateProgressBar(game, percentage, tint, scorebar) {
    var s = scorebar;
    if (s == null) {
        s = {};
        s.group = new Phaser.Group(game);
        s.l = new Phaser.Image(game,0,0,'level_scorebarL');
        s.m = new Phaser.Image(game,s.l.width,0,'level_scorebarM');
        s.r = new Phaser.Image(game,s.m.x+s.l.width,0,'level_scorebarR');
        s.group.add(s.l);
        s.group.add(s.m);
        s.group.add(s.r);
        s.width = s.m.width;
    }
    percentage = clamp01(percentage);
    if (s.m.width != percentage) {
        s.m.width = s.width * percentage;
        s.m.x = s.l.width;
        s.r.x = s.m.x + s.m.width - 1;
        s.l.tint = s.m.tint = s.r.tint = tint;
    }
    return s;
}

function UpdateGameCursor(game, updateOrder) {
    if (game.device.desktop == false)
        return;
    if (updateOrder == true)
        game.stage.setChildIndex(BasicGame.cursor,game.stage.children.length-1);

    var pos = game.input.activePointer;
    var speed = (game.time.elapsedMS / 1000) * 12.25;
    BasicGame.cursor.x = lerp(BasicGame.cursor.x, pos.x, speed);
    BasicGame.cursor.y = lerp(BasicGame.cursor.y, pos.y, speed);

}

function values(map) {
  var vals = [];
  for (var key in map) {
    var val = map[key];
    vals.push(val);
  }
  return vals;
}

function cmp(attr, a, b) {
  var a_val = parseInt(a[attr], 10);
  var b_val = parseInt(b[attr], 10);
  console.assert(!isNaN(a_val));
  console.assert(!isNaN(b_val));
  if (a_val < b_val) return -1;
  else if (a_val > b_val) return 1;
  return 0;
}

function indexOfSorted(array, attr, val) {
  for (var i = 0; i < array.length; ++i) {
    var arrVal = parseInt(array[i][attr], 10);
    console.assert(!isNaN(arrVal));
    if (val > arrVal)
      return i;
  }

  return array.length;
}

var scoresUrl = "http://telia-ethics.dev.wolffolins.com/scores";
var authHeader = 'Basic dGVsaWEtZXRoaWNzOjNleGVickVi'; // derived from user/pass

function addAuth(xhr) {
  xhr.setRequestHeader('Authorization', authHeader);
}

function getScores(successCallback, errorCallback) {
  $.ajax({
    type: "GET",
    url: scoresUrl,
    success: function (serverHighScores) {
      var scores = values(serverHighScores);
      // make sure "points" is a number
      for (var i = 0; i < scores.length; ++i)
        scores[i].points = parseInt(scores[i].points, 10);
      // return scores sorted
      scores.sort(function(a, b) { return -cmp('points', a, b); });
      successCallback(scores);
    },
    error: errorCallback,
    beforeSend: addAuth
  });
}

function setScore(name, points, successCallback, errorCallback) {
  $.ajax({
    type: "POST",
    url: scoresUrl,
    contentType: "application/json; charset=utf-8",
    dataType: "json",
    data: {
      name: name,
      points: points
    },
    success: successCallback,
    error: errorCallback,
    beforeSend: addAuth
  });
}

function numberStringForIndex(i) { return (i<9?"0":"") + (i+1); }
