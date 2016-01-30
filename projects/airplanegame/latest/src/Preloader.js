
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

		this.load.image('transition_bg', 'images/transition_bg.png');
		this.load.image('popupbg_corner', 'images/popupbg_corner.png');
		this.load.image('popupbg_top', 'images/popupbg_top.png');
		this.load.image('popupbg_fill', 'images/popupbg_fill.jpg');
		this.load.image('popupbg_side', 'images/popupbg_side.png');

		this.load.image('mainmenu_bg', 'images/mainmenu_bg.jpg');
		this.load.image('mainmenu_cloud', 'images/mainmenu_cloud.png');
		this.load.image('mainmenu_plane', 'images/mainmenu_plane.png');
		this.load.image('mainmenu_title', 'images/mainmenu_title.png');

		this.load.image('game_bg', 'images/game_bg.png');
		this.load.image('game_sky', 'images/game_sky.png');
		this.load.atlas('game_char1', 'images/game_char1.png', 'images/game_char1.json');
		this.load.atlas('game_char2', 'images/game_char2.png', 'images/game_char2.json');
		this.load.atlas('game_char3', 'images/game_char3.png', 'images/game_char3.json');
		this.load.atlas('game_char4', 'images/game_char4.png', 'images/game_char4.json');
		this.load.atlas('game_cloud1', 'images/game_cloud1.png', 'images/game_cloud1.json');
		this.load.atlas('game_cloud2', 'images/game_cloud2.png', 'images/game_cloud2.json');
		this.load.image('game_row2_char4', 'images/game_row2_char4.png');
		this.load.image('game_row2_char3', 'images/game_row2_char3.png');
		this.load.image('game_row2_char2', 'images/game_row2_char2.png');
		this.load.image('game_row2_char1', 'images/game_row2_char1.png');
		this.load.image('game_row1_char4', 'images/game_row1_char4.png');
		this.load.image('game_row1_char3', 'images/game_row1_char3.png');
		this.load.image('game_row1_char2', 'images/game_row1_char2.png');
		this.load.image('game_row1_char1', 'images/game_row1_char1.png');

		this.load.atlas('game_laptop', 'images/game_laptop.png', 'images/game_laptop.json');
		this.load.image('game_damagebar_bg', 'images/game_damagebar_bg.png');
		this.load.image('game_damagebar_fill', 'images/game_damagebar_fill.png');
		this.load.image('game_damagebar_mask', 'images/game_damagebar_mask.png');
		this.load.image('game_chairs2', 'images/game_chairs2.png');
		this.load.image('game_chairs3', 'images/game_chairs3.png');
		this.load.image('game_score10', 'images/game_score10.png');
		this.load.image('game_score50', 'images/game_score50.png');
		this.load.image('game_particle_secrets1', 'images/game_particle_secrets1.png');
		this.load.image('game_particle_secrets2', 'images/game_particle_secrets2.png');
		this.load.image('game_particle_secrets3', 'images/game_particle_secrets3.png');
		this.load.image('game_particle_secrets4', 'images/game_particle_secrets4.png');

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


			// create transition
			BasicGame.transition = new Phaser.Group(this.game);
			BasicGame.transition.bg = new Phaser.Image(this.game,0,0,'transition_bg');
			//BasicGame.transition.bg.width = this.game.width;
			//BasicGame.transition.bg.height = this.game.height;
			//BasicGame.transition.bg.anchor.set(0.5,0.5);
			BasicGame.transition.bg.anchor.set(0,0);
			BasicGame.transition.bg.position.set(0,0);
			BasicGame.transition.add(BasicGame.transition.bg);
			/*
			BasicGame.transition.mask = new Phaser.Graphics(this.game);
			BasicGame.transition.mask.beginFill(0xFFFFFF);
			BasicGame.transition.mask.drawCircle(0,0, 100);
			BasicGame.transition.mask.endFill();
			BasicGame.transition.bg.mask = BasicGame.transition.mask;
			BasicGame.transition.add(BasicGame.transition.mask);
			*/
			BasicGame.transition.visible = false;
			
			TransitionToState('MainMenu', this.stage);
		}

	}

};
