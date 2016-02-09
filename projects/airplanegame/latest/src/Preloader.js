
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

		this.preloadText = new Phaser.Text(this.game, this.game.width * .5, this.game.height * .5, "Loading...", { font: 55 + "px Helvetica", fill: '#ffffec', 'align': 'center' });
		this.preloadText.anchor.set(0.5,0.5);
		this.game.add.existing(this.preloadText);

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

		this.load.json('levels', '/src/levels.json');


		this.load.image('graphic_longbutton', 'images/graphic_longbutton.png');
		this.load.image('graphic_smallbutton', 'images/graphic_smallbutton.png');
		this.load.atlas('buttons', 'images/buttons.png', 'images/buttons.json');

		this.load.image('transition_bg', 'images/transition_bg.png');
		this.load.image('popupbg_corner', 'images/popupbg_corner.png');
		this.load.image('popupbg_top', 'images/popupbg_top.png');
		this.load.image('popupbg_fill', 'images/popupbg_fill.jpg');
		this.load.image('popupbg_side', 'images/popupbg_side.png');

		this.load.image('mainmenu_bg', 'images/mainmenu_bg.jpg');
		this.load.image('mainmenu_cloud', 'images/mainmenu_cloud.png');
		this.load.image('mainmenu_plane', 'images/mainmenu_plane.png');
		this.load.image('mainmenu_title', 'images/mainmenu_title.png');
		this.load.image('mainmenu_footer', 'images/mainmenu_footer.png');

		this.load.image('game_bg', 'images/game_bg.png');
		this.load.image('game_sky', 'images/game_sky.png');
		this.load.atlas('game_char1', 'images/game_char1.png', 'images/game_char1.json');
		this.load.atlas('game_char2', 'images/game_char2.png', 'images/game_char2.json');
		this.load.atlas('game_char3', 'images/game_char3.png', 'images/game_char3.json');
		this.load.atlas('game_char4', 'images/game_char4.png', 'images/game_char4.json');
		this.load.image('game_pupils', 'images/game_pupils.png');
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
		this.load.image('game_flash', 'images/game_flash.png');

		this.load.image('game_tutorialtext', 'images/game_tutorialtext.png');
		this.load.image('game_gratification1', 'images/game_gratification1.png');
		this.load.image('game_gratification2', 'images/game_gratification2.png');
		this.load.image('game_gratification3', 'images/game_gratification3.png');
		this.load.image('game_gratification4', 'images/game_gratification4.png');
		this.load.image('game_gratification5', 'images/game_gratification5.png');

		this.load.image('level_detailsbg', 'images/level_detailsbg.png');
		this.load.image('level_scorebarL', 'images/level_scorebarL.png');
		this.load.image('level_scorebarM', 'images/level_scorebarM.png');
		this.load.image('level_scorebarR', 'images/level_scorebarR.png');

		this.load.atlas('game_laptop', 'images/game_laptop.png', 'images/game_laptop.json');
		this.load.atlas('game_laptop2', 'images/game_laptop2.png', 'images/game_laptop2.json');
		this.load.atlas('game_cube', 'images/game_cube.png', 'images/game_cube.json');
		this.load.image('game_specialcontent', 'images/game_specialcontent.png');
		this.load.image('game_chairs2', 'images/game_chairs2.png');
		this.load.image('game_chairs3', 'images/game_chairs3.png');
		this.load.image('game_points10', 'images/game_points10.png');
		this.load.image('game_points20', 'images/game_points20.png');
		this.load.image('game_points50', 'images/game_points50.png');
		this.load.image('game_points100', 'images/game_points100.png');
		this.load.image('game_level', 'images/game_level.png');
		this.load.atlas('game_levelnumber', 'images/game_levelnumber.png', 'images/game_levelnumber.json');
		this.load.image('game_finger', 'images/game_finger.png');

		this.load.image('game_end_footer', 'images/game_end_footer.png');
		this.load.image('game_end_middle', 'images/game_end_middle.png');
		this.load.image('game_end_top_hiscore', 'images/game_end_top_hiscore.png');
		this.load.image('game_end_top_gameover', 'images/game_end_top_gameover.png');

		this.load.image('leaderboards_close', 'images/leaderboards_close.png');
		this.load.image('leaderboards_separator', 'images/leaderboards_separator.png');
		this.load.image('leaderboards_top', 'images/leaderboards_top.png');

		this.load.audio('gameLevel', ['audio/gameLevel.mp3', 'audio/gameLevel.ogg', 'audio/gameLevel.m4a']);
		this.load.audio('gameOver', ['audio/gameOver.mp3', 'audio/gameOver.ogg', 'audio/gameOver.m4a']);
		this.load.audio('highScore', ['audio/highScore.mp3', 'audio/highScore.ogg', 'audio/highScore.m4a']);
		this.load.audio('laptopOpen', ['audio/laptopOpen.mp3', 'audio/laptopOpen.ogg', 'audio/laptopOpen.m4a']);
		this.load.audio('negativePoint', ['audio/negativePoint.mp3', 'audio/negativePoint.ogg', 'audio/negativePoint.m4a']);
		this.load.audio('positivePoint', ['audio/positivePoint.mp3', 'audio/positivePoint.ogg', 'audio/positivePoint.m4a']);
		this.load.audio('level01', ['audio/level01.mp3', 'audio/level01.ogg', 'audio/level01.m4a']);
		this.load.audio('level02', ['audio/level02.mp3', 'audio/level02.ogg', 'audio/level02.m4a']);
		this.load.audio('level03', ['audio/level03.mp3', 'audio/level03.ogg', 'audio/level03.m4a']);
		this.load.audio('level04', ['audio/level04.mp3', 'audio/level04.ogg', 'audio/level04.m4a']);
		this.load.audio('level05', ['audio/level05.mp3', 'audio/level05.ogg', 'audio/level05.m4a']);
		this.load.audio('level06', ['audio/level06.mp3', 'audio/level06.ogg', 'audio/level06.m4a']);
		this.load.audio('startScreen', ['audio/startScreen.mp3', 'audio/startScreen.ogg', 'audio/startScreen.m4a']);

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


			BasicGame.leveldata = this.game.cache.getJSON('levels');

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

			if (this.game.device.desktop) {
				BasicGame.cursor = new Phaser.Image(this.game,this.game.width,this.game.height,'game_finger');
				BasicGame.cursor.anchor.set(0.13,0.09);
				this.stage.addChildAt(BasicGame.cursor,this.stage.children.length-1);

				BasicGame.cursor.visible = false;
			}
			
			TransitionToState('MainMenu', this.stage);
		}

	}

};
