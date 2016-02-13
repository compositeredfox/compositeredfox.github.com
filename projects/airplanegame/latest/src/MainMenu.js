
BasicGame.MainMenu = function (game) {

	this.sprite_title = null;
	this.sprite_airplane = null;
	this.playButton = null;
	this.leaderboards = null;
	this._dragStartY = 0;
	this.music = null;

	this.clouds = [];

};

BasicGame.MainMenu.prototype = {

	create: function () {

		/*this.music = this.add.audio('titleMusic');
		this.music.play();*/

		var bg = this.add.image(0, 0, 'mainmenu_bg');
		bg.width = this.game.width;
		bg.height = this.game.height;

		this.clouds[0] = this.add.image(this.game.width * .8, this.game.height * (0.05 + Math.random() * 0.2), 'mainmenu_cloud');
		this.clouds[1] = this.add.image(this.game.width * .2, this.game.height * (0.55 + Math.random() * 0.3), 'mainmenu_cloud');

		this.sprite_airplane = this.add.image(this.game.width * .19, this.game.height * .6, 'mainmenu_plane');
		this.sprite_airplane.anchor.set(0.5,0.5);

		this.img_title = this.add.image(this.game.width * .5, this.game.height * .3, 'mainmenu_title');
		this.img_title.anchor.set(0.5,0.5);
		/*
        var title = Label(this, this.game.width * .5, this.game.height * .4, "DON'T PLAY THIS\nGAME AT WORK", 88, "#ffffff", 'center'); //TODO: localize
        title.setShadow(0,0,'rgba(0,0,0,0.12)',10);
        this.game.add.existing(title);
		*/
        this.button_start = this.game.add.existing(ButtonWithTextOver(this, this.game.width * .5, this.game.height * 0.65, "START", 'button_title', 'button_title_over', 12, "#000000", this.startGame)); //TODO: localize
        //this.button_hiscores = this.game.add.existing(ButtonWithText(this, this.game.width - 90, this.game.height - 30, "- High Scores -", 'graphic_smallbutton', 24, "#ffffff", this.openLeaderboards)); //TODO: localize
        //this.button_hiscores.alpha = 0.7;
        
        
        this.footer = this.game.add.group();
        this.footer.position.set(this.game.width * .5,this.game.height);
        this.footer.add(new Phaser.Button(this.game, 0, 0,'mainmenu_footer',this.openUrl, this)).anchor.set(0.5,1);
        
        var t = this.footer.add(Label(this, 370, -33, "See what else you shouldn't do at work: View our code of conduct", 14, "#000000", 'right', 'Helvetica'));
        t.addColor("#b347e9", "See what else you shouldn't do at work:".length);
		
        // leaderboards popup

        this.leaderboards = this.game.add.group();
        this.leaderboards.x = this.game.width * .5;
        this.leaderboards.y = this.game.height * .5;

        this.leaderboards.popup = this.leaderboards.add(new Phaser.Group(this.game));
        //this.leaderboards.popup.add(MenuBackground(this.game, 0, 0, 800, 660));
        
        this.leaderboards.bg = this.leaderboards.popup.add(new Phaser.Image(this.game,0,0,'leaderboards_bg'));
        this.leaderboards.bg.anchor.set(0.5,0.5);

        this.leaderboards.title = this.leaderboards.popup.add(Label(this,-365,-232, "HIGH SCORE\nBOARD", 60, "#990AE3", 'left'));
        this.leaderboards.title.lineSpacing = -15;
        this.leaderboards.title.anchor.set(0,0);

        this.leaderboards.hiscoretable = this.leaderboards.popup.add(new Phaser.Group(this.game));
        this.leaderboards.hiscorelines = [];
        for (var i = 0; i < 10; i++) {
            var x = i < 5 ? -360 : 45;
            var y = -47 + 38 * (i%5);
            this.leaderboards.hiscorelines[i] = this.leaderboards.hiscoretable.add(new Phaser.Group(this.game));
            this.leaderboards.hiscorelines[i].num = new Phaser.Text(this.game, x, y, numberStringForIndex(i), { font: "24px Pebble", fill: "#000000", align: "right"});
            this.leaderboards.hiscorelines[i].num.anchor.set(0,0);
            this.leaderboards.hiscorelines[i].name = new Phaser.Text(this.game, x + 38, y, "YOUR NAME", { font: "24px Pebble", fill: "#000000", align: "left"});
            this.leaderboards.hiscorelines[i].name.anchor.set(0,0);
            this.leaderboards.hiscorelines[i].points = new Phaser.Text(this.game, x + 304, y, "000", { font: "24px Pebble", fill: "#000000", align: "right"});
            this.leaderboards.hiscorelines[i].points.anchor.set(1,0);
            this.leaderboards.hiscorelines[i].p = new Phaser.Text(this.game, x + 306, y + 9, "p", { font: "14px Helvetica", fill: "#000000", align: "left"});
            this.leaderboards.hiscorelines[i].p.anchor.set(0,0);
            this.leaderboards.hiscoretable.add(this.leaderboards.hiscorelines[i].num);
            this.leaderboards.hiscoretable.add(this.leaderboards.hiscorelines[i].name);
            this.leaderboards.hiscoretable.add(this.leaderboards.hiscorelines[i].points);
            this.leaderboards.hiscoretable.add(this.leaderboards.hiscorelines[i].p);

        };
        this.leaderboards.setScores = function(scores) {
          for (var i = 0; i < 10; ++i) {
            var score = scores[i];
            var line = this.hiscorelines[i];
            if (!score)
              line.visible = false;
            else {
              line.visible = true;
              line.num.text = numberStringForIndex(i);
              line.name.text = score.name.toUpperCase();
              line.points.text = score.points;
            }
          }
        }
        this.leaderboards.button_hiscore = ButtonWithTextOver(this,-218, 204, "QUIT", 'button_endgame1', 'button_endgame1_over', 12, "#990AE3", this.closeLeaderboards);
        this.leaderboards.popup.add(this.leaderboards.button_hiscore);
        this.leaderboards.button_restart = ButtonWithTextOver(this,218, 204, "PLAY AGAIN", 'button_endgame1', 'button_endgame1_over', 12, "#990AE3", this.startGame);
        this.leaderboards.popup.add(this.leaderboards.button_restart);
		
        this.leaderboards.loading = this.leaderboards.popup.add(new Phaser.Image(this.game,0,45, 'loading'));
        this.leaderboards.loading.anchor.set(0.5,0.5);
        this.leaderboards.loading.scale.set(0.4,0.4);

        this.leaderboards.visible = false;

        this.scale.setResizeCallback(this.onGameResized, this);
        this.onGameResized();

        UpdateGameCursor(this.game,-1);

        if (BasicGame.openLeaderboards == true)
        	this.openLeaderboards();
        BasicGame.openLeaderboards = false;

        this.music = this.sound.play('startScreen', 1, true);
        // fade in with fix for looping on chrome (doesn't work with built in fade in)
        this.music.onDecoded.add(function(sound){ sound.volume = 0; sound.game.add.tween(sound).to({volume:1}, 500).start()});
        //this.music.onLoop.add(this.loopMusic, this);

	},

	update: function () {

		if (this.game.paused)
			return;

		this.button_start.y = this.game.height * .65;

		this.img_title.x = this.game.width * .5;
		this.img_title.y = this.game.height * .65 - 150;
		var s = 0.9 + Math.sin(this.game.time.time * 0.001 + 0.2) * 0.01;
		this.img_title.scale.setTo(s,s);

		this.sprite_airplane.y = this.game.height * .75 + Math.sin(this.game.time.time * 0.0015) * 10;

		this.clouds[0].x -= (this.game.time.elapsedMS / 1000) * 400;
		if (this.clouds[0].x < -this.clouds[0].width) {
			this.clouds[0].x = this.game.width + 40 + Math.random() * 40;
			this.clouds[0].y = this.game.height * (0.05 + Math.random() * 0.3);
		}
		this.clouds[1].x -= (this.game.time.elapsedMS / 1000) * 350;
		if (this.clouds[1].x < -this.clouds[0].width) {
			this.clouds[1].x = this.game.width + 40 + Math.random() * 40;
			this.clouds[1].y = this.game.height * (0.55 + Math.random() * 0.3);
		}

		if (this.leaderboards.loading.visible) {
			this.leaderboards.loading.angle = -this.game.time.time * 0.2;
		}

		//console.log(BasicGame.transition.mask.scale.x);

		UpdateGameCursor(this.game);

        if (BasicGame.cheatCodes) {
			if (this.input.keyboard.isDown(Phaser.KeyCode.P)) {
				this.openLeaderboards();
			}
		}
	},

	startGame: function (pointer) {

		if (!this.music.isDecoded) 
			this.music.destroy();
		else
			this.game.add.tween(this.music).to({volume:0}, 300).start()
		TransitionToState('Game', this.stage);

	},
	openLeaderboards: function (pointer) {
		this.leaderboards.visible = true;
		this.leaderboards.popup.visible = true;
		this.leaderboards.y = this.game.height * .5;

		this.leaderboards.loading.visible = true;
		this.leaderboards.hiscoretable.alpha = 0.0;

    var self = this;

    var leaderboards = this.leaderboards;
    getScores(function(scores) {
      self.leaderboards.setScores(scores);
      self.leaderboards.loading.visible = false;
      self.game.add.tween(self.leaderboards.hiscoretable).to({alpha:1},300).start();
    }, function(err) {
    });

		/*
		//var t = this.game.add.tween(this.leaderboards.position).to( {y:this.leaderboards.getBounds().height + 80}, 700, Phaser.Easing.Circular.InOut, true, 0);
		var t = this.game.add.tween(this.leaderboards.position).to( {y:this.game.height * .5 - this.leaderboards.popup.getBounds().height * .25}, 700, Phaser.Easing.Circular.Out, true, 0);
		t.onStart.add(function(target,tween,popup) {
			//popup.y = popup.getBounds().height + tween.game.height + 1;
			popup.visible = true;
		}, this, 0, this.leaderboards);
		*/
	},
	closeLeaderboards: function(pointer) {
		var t = this.game.add.tween(this.leaderboards.scale).to( {x:0,y:0}, 200, Phaser.Easing.Circular.Out, true, 0);
		t.onComplete.add(function(target, tween, popup){ 
	        popup.visible = false;
	    }, this, 0, this.leaderboards);
	},
	openUrl: function(pointer) {
		window.open("http://www.google.com", "_blank");
	},
	onPlayButtonOver: function(pointer) {
		this.leaderboards.playButton.getChildAt(1).tint = 0xFFFFFF;
	},
	onPlayButtonOut: function(pointer) {
		this.leaderboards.playButton.getChildAt(1).tint = 0x990AE3;
	},
	onGameResized: function () {
		//this.scale.refresh();
		/*var newSize = getGameSize();
		this.game.scale.setupScale(newSize.x,newSize.y);
		this.game.scale.refresh();
		var w = this.game.width;
		var h = this.game.height;
		console.log("onGameResized " + w + "x" + h);
		*/


		//this.button_start.x = this.game.width * .5;
		//this.button_start.y = this.game.height * 0.61;
        //this.button_hiscores.x = this.game.width - this.button_hiscores.width * .5 - 10;
        //this.button_hiscores.y = this.game.height - this.button_hiscores.height * .5 - 10;
        //this.footer.x = w * .5;
        //this.footer.y = h;

        //this.leaderboards.x = this.game.width * .5;
        //this.leaderboards.y = clamp(this.leaderboards.y, -99999,this.game.height);
        this.footer.position.set(this.game.width * .5,this.game.height);
    }


};
