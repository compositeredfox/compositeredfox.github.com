
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

        this.game.add.existing(Label(this, this.game.width * .5, this.game.height * .3, "Game Title", 64, "#ffffec", 'center')); //TODO: localize

        this.game.add.existing(ButtonWithText(this, this.game.width * .5, this.game.height - 80, "Start", 'graphic_longbutton', 15, "#ffffff", this.startGame)); //TODO: localize
        this.game.add.existing(ButtonWithText(this, this.game.width - 40, this.game.height - 30, "High Scores", 'graphic_smallbutton', 12, "#ffffff", this.openLeaderboards)); //TODO: localize

        this.scale.setResizeCallback(this.gameResized, this);
        this.gameResized();

	},

	update: function () {

		//	Do some nice funky main menu effect here
		this.sprite_airplane.y = this.game.height * .7 + Math.sin(this.game.time.time * 0.0015) * 10;

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

	},

	startGame: function (pointer) {

		//	Ok, the Play Button has been clicked or touched, so let's stop the music (otherwise it'll carry on playing)
		//this.music.stop();

		//	And start the actual game
		this.state.start('Game');

	},
	openLeaderboards: function (pointer) {
		this.state.start('Leaderboard');

	},

	gameResized: function () {
		//this.scale.refresh();
		var w = this.game.width;
		var h = this.game.height;
		//console.log("gameResized " + w + "x" + h);
		
    }

};
