
BasicGame.MainMenu = function (game) {

	this.music = null;
	this.sprite_title = null;
	this.playButton = null;
	this.sprite_airplane = null;

};

BasicGame.MainMenu.prototype = {

	create: function () {

		/*this.music = this.add.audio('titleMusic');
		this.music.play();*/

		var bg = this.add.image(0, 0, 'mainmenu_bg');
		bg.width = this.game.width;
		bg.height = this.game.height;

		this.sprite_airplane = this.add.image(this.game.width * .5, this.game.height * .5, 'mainmenu_plane');
		this.sprite_airplane.anchor.set(0.5,0.5);

		this.sprite_title = this.add.image(this.game.width * .5, this.game.height * .3, 'mainmenu_title').anchor.set(0.5,0.5);

		this.playButton = this.add.button(this.game.width * .5, this.game.height - 50, 'mainmenu_startbutton', this.startGame, this).anchor.set(0.5,0.5);

        this.scale.setResizeCallback(this.gameResized, this);
        this.gameResized();

	},

	update: function () {

		//	Do some nice funky main menu effect here
		this.sprite_airplane.y = this.game.height * .5 + Math.sin(this.game.time.time * 0.0015) * 10;

	},

	startGame: function (pointer) {

		//	Ok, the Play Button has been clicked or touched, so let's stop the music (otherwise it'll carry on playing)
		//this.music.stop();

		//	And start the actual game
		this.state.start('Game');

	},

	gameResized: function () {
		//this.scale.refresh();
		var w = this.game.width;
		var h = this.game.height;
		//console.log("gameResized " + w + "x" + h);
		
    }

};
