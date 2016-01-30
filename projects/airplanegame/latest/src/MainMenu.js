
BasicGame.MainMenu = function (game) {

	this.music = null;
	this.sprite_title = null;
	this.sprite_airplane = null;
	this.playButton = null;

	this.clouds = [];

};

BasicGame.MainMenu.prototype = {

	create: function () {

		/*this.music = this.add.audio('titleMusic');
		this.music.play();*/

		var bg = this.add.image(0, 0, 'mainmenu_bg');
		bg.width = this.game.width;
		bg.height = this.game.height;

		this.clouds[0] = this.add.image(this.game.width * .8, this.game.height * (0.05 + Math.random() * 0.3), 'mainmenu_cloud');
		this.clouds[1] = this.add.image(this.game.width * .2, this.game.height * (0.55 + Math.random() * 0.3), 'mainmenu_cloud');

		this.sprite_airplane = this.add.image(this.game.width * .25, this.game.height * .6, 'mainmenu_plane');
		this.sprite_airplane.anchor.set(0.5,0.5);

		//this.sprite_title = this.add.image(this.game.width * .5, this.game.height * .3, 'mainmenu_title').anchor.set(0.5,0.5);

        var title = Label(this, this.game.width * .5, this.game.height * .3, "Game Title", 136, "#a049d5", 'center'); //TODO: localize
        title.setShadow(0,0,'rgba(0,0,0,0.12)',10);
        this.game.add.existing(title);

        this.button_start = this.game.add.existing(ButtonWithText(this, this.game.width * .5, this.game.height * 0.65, "- Start -", 'graphic_longbutton', 32, "#ffffcc", this.startGame)); //TODO: localize
        this.button_hiscores = this.game.add.existing(ButtonWithText(this, this.game.width - 90, this.game.height - 30, "- High Scores -", 'graphic_smallbutton', 24, "#ffffff", this.openLeaderboards)); //TODO: localize
        this.button_hiscores.alpha = 0.7;

        this.scale.setResizeCallback(this.gameResized, this);
        this.gameResized();

	},

	update: function () {

		//	Do some nice funky main menu effect here
		this.sprite_airplane.y = this.game.height * .85 + Math.sin(this.game.time.time * 0.0015) * 10;

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

	},

	startGame: function (pointer) {

		//	Ok, the Play Button has been clicked or touched, so let's stop the music (otherwise it'll carry on playing)
		//this.music.stop();

		//	And start the actual game
		//this.state.start('Game');
		TransitionToState('Game', this.stage);

	},
	openLeaderboards: function (pointer) {
		TransitionToState('Leaderboard', this.stage);

	},

	gameResized: function () {
		//this.scale.refresh();
		var w = this.game.width;
		var h = this.game.height;
		//console.log("gameResized " + w + "x" + h);

		this.button_start.x = this.game.width * .5;
		this.button_start.y = this.game.height * 0.65;
        this.button_hiscores.x = this.game.width - this.button_hiscores.width * .5 - 10;
        this.button_hiscores.y = this.game.height - this.button_hiscores.height * .5 - 10;
		
    }

};
