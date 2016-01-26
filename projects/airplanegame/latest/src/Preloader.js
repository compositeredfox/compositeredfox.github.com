
BasicGame.Preloader = function (game) {

	this.background = null;
	this.preloadBar = null;
	this.preloadText = null;

	this.ready = false;

};

BasicGame.Preloader.prototype = {

	preload: function () {

		//	These are the assets we loaded in Boot.js
		//	A nice sparkly background and a loading progress bar
		this.background = this.add.sprite(0, 0, 'preloaderBackground');
		this.background.width = this.game.width;
		this.background.height = this.game.height;

		this.preloadText = this.game.add.existing(Label(this, this.game.width * .5, this.game.height * .5, "Loading...", 55, "#ffffec", 'center')); //TODO: localize

		/*
		this.preloadBar = this.add.sprite(0, 0, 'preloaderBar');
		this.preloadBar.anchor.x = this.preloadBar.anchor.y = 0.5;
		this.preloadBar.x = this.game.width * .5;
		this.preloadBar.y = this.game.height * .5 + 150;
		//	This sets the preloadBar sprite as a loader sprite.
		//	What that does is automatically crop the sprite from 0 to full-width
		//	as the files below are loaded in.
		//this.load.setPreloadSprite(this.preloadBar);
		*/

		

		this.load.image('graphic_longbutton', 'images/graphic_longbutton.png');
		this.load.image('graphic_smallbutton', 'images/graphic_smallbutton.png');

		this.load.image('mainmenu_bg', 'images/mainmenu_bg.jpg');
		this.load.image('mainmenu_cloud', 'images/mainmenu_cloud.png');
		this.load.image('mainmenu_plane', 'images/mainmenu_plane.png');
		this.load.image('mainmenu_title', 'images/mainmenu_title.png');

		this.load.image('game_bg', 'images/game_bg.png');
		this.load.image('game_characters', 'images/game_characters.png');
		this.load.image('game_chars1_1', 'images/game_chars1_1.png');
		this.load.image('game_chars1_2', 'images/game_chars1_2.png');
		this.load.image('game_chars1_3', 'images/game_chars1_3.png');
		this.load.image('game_chars1_4', 'images/game_chars1_4.png');
		this.load.image('game_chars2_1', 'images/game_chars2_1.png');
		this.load.image('game_chars2_2', 'images/game_chars2_2.png');
		this.load.image('game_chars2_3', 'images/game_chars2_3.png');
		this.load.image('game_chars2_4', 'images/game_chars2_4.png');
		this.load.atlas('game_laptop', 'images/game_laptop.png', 'images/game_laptop.json');
		this.load.image('game_damagebar_bg', 'images/game_damagebar_bg.png');
		this.load.image('game_damagebar_fill', 'images/game_damagebar_fill.png');
		this.load.image('game_damagebar_mask', 'images/game_damagebar_mask.png');
		this.load.image('game_row1', 'images/game_row1.png');
		this.load.image('game_row2', 'images/game_row2.png');

		/*
		this.load.atlas('playButton', 'images/play_button.png', 'images/play_button.json');
		this.load.audio('titleMusic', ['audio/main_menu.mp3']);
		this.load.bitmapFont('caslon', 'fonts/caslon.png', 'fonts/caslon.xml');
		*/
		

	},

	create: function () {

		//	Once the load has finished we disable the crop because we're going to sit in the update loop for a short while as the music decodes
		//this.preloadBar.cropEnabled = false;
	},

	update: function () {

		//	You don't actually need to do this, but I find it gives a much smoother game experience.
		//	Basically it will wait for our audio file to be decoded before proceeding to the MainMenu.
		//	You can jump right into the menu if you want and still play the music, but you'll have a few
		//	seconds of delay while the mp3 decodes - so if you need your music to be in-sync with your menu
		//	it's best to wait for it to decode here first, then carry on.
		
		//	If you don't have any music in your game then put the game.state.start line into the create function and delete
		//	the update function completely.
		/*
		if (this.cache.isSoundDecoded('titleMusic') && this.ready == false)
		{
			this.ready = true;
			this.state.start('MainMenu');
		}
		*/

		this.preloadText.scale.x = this.preloadText.scale.y = 1 + Math.sin(this.game.time.time * 0.003) * 0.08;

		if(this.ready == false)
		{
			this.ready = true;
			this.state.start('MainMenu');
		}

	}

};
