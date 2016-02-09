
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

        this.footer = this.game.add.button(this.game.width * .5,this.game.height,'mainmenu_footer',this.openUrl, this);
        this.footer.anchor.set(0.5,1);

        // leaderboards popup
        /*
        this.leaderboardsDrag = new Phaser.Sprite(this.game, 0, 0, 'mainmenu_cloud');
        this.leaderboardsDrag.width = game.width;
        this.leaderboardsDrag.height = game.height;
        this.leaderboardsDrag.alpha = 0.5;
        this.leaderboardsDrag.inputEnabled = true;
        this.leaderboardsDrag.input.enableDrag();
        this.leaderboardsDrag.events.onDragStart.add(this.onLeaderboardDragStart);
        this.leaderboardsDrag.events.onDragUpdate.add(this.onLeaderboardDrag);
        this.leaderboardsDrag.events.onDragStop.add(this.onLeaderboardDragStop);
        this.game.add.existing(this.leaderboardsDrag);
        */

        this.leaderboards = this.game.add.group();
        this.leaderboards.x = this.game.width * .5;
        
        var listheight = 150 + 15 * 63 + 30;
        var listwidth = 850;

        this.leaderboards.bg = this.game.add.graphics(0,0, this.leaderboards);
        this.leaderboards.bg.beginFill(0xF2F2F2, 1.0);
        this.leaderboards.bg.drawRect(-listwidth * .5,-listheight,listwidth, listheight);
        this.leaderboards.bg.endFill();
        this.leaderboards.table = this.leaderboards.add(new Phaser.Group(this.game));
        
        this.leaderboards.hiscorelines = [];
        for (var i = 0; i < 15; i++) {
            var y = -1055 + 20 + 63 * i;
            this.leaderboards.hiscorelines[i] = this.leaderboards.table.add(new Phaser.Group(this.game));
            this.leaderboards.hiscorelines[i].num = new Phaser.Text(this.game, -314, y, "0"+(i+1), { font: "40px Pebble", fill: "#000000", align: "right"});
            this.leaderboards.hiscorelines[i].num.anchor.set(1,1);
            this.leaderboards.hiscorelines[i].name = new Phaser.Text(this.game, -292, y, "ASDFG", { font: "40px Pebble", fill: "#000000", align: "left"});
            this.leaderboards.hiscorelines[i].name.anchor.set(0,1);
            this.leaderboards.hiscorelines[i].points = new Phaser.Text(this.game, 351, y, "1234", { font: "40px Pebble", fill: "#000000", align: "left"});
            this.leaderboards.hiscorelines[i].points.anchor.set(1,1);
            this.leaderboards.table.add(this.leaderboards.hiscorelines[i].num);
            this.leaderboards.table.add(this.leaderboards.hiscorelines[i].name);
            this.leaderboards.table.add(this.leaderboards.hiscorelines[i].points);
            if (i < 14) {
	            this.leaderboards.hiscorelines[i].separator = new Phaser.Image(this.game, 0, y + 4, 'leaderboards_separator');
	            this.leaderboards.hiscorelines[i].separator.anchor.set(0.5,0.5);
	            this.leaderboards.table.add(this.leaderboards.hiscorelines[i].separator);
	        }
        };

        
        var top = new Phaser.Image(this.game,0,-listheight + 1,'leaderboards_top');
        top.anchor.set(0.5,1);
        this.leaderboards.add(top);

        this.leaderboards.playButton = this.leaderboards.add(ButtonWithTextOver(this,0,-91,'PLAY AGAIN', 'button_leaderboards', 'button_leaderboards_over', 12, '#FFFFFF', this.startGame));
        this.leaderboards.playButton.getChildAt(0).onInputOver.add(this.onPlayButtonOver, this);
        this.leaderboards.playButton.getChildAt(0).onInputOut.add(this.onPlayButtonOut, this);
        this.onPlayButtonOut(); // set text color

        var close = new Phaser.Button(this.game,listwidth * .5 + 3,-listheight-top.height-10,'leaderboards_close');
        close.anchor.set(1,1);
        close.onInputDown.add(this.closeLeaderboards,this);
        this.leaderboards.add(close);
		
        this.leaderboards.visible = false;

        this.scale.setResizeCallback(this.gameResized, this);
        this.gameResized();

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

		this.img_title.x = this.game.width * .5;
		this.img_title.y = this.game.height * .33;
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
		this.leaderboards.y = this.leaderboards.getBounds().height + 1;
		//var t = this.game.add.tween(this.leaderboards.position).to( {y:this.leaderboards.getBounds().height + 80}, 700, Phaser.Easing.Circular.InOut, true, 0);
		var t = this.game.add.tween(this.leaderboards.position).to( {y:this.game.height}, 700, Phaser.Easing.Circular.InOut, true, 0);
		t.onStart.add(function(target,tween,popup) {
			//popup.y = popup.getBounds().height + tween.game.height + 1;
			popup.visible = true;
		}, this, 0, this.leaderboards);
	},
	closeLeaderboards: function(pointer) {
		var t = this.game.add.tween(this.leaderboards.position).to( {y:this.leaderboards.getBounds().height + this.game.height + 20}, 700, Phaser.Easing.Circular.InOut, true, 0);
		t.onComplete.add(function(target, tween, popup){ 
	        popup.visible = false;
	    }, this, 0, this.leaderboards);
	},
	onLeaderboardDragStart: function(sprite, pointer) {
		var context = pointer.game.state.getCurrentState();
		//context._dragStartY = context.leaderboards.dragButton.y;
		context._dragStartPos = context.leaderboards.context.leaderboards.y;
		console.log('start');
	},
	onLeaderboardDrag: function(sprite, pointer) {
		var context = pointer.game.state.getCurrentState();
		if (!context.leaderboards.visible)
			return;
		context.leaderboardsDrag.x = 0;
		var dif = context.leaderboardsDrag.y - sprite.input.dragStartPoint.y;//context._dragStartY;

		context.leaderboards.y = context._dragStartPos + dif * (context.game.height / 1080);
        
		console.log('dragged ' + dif );
	},
	onLeaderboardDragStop: function(sprite, pointer) {
		var context = pointer.game.state.getCurrentState();
		context.leaderboardsDrag.x = 0;
        context.leaderboardsDrag.y = 0;
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
	gameResized: function () {
		//this.scale.refresh();
		var w = this.game.width;
		var h = this.game.height;
		//console.log("gameResized " + w + "x" + h);

		//this.button_start.x = this.game.width * .5;
		//this.button_start.y = this.game.height * 0.61;
        //this.button_hiscores.x = this.game.width - this.button_hiscores.width * .5 - 10;
        //this.button_hiscores.y = this.game.height - this.button_hiscores.height * .5 - 10;
        this.footer.x = w * .5;
        this.footer.y = h;

        this.leaderboards.x = this.game.width * .5;
        this.leaderboards.y = clamp(this.leaderboards.y, -99999,this.game.height);
    }


};
