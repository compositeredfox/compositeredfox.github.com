var fakeScores = {
   "1": {
      "id": "1000",
      "name": "Able",
      "points": "3213"
   },
   "3": {
      "id": "1000",
      "name": "Christie",
      "points": "1500"
   },
   "2": {
      "id": "1000",
      "name": "Betty",
      "points": "2001"
   },
   "4": {
      "id": "1000",
      "name": "Darius",
      "points": "500"
   },
};


BasicGame.Game = function (game) {

	//	When a State is added to Phaser it automatically has the following properties set on it, even if they already exist:

    this.game;		//	a reference to the currently running game
    this.add;		//	used to add sprites, text, groups, etc
    this.camera;	//	a reference to the game camera
    this.cache;		//	the game cache
    this.input;		//	the global input manager (you can access this.input.keyboard, this.input.mouse, as well from it)
    this.load;		//	for preloading assets
    this.math;		//	lots of useful common math operations
    this.sound;		//	the sound manager - add a sound, play one, set-up markers, etc
    this.stage;		//	the game stage
    this.time;		//	the clock
    this.tweens;	//	the tween manager
    this.world;		//	the game world
    this.particles;	//	the particle manager
    this.physics;	//	the physics manager
    this.rnd;		//	the repeatable random number generator

    //	You can use any of these from any function within this State.
    //	But do consider them as being 'reserved words', i.e. don't create a property for your own game called "world" or you'll over-write the world reference.
    this.gameGroup = null;
    this.scoreText = null;
    this.progressText = null;
    this.pauseScreen = null;
    this.endGameScreen = null;
    this.levelText = null;
    this.sprites = {};
    this.music = null;

    this.laptops = [];
    this.damage = 0;
    this.health = 100;
    this.damageBar = {};
    this.score = 0;
    this.currentLevelNumber = 0;
    this.laptopsPressed = 0;
    this.turbulence = 0;

    this.playing = false;

    this.npcs = [
        { img: 'game_row1_char1', posLooking: {x:1171,y:283}, offsetOnIdle: {x:-1,y:68}, lookAt: 3, lookDelay: 0.55 },
        { img: 'game_row1_char2', posLooking: {x:1027,y:324}, offsetOnIdle: {x:-5,y:73}, lookAt: 2, lookDelay: 0.55 },
        { img: 'game_row1_char3', posLooking: {x:870,y:409}, offsetOnIdle: {x:-85,y:12}, lookAt: 1, lookDelay: 0.55 },
        { img: 'game_row1_char4', posLooking: {x:615,y:293}, offsetOnIdle: {x:-7,y:69}, lookAt: 0, lookDelay: 0.55 },
        { img: 'game_row2_char1', posLooking: {x:1206,y:379}, offsetOnIdle: {x:-8,y:54}, lookAt: 3, lookDelay: 0.25 },
        { img: 'game_row2_char2', posLooking: {x:933,y:447}, offsetOnIdle: {x:89,y:-23}, lookAt: 2, lookDelay: 0.25 },
        { img: 'game_row2_char3', posLooking: {x:761,y:354}, offsetOnIdle: {x:-7,y:76}, lookAt: 1, lookDelay: 0.25 },
        { img: 'game_row2_char4', posLooking: {x:548, y:358}, offsetOnIdle: {x:4,y:71}, lookAt: 0, lookDelay: 0.25 }
    ];
    /*
    // level
    this.config_defaults = {
        laptop_min_open_delay: 2, // minimum time a laptop stays closed
        laptop_max_open_delay: 5, // maximum time a laptop stays closed
        damage_speed: 1, // laptop damage when open, in units per second
        max_concurrent_laptops: 4,

        laptops_goal: 10, // how many laptops to close for the level to be complete

        laptop_specialcontentchance: 0.25
    };
    this.config_levels = [
        { laptops_goal: 5, laptop_min_open_delay: 2, laptop_max_open_delay: 5, total_health: 30, damage_speed: 0.5, max_concurrent_laptops:1 },
        { laptops_goal: 10, laptop_min_open_delay: 1, laptop_max_open_delay: 2, total_health: 15, damage_speed: 0.6, max_concurrent_laptops:2 },
        { laptops_goal: 20, laptop_min_open_delay: 0.2, laptop_max_open_delay: 0.4, total_health: 15, damage_speed: 0.4, max_concurrent_laptops:4 },
        { laptops_goal: 20, laptop_min_open_delay: 0.2, laptop_max_open_delay: 0.4, total_health: 15, damage_speed: 0.4, max_concurrent_laptops:4 },
        { laptops_goal: 20, laptop_min_open_delay: 0.2, laptop_max_open_delay: 0.4, total_health: 15, damage_speed: 0.4, max_concurrent_laptops:4 },
        { laptops_goal: 20, laptop_min_open_delay: 0.2, laptop_max_open_delay: 0.4, total_health: 15, damage_speed: 0.4, max_concurrent_laptops:4 },
        { laptops_goal: 20, laptop_min_open_delay: 0.2, laptop_max_open_delay: 0.4, total_health: 15, damage_speed: 0.4, max_concurrent_laptops:4 },
        { laptops_goal: 20, laptop_min_open_delay: 0.2, laptop_max_open_delay: 0.4, total_health: 15, damage_speed: 0.4, max_concurrent_laptops:4 },
        { laptops_goal: 20, laptop_min_open_delay: 0.2, laptop_max_open_delay: 0.4, total_health: 15, damage_speed: 0.4, max_concurrent_laptops:4 },
        { laptops_goal: 20, laptop_min_open_delay: 0.2, laptop_max_open_delay: 0.4, total_health: 15, damage_speed: 0.4, max_concurrent_laptops:4 }
    ];
    */

};

BasicGame.Game.prototype = {



	create: function () {

        this.resetState();

        var w = this.game.width;
        var h = this.game.height;


        this.game.physics.startSystem(Phaser.Physics.ARCADE);

        this.gameGroup = this.game.add.group();
        this.uiGroup = this.game.add.group();
        this.uiGroup.fixedToCamera = true;

        var sky = this.gameGroup.add(new Phaser.Image(this.game,0,0,'game_sky'));
        sky.width = 1920;
        sky.height = 1080;

        var cloud1 = this.gameGroup.add(new Phaser.Sprite(this.game,227,506,'game_cloud1'));
        cloud1.animations.add('idle',[0,0,0,0,0,0,0,0,0,0,0,0,1,2,3,4,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,2,3,4,0,0,0,0,0,0,0], 6, true);
        cloud1.play('idle');

        var cloud2 = this.gameGroup.add(new Phaser.Sprite(this.game,1411,430,'game_cloud2'));
        cloud2.animations.add('idle',[0,0,0,1,2,3,4,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,2,3,4,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0], 6 , true);
        cloud2.play('idle');

        this.gameGroup.add(new Phaser.Image(this.game, 0,0,'game_bg'));

        for(var i=0; i < 4; i++) { this.npcs[i].sprite = this.gameGroup.add(new Phaser.Image(this.game, this.npcs[i].posLooking.x + this.npcs[i].offsetOnIdle.x,this.npcs[i].posLooking.y + this.npcs[i].offsetOnIdle.y,this.npcs[i].img)); }

        this.gameGroup.add(new Phaser.Image(this.game, 567,415,'game_chairs2'));

        for(var i=4; i < 8; i++) { this.npcs[i].sprite = this.gameGroup.add(new Phaser.Image(this.game, this.npcs[i].posLooking.x + this.npcs[i].offsetOnIdle.x,this.npcs[i].posLooking.y + this.npcs[i].offsetOnIdle.y,this.npcs[i].img)); }

        this.npcs[7].flashImg = this.npcs[7].sprite.addChild(new Phaser.Image(this.game, 0, 0, 'game_flash'));
        this.npcs[7].flashImg.anchor.set(0.49,0.584577114);
        this.npcs[7].flashImg.position.set(65,90);
        this.npcs[7].flashImg.scale.set(0.9,0.9);
        this.npcs[7].flashImg.visible = false;

        this.gameGroup.add(new Phaser.Image(this.game, 483,463,'game_chairs3'));

        var gameAreaClicker = this.gameGroup.add(new Phaser.Button(this.game,0,0,''));
        gameAreaClicker.width = 1920;
        gameAreaClicker.height = 1080;
        gameAreaClicker.texture.baseTexture.skipRender = false;
        gameAreaClicker.onInputDown.add(this.onHitGameArea, this);

        var group_characters = this.gameGroup.add(new Phaser.Group(this.game));
        this.group_laptops = this.gameGroup.add(new Phaser.Group(this.game));
        this.group_collisions = this.gameGroup.add(new Phaser.Group(this.game));

        laptops = this.laptops;
        var laptops_positions = [
            { x: 408, y: 603 },
            { x: 630, y: 615 },
            { x: 1067, y: 618 },
            { x: 1289, y: 616 }
        ];
        var characters_positions = [
            { x: 493, y: 561 },
            { x: 661, y: 484 },
            { x: 1070, y: 553 },
            { x: 1265, y: 442 }
        ];
        var characters_frames = [
            [0,0,0,0,0,0,1,2,3,4,5,0,0,0,0,0],
            [0,0,1,2,3,4,5,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0,1,2,3,4,5,0],
            [2,3,4,5,0,0,0,0,0,0,0,0,0,0,0,1]
        ]
        for (var i = 0; i < 4; i++) {
            laptops[i] = {};
            laptops[i].index = i;
            
            laptops[i].character = new Phaser.Sprite(this.game,characters_positions[i].x,characters_positions[i].y,'game_char' + (i+1));
            laptops[i].character.animations.add('idle', characters_frames[i], 5, true);
            laptops[i].character.play('idle');

            group_characters.add(laptops[i].character);

            laptops[i].particles_secrets = new Phaser.Particles.Arcade.Emitter(this.game,0,0,50);
            laptops[i].particles_secrets.makeParticles('game_cube',[0,1,2,3,4,5,6,7],50,true,false);
            laptops[i].particles_secrets.setSize(40,30);
            laptops[i].particles_secrets.particleAnchor.set(0.5,0.5);
            laptops[i].particles_secrets.minParticleSpeed.setTo(-150, -300);
            laptops[i].particles_secrets.maxParticleSpeed.setTo(150, -400);
            laptops[i].particles_secrets.minParticleScale = 0.8;
            laptops[i].particles_secrets.maxParticleScale = 0.8;
            laptops[i].particles_secrets.bounce.setTo(0.9,0.9);
            laptops[i].particles_secrets.setRotation(-80,80);
            laptops[i].particles_secrets.gravity = 800;
            laptops[i].particles_secrets.start(false, 1400, 320);
            laptops[i].particles_secrets.on = false;
            laptops[i].particles_secrets.x = laptops_positions[i].x + 90;
            laptops[i].particles_secrets.y = laptops_positions[i].y + 70;
            this.group_laptops.add(laptops[i].particles_secrets);

            laptops[i].particles_secrets_special = new Phaser.Particles.Arcade.Emitter(this.game,0,0,30);
            laptops[i].particles_secrets_special.makeParticles('game_specialcontent',0,30,true,false);
            laptops[i].particles_secrets_special.setSize(40,30);
            laptops[i].particles_secrets_special.particleAnchor.set(0.5,0.5);
            laptops[i].particles_secrets_special.minParticleSpeed.setTo(-150, -300);
            laptops[i].particles_secrets_special.maxParticleSpeed.setTo(150, -400);
            laptops[i].particles_secrets_special.minParticleScale = 0.33;
            laptops[i].particles_secrets_special.maxParticleScale = 0.33;
            laptops[i].particles_secrets_special.bounce.setTo(0.9,0.9);
            laptops[i].particles_secrets_special.setRotation(-80,80);
            laptops[i].particles_secrets_special.gravity = 800;
            laptops[i].particles_secrets_special.start(false, 1400, 320);
            laptops[i].particles_secrets_special.on = false;
            laptops[i].particles_secrets_special.x = laptops_positions[i].x + 90;
            laptops[i].particles_secrets_special.y = laptops_positions[i].y + 70;
            this.group_laptops.add(laptops[i].particles_secrets_special);

            var c = this.getInvisibleBody(laptops_positions[i].x + 50, laptops_positions[i].y + 75, 140, 40);
            c.x -= 40 * (i>=2?1:0);
            this.group_collisions.add(c);
            c.body.bounce.setTo(2,2);

            laptops[i].button = new Phaser.Button(this.game, laptops_positions[i].x,laptops_positions[i].y, (i == 0 || i == 3 ? 'game_laptop' : 'game_laptop2'));
            laptops[i].button.onInputDown.add(this.onHitLaptop, this, 0, laptops[i]);
            laptops[i].button.scale.x = (i>=2?-1:1);
            if (laptops[i].button.scale.x<0) laptops[i].button.anchor.set(1,0);
            this.group_laptops.add(laptops[i].button);
            laptops[i].openRatio = laptops[i].button.frame = 0;

            
        };
        laptops[1].button.moveUp();
        laptops[2].button.moveUp();
        laptops[2].button.moveUp();

        group_characters.add(new Phaser.Image(this.game, 516, 532, 'game_pupils'));

        // collision inside
        
        var inside = new Phaser.Rectangle(444, 0, 1017, 825);
        var walls = [
            new Phaser.Rectangle(0,0,1920 - inside.x - inside.width,inside.height),
            new Phaser.Rectangle(0,inside.height,1920,1080-inside.height),
            new Phaser.Rectangle(inside.x + inside.width,0,1920-inside.x-inside.width,inside.height)
        ];
        for (var i = 0; i < walls.length; i++) {
            this.group_collisions.add(this.getInvisibleBody(walls[i].x,walls[i].y,walls[i].width,walls[i].height));
        };

        // collision on laptops

        /// level details

        this.levelDetails = this.uiGroup.add(new Phaser.Group(this.game));
        this.levelDetails.position.set(this.game.width * .5, this.game.height);

        var levelDetailsBg = new Phaser.Image(this.game,0,0,'level_detailsbg');
        levelDetailsBg.anchor.set(0.5,1);
        this.levelDetails.add(levelDetailsBg);

        var style = { font: "40px Pebble", fill: "#000000", align: "right" };
        this.scoreText = new Phaser.Text(this.game, 384, -10, "00000", style);
        this.scoreText.anchor.set(1,1);
        this.levelDetails.add(this.scoreText);

        style = { font: "14px Helvetica", fill: "#000000", align: "left" };
        this.progressText = new Phaser.Text(this.game, 208, -16, "01 / 10", style);
        this.progressText.anchor.set(0,1);
        this.levelDetails.add(this.progressText);

        this.damageBarBg = UpdateProgressBar(this.game, 1, 0xf2f2f2, null);
        this.damageBar = UpdateProgressBar(this.game, 1, 0x32ff00, null);

        this.damageBarBg.group.position.set(-270,-50);
        this.damageBar.group.position.set(-270,-50);
        this.levelDetails.add(this.damageBarBg.group); //bg
        this.levelDetails.add(this.damageBar.group);
            
        // pause button

        //this.pauseButton = this.uiGroup.add(ButtonWithText(this,0,0, "- PAUSE -", 'graphic_smallbutton', 20, 0x000000, this.togglePause));
        //this.pauseButton.scale.set(0.8,0.8);
        //this.pauseButton.alpha = 0.8;
        this.pauseButton = this.uiGroup.add(new Phaser.Button(this.game,0,0,'button_pause_group',this.togglePause,this,'button_pause_over','button_pause','button_pause_over','button_pause'));
        this.pauseButton.anchor.set(0.5,0.5);
        this.pauseButton.x = this.game.width - this.pauseButton.width*.5 - 10;
        this.pauseButton.y = this.pauseButton.height*.5 + 10;

        this.levelNumberText = this.uiGroup.add(new Phaser.Group(this.game));
        this.levelNumberText.add(new Phaser.Image(this.game,-234 * .5,-65 * .5,'game_level'));
        this.levelNumberText.textSprite = new Phaser.Sprite(this.game,-234 * .5 + 205,-65 * .5,'game_levelnumber',0);
        this.levelNumberText.add(this.levelNumberText.textSprite);
        this.levelNumberText.scale.set(0,0);
        this.levelNumberText.visible = false;

        // Pause screen
        this.pauseScreen = this.uiGroup.add(new Phaser.Group(this.game));

        this.pauseScreen.blockerGraphic = this.game.add.graphics(0,0, this.pauseScreen);
        this.pauseScreen.blockerGraphic.beginFill("#000000", 0.6);
        this.pauseScreen.blockerGraphic.drawRect(0,0, this.game.width, this.game.height);
        this.pauseScreen.blockerGraphic.endFill();

        this.pauseScreen.blockerButton = new Phaser.Button(this.game,0,0,'');
        this.pauseScreen.blockerButton.width = this.pauseScreen.blockerGraphic.width;
        this.pauseScreen.blockerButton.height = this.pauseScreen.blockerGraphic.height;
        this.pauseScreen.blockerButton.onInputDown.add(this.togglePause, this);
        this.pauseScreen.add(this.pauseScreen.blockerButton);

        this.pauseScreen.popup = this.pauseScreen.add(new Phaser.Group(this.game));
        this.pauseScreen.popup.x = this.game.width * .5;
        this.pauseScreen.popup.y = this.game.height * .5;

        //this.pauseScreen.popup.add(MenuBackground(this.game, 0, 0, 500, 350));
        var pausebg = new Phaser.Image(this.game,0,0,'pause_bg');
        pausebg.anchor.set(0.5,0.5);
        this.pauseScreen.popup.add(pausebg);

        var l = Label(this,0, - 167, "PAUSED", 100, "#990AE3", 'center');
        this.pauseScreen.popup.add(l);
        this.pauseScreen.popup.add(ButtonWithTextOver(this,0, 30, "CONTINUE", 'button_endgame1_over', 'button_endgame1', 12, "#990AE3", this.togglePause));
        this.pauseScreen.popup.add(ButtonWithTextOver(this,0, 100, "QUIT", 'button_endgame1_over', 'button_endgame1', 12, "#990AE3", this.quitGame));

        this.pauseScreen.visible = false;

        // End Game

        this.endGameScreen = new Phaser.Group(this.game);

        //// blocker
        this.endGameScreen.blocker = this.endGameScreen.add(new Phaser.Group(this.game));
        g = this.game.add.graphics(0,0, this.endGameScreen.blocker);
        g.beginFill("#000000", 0.6);
        g.drawRect(0,0, this.game.width, this.game.height);
        g.endFill();

        b = new Phaser.Button(this.game,0,0,'');
        b.width = g.width;
        b.height = g.height;
        b.onInputDown.add(this.ignore, this);
        this.endGameScreen.blocker.add(b);

        this.endGameScreen.popup = this.endGameScreen.add(new Phaser.Group(this.game));
        //this.endGameScreen.popup.add(MenuBackground(this.game, 0, 0, 800, 660));
        
        this.endGameScreen.middle = this.endGameScreen.popup.add(new Phaser.Image(this.game,0,0,'game_end_middle'));
        this.endGameScreen.middle.anchor.set(0.5,1);

        this.endGameScreen.gameover_top = new Phaser.Image(this.game,0,-this.endGameScreen.middle.height,'game_end_top_gameover');
        this.endGameScreen.gameover_top.anchor.set(0.5,1);
        this.endGameScreen.popup.add(this.endGameScreen.gameover_top);

        this.endGameScreen.hiscore_top = new Phaser.Image(this.game,0,-this.endGameScreen.middle.height,'game_end_top_hiscore');
        this.endGameScreen.hiscore_top.anchor.set(0.5,1);
        this.endGameScreen.popup.add(this.endGameScreen.hiscore_top);

        this.endGameScreen.gameover_title = this.endGameScreen.popup.add(Label(this,-365,-498, "GAME OVER", 60, "#990AE3", 'left'));
        this.endGameScreen.gameover_title.anchor.set(0,0);

        this.endGameScreen.hiscore_title = this.endGameScreen.popup.add(Label(this,-365,-498, "NEW\nHIGH SCORE!", 60, "#990AE3", 'left'));
        this.endGameScreen.hiscore_title.lineSpacing = -15;
        this.endGameScreen.hiscore_title.anchor.set(0,0);

        /*
        this.endGameScreen.input = new Phaser.Text(this.game, 120, -105, "| YOUR NAME?   ", { font: "42px Arial", fill: "#ffffff", align: "right" });
        this.endGameScreen.input.anchor.set(1,0.5);
        this.endGameScreen.popup.add(this.endGameScreen.input);
        */

        this.endGameScreen.gameover_subtitle = this.endGameScreen.popup.add(Label(this,-365,-378 + 20, "YOUR SCORE", 40, "#000000", 'left'));
        this.endGameScreen.gameover_subtitle.anchor.set(0,1);
        this.endGameScreen.gameover_hiscore = this.endGameScreen.popup.add(Label(this, 350, -378 + 20, "13243", 40, "#000000", 'right'));
        this.endGameScreen.gameover_hiscore.anchor.set(1,1);
        this.endGameScreen.gameover_hiscorep = this.endGameScreen.popup.add(new Phaser.Text(this.game, 355, -384, "p", { font: "14px Helvetica", fill: "#000000", align: "left"}));
        
        this.endGameScreen.hiscoretable = this.endGameScreen.popup.add(new Phaser.Group(this.game));
        this.endGameScreen.hiscorelines = [];
        for (var i = 0; i < 3; i++) {
            var y = -268 + 20 + 63 * i;
            this.endGameScreen.hiscorelines[i] = this.endGameScreen.hiscoretable.add(new Phaser.Group(this.game));
            this.endGameScreen.hiscorelines[i].num = new Phaser.Text(this.game, -314, y, "0"+(i+1), { font: "40px Pebble", fill: "#000000", align: "right"});
            this.endGameScreen.hiscorelines[i].num.anchor.set(1,1);
            this.endGameScreen.hiscorelines[i].name = new Phaser.Text(this.game, -292, y, "", { font: "40px Pebble", fill: "#000000", align: "left"});
            this.endGameScreen.hiscorelines[i].name.anchor.set(0,1);
            this.endGameScreen.hiscorelines[i].points = new Phaser.Text(this.game, 351, y, "", { font: "40px Pebble", fill: "#000000", align: "right"});
            this.endGameScreen.hiscorelines[i].points.anchor.set(1,1);
            this.endGameScreen.hiscorelines[i].p = new Phaser.Text(this.game, 354, y, "p", { font: "16px Helvetica", fill: "#000000", align: "left"});
            this.endGameScreen.hiscorelines[i].p.anchor.set(0,1);

            this.endGameScreen.hiscoretable.add(this.endGameScreen.hiscorelines[i].num);
            this.endGameScreen.hiscoretable.add(this.endGameScreen.hiscorelines[i].name);
            this.endGameScreen.hiscoretable.add(this.endGameScreen.hiscorelines[i].points);
            this.endGameScreen.hiscoretable.add(this.endGameScreen.hiscorelines[i].p);

        };
        this.endGameScreen.button_hiscore = ButtonWithTextOver(this,-230, -66, "SEE HIGH SCORE BOARD", 'button_endgame1', 'button_endgame1_over', 12, "#990AE3", this.gotoHiscores);
        this.endGameScreen.popup.add(this.endGameScreen.button_hiscore);
        this.endGameScreen.button_restart = ButtonWithTextOver(this,230, -66, "PLAY AGAIN", 'button_endgame1', 'button_endgame1_over', 12, "#990AE3", this.restartGame);
        this.endGameScreen.popup.add(this.endGameScreen.button_restart);

        this.endGameScreen.loading = this.endGameScreen.popup.add(new Phaser.Image(this.game,0,-210, 'loading'));
        this.endGameScreen.loading.anchor.set(0.5,0.5);
        this.endGameScreen.loading.scale.set(0.4,0.4);
        
        this.endGameScreen.footer = this.endGameScreen.add(new Phaser.Group(this.game));
        this.endGameScreen.footer.bg = new Phaser.Image(this.game,0,0,'game_end_footer');
        this.endGameScreen.footer.bg.anchor.set(0.5,1);
        this.endGameScreen.footer.button = ButtonWithTextOver(this,232,-75,'VIEW OUR CODE OF CONDUCT', 'button_endgame_url', 'button_endgame_url_over', 12, "#FFFFFF", this.openWebsite);
        this.endGameScreen.footer.add(this.endGameScreen.footer.bg);
        this.endGameScreen.footer.add(this.endGameScreen.footer.button);
        
        this.endGameScreen.visible = false;
        //this.game.add.existing(this.endGameScreen);

        this.game.world.setBounds(-1920 * 2,-1080,1920*4,1080*2);
        this.camera.x = 300;
        this.camera.y = 300 - 55;

        UpdateGameCursor(this.game,true);

        this.game.input.keyboard.addCallbacks(this, this.onKeyDown);

        //document.getElementById("pause_continue").onclick = this.togglePause;
        //document.getElementById("pause_quit").onclick = this.quitGame;

        
        if (BasicGame.cheatCodes == true) {
            var b = this.uiGroup.add(ButtonWithText(this, 340, 30, "WIN WITH HI SCORE", 'graphic_smallbutton', 18, "#000000", function(){this.score=99999;this.onEndGame(true);}));
            b.scale.setTo(0.7,0.7);
            b = this.uiGroup.add(ButtonWithText(this, 550, 30, "WIN WITHOUT HI SCORE", 'graphic_smallbutton', 18, '#000000', function(){this.score=100;this.onEndGame(true);}));
            b.scale.setTo(0.7,0.7);
            b = this.uiGroup.add(ButtonWithText(this, 760, 30, "LOSE", 'graphic_smallbutton', 18, '#000000', function(){this.score=100;this.onEndGame(false);}));
            b.scale.setTo(0.7,0.7);
        }


        if (BasicGame.seenTutorial == true) {
            this.showingTutorial = false;
            this.startLevel(0, 900);
        } else {
            this.playing = true;
            this.showingTutorial = true;
            this.laptops[0].counter = -999;
            this.laptops[1].counter = -999;
            this.laptops[2].counter = -999;
            this.laptops[3].counter = -999;
            var delay = 0.0;

            // sign
            this.time.events.add(delay += Phaser.Timer.SECOND * 1, function() {
                this.tutorialText = new Phaser.Image(this.game,0,0,'game_tutorialtext');
                this.tutorialText.anchor.set(0.5,0.5);
                this.uiGroup.add(this.tutorialText);
                this.tutorialText.position.setTo(this.game.width * .5, this.game.height * .3);
                this.tutorialText.scale.setTo(0,0);
                var t = this.game.add.tween(this.tutorialText.scale);
                t.to( {x:1.25,y:1.25}, 1400, Phaser.Easing.Cubic.Out);
                t.start();
            }, this);
            // open laptop
            this.time.events.add(delay += Phaser.Timer.SECOND * 2.4, function() {
                console.log('open laptop');
                this.laptops[1].counter = 0;
                
            }, this);
            // cursor
            this.time.events.add(delay += Phaser.Timer.SECOND * 0.0, function() {
                console.log('cursor to close laptop');
                this.tutorialCursor = new Phaser.Image(this.game,0,0,'game_finger');
                this.tutorialCursor.anchor.set(0.13,0.09);
                this.group_laptops.add(this.tutorialCursor);
                this.tutorialCursor.position.set(this.laptops[1].button.x + 200, this.laptops[1].button.y + 300);
                var t = this.game.add.tween(this.tutorialCursor.position);
                t.to( {x:this.laptops[1].button.x + 100, y:this.laptops[1].button.y + 80}, 1600);
                t.start();
            }, this);
            this.time.events.add(delay += Phaser.Timer.SECOND * 1.9, function(){
                console.log('close laptop');
                this.closeLaptop(this.laptops[1]);
                this.laptops[1].counter = -999;
            }, this);
            this.time.events.add(delay += Phaser.Timer.SECOND * 1.15, function(){
                this.tutorialCursor.destroy();
                var t = this.game.add.tween(this.tutorialText.scale);
                t.to( {x:0,y:0}, 400, Phaser.Easing.Circular.In);
                t.onComplete.add(function(context,tween,sprite) {sprite.destroy(); }, this, 0, this.tutorialText);
                t.start();
            }, this);
            this.time.events.add(delay += Phaser.Timer.SECOND * 1.6, function(){
                console.log('start level');
                this.startLevel(0,0);
                this.showingTutorial = false;
                BasicGame.seenTutorial = true;
            }, this);

        }
	},

	update: function () {
        if (this.pauseScreen == null)
            return;

        
        
        if (this.pauseScreen.visible || this.endGameScreen.visible || !this.playing) {
            // paused


            if (this.endGameScreen.loading.visible) {
                this.endGameScreen.loading.angle = -this.game.time.time * 0.2;
            }

        } else {
            
            this.game.physics.arcade.collide(this.group_laptops, this.group_collisions);

            /*if (!BasicGame.orientated)
                this.togglePause();*/
            var levelturbulence = this.getLevelProperty('turbulence');
            this.turbulence = lerp(this.turbulence, (-3 + Math.random() * 6) * levelturbulence + Math.sin(this.game.time.now * 0.005 * levelturbulence) * 5 * levelturbulence, 0.09);
            this.turbulence = clamp(this.turbulence, -4, 15);
            //this.gameGroup.y += this.turbulence;
            this.camera.y = 300 - 55 + this.turbulence;

            var takingDamage = false;

            var open_laptops = 0;
            for (var i = 0; i < this.laptops.length; i++) {
                if (this.laptops[i].counter > 0) open_laptops++;
            }
            
            for (var i = 0; i < this.laptops.length; i++) {
                this.laptops[i].counter += (this.game.time.elapsedMS / 1000); 

                if (this.laptops[i].counter > 0) {

                    if (!this.laptops[i].open) {
                        // if there are too many laptops, reset the counter
                        if (open_laptops >= this.getLevelProperty('max_concurrent_laptops')) {
                            this.resetLaptopCounter(this.laptops[i]);
                        } else {
                            this.laptops[i].open = true;
                            var special = Math.random() < this.getLevelProperty('laptop_specialcontentchance');
                            this.laptops[i].particles_secrets.on = !special;
                            this.laptops[i].particles_secrets_special.on = special;

                            this.sound.play('laptopOpen');
                        }

                    } else {
                        open_laptops++;
                        this.damage += (this.game.time.elapsedMS / 1000) * this.getLevelProperty('damage_speed');
                        takingDamage = true;
                    }
                }
                this.laptops[i].openRatio = towards(this.laptops[i].openRatio, this.laptops[i].open ? 1.0 : 0.0, 4.0, this.game.time.elapsedMS / 1000);
                var frame = Math.floor(this.laptops[i].openRatio * 5);
                if (this.laptops[i].button.frame != frame)
                    this.laptops[i].button.frame = frame;

                var emitter = this.laptops[i].particles_secrets_special.on ? this.laptops[i].particles_secrets_special : this.laptops[i].particles_secrets;
                if (emitter.on) {
                    emitter.forEachAlive(function(p){
                        var s = emitter.maxParticleScale * Phaser.Easing.Circular.Out(p.lifespan/emitter.lifespan);
                        p.scale.setTo(s,s);
                    });
                }
            };

            for(var i=0; i < this.npcs.length; i++) { 
                
                
                //this.npcs[i].sprite.x = (looking ? this.npcs[i].offset.x : 0) * Phaser.Easing.Circular.InOut((this.game.time.elapsedMS / 1000) * 0.25);
                //this.npcs[i].sprite.y = (looking ? this.npcs[i].offset.y : 0) * Phaser.Easing.Circular.InOut((this.game.time.elapsedMS / 1000) * 0.25);
                
                var looking = this.laptops[this.npcs[i].lookAt].open && this.laptops[this.npcs[i].lookAt].counter >= this.npcs[i].lookDelay;
                var targetPos = { 
                    x: this.npcs[i].posLooking.x + (looking ? 0 : this.npcs[i].offsetOnIdle.x),
                    y: this.npcs[i].posLooking.y + (looking ? 0 : this.npcs[i].offsetOnIdle.y)
                };
                var l = clamp01((this.game.time.elapsedMS / 1000) * 7);
                this.npcs[i].sprite.x = lerp(this.npcs[i].sprite.x, targetPos.x, l);
                this.npcs[i].sprite.y = lerp(this.npcs[i].sprite.y, targetPos.y, l);

                // flash
                if (i == 7) {
                    var flashframes = [1,1,0,0,0,0,0,0,1,0,0,0,1,0,0,0,0,1,1,0,0,0,0,0,1,1,0,0,0,0,0,0,1,0,0,0,0,0,0,0];
                    var flash = looking && this.laptops[this.npcs[i].lookAt].counter > 1.75 && (flashframes[Math.floor((this.game.time.time * 0.0003 % 0.99) * flashframes.length)] == 1);
                    if (flash && !this.npcs[7].flashImg.visible) this.npcs[7].flashImg.angle = Math.random() * 360;
                    this.npcs[7].flashImg.visible = flash;
                }
                
            }


            var d = (this.damage / this.health);
            //this.damageBar.fill.width = (this.damageBar.bg.width-12*2) * d;
            //this.damageBar.fill.tint = Phaser.Color.interpolate("#ffffff", "#ff0000", 10, d * 10, 1.0);
            var color = 0x32ff00;
            if (1-d < 0.66) color = 0xf19a33;
            if (1-d < 0.33) color = Phaser.Color.interpolateColor(0xff3264, 0xffbece, 5, 0.5 + Math.sin(this.game.time.now * 0.02) * 0.5,1.0);

            UpdateProgressBar(this.game, 1-d, color, this.damageBar);

            var t = "";
            if (this.score < 10) t += "0";
            if (this.score < 100) t += "0";
            if (this.score < 1000) t += "0";
            if (this.score < 10000) t += "0";
            t += Math.floor(this.score).toString();
            if (this.scoreText.text != t)
                this.scoreText.text = t;

            var progresstext = (this.currentLevelNumber < 9 ? "0" : "") + (this.currentLevelNumber+1).toString() + " / 10";
            if (this.progressText.text != progresstext)
                this.progressText.text = progresstext;
            
            if (this.showingTutorial != true) {
                if(this.damage > this.health) {
                    // lose
                    this.playing = false;
                    this.onEndGame(false);
                    /*var t = this.tweenLevelText("GAME OVER", 3000); //TODO: localize
                    t.onComplete.add(function(target,tween){
                        this.onEndGame();
                    },this);
                    t.start();*/
                }
                if(this.laptopsPressed >= this.getLevelProperty('laptops_goal')) {
                    // win
                    this.playing = false;
                    if (this.currentLevelNumber < BasicGame.leveldata.levels.length -1)
                        this.startLevel(this.currentLevelNumber+1, 0);
                    else
                        this.onEndGame(true);
                    /*var t = this.tweenLevelText("LEVEL COMPLETE", 3000); //TODO: localize
                    t.onComplete.add(function(target,tween){
                    },this);
                    t.start();*/
                }
            }
        }
        
        //console.log(this.debugSprite);

        UpdateGameCursor(this.game);
	},

    getInvisibleBody: function(x,y,width,height) {
        var s = new Phaser.Sprite(this.game,x,y,'transition_bg');
        this.game.physics.enable(s);
        //s.texture.baseTexture.skipRender = true;
        s.renderable = false;
        s.alpha = 0.8;
        s.width = width;
        s.height = height;
        s.body.allowGravity = false;
        s.body.immovable = true;
        s.body.bounce.setTo(0.8,0.8);
        return s;
    },

    onHitGameArea: function(button) {
        this.sound.play('negativePoint');
        //console.log('onHitGameArea');
    },

    onHitLaptop: function(button, game, laptopObject) {
        
        //console.log("hit laptop " + laptopObject);
        if (laptopObject.open) {
            this.closeLaptop(laptopObject);
            if (this.showingTutorial == true) {
                this.showingTutorial = false;
                this.time.events.removeAll();
                if (this.tutorialText != null) this.tutorialText.destroy();
                if (this.tutorialCursor != null) this.tutorialCursor.destroy();
                BasicGame.seenTutorial = true;
                this.startLevel(0,600);
            }
        } else {
            // TOSO: some visual feedback when touching a laptop that's closed?
        }

        
    },

    onEndGame: function(win) {

        // TODO: some visual feedback you lost
        //
        var self = this;

        if (this.pauseScreen.visible)
            this.pauseScreen.visible = false;

        var scores;
        getScores(function(serverHighScores) {
          scores = serverHighScores;
        }, function() {
          console.error("error getting scores");
        });
        
        this.endGameScreen.loading.visible = true;
        this.endGameScreen.hiscoretable.alpha = 0;

        var endtext = new Phaser.Image(this.game,0,0,win ? 'game_wintext' : 'game_losetext');
        endtext.anchor.set(0.5,0.5);
        this.uiGroup.add(endtext);
        endtext.position.setTo(this.game.width * .5, this.game.height * .5);
        endtext.scale.setTo(0,0);
        var t = this.game.add.tween(endtext.scale);
        t.to( {x:1.5,y:1.5}, 850, Phaser.Easing.Cubic.Out, true);

        this.game.add.tween(this.music).to({volume:0}, 300).start()
        this.music = this.sound.play('startScreen', 1, true);
        this.music.onDecoded.add(function(sound){ sound.volume = 0; sound.game.add.tween(sound).to({volume:1}, 400).start()});

        this.time.events.add(2500, function() {
            var hiscore = scores && this.score > scores[scores.length-1].points;
            var yourIndex;
            var results = [];

            if (win && hiscore) {
                BasicGame.lastScore = this.score;
                this.sound.play('highScore');
            } else {
                this.sound.play('gameOver');
            }

            if (hiscore) {
              var myScore = this.score;
              var newIndex = indexOfSorted(scores, 'points', myScore);
              scores.splice(newIndex, 0, {name: '', points: myScore, yours: true});
              function getYourPlaceInScores() {
                if (newIndex == 0) {
                  yourIndex = 0;
                  return [0, 1, 2];
                } else if (newIndex == scores.length - 1) {
                  yourIndex = 2;
                  return [scores.length - 3, scores.length - 2, scores.length - 1];
                } else {
                  yourIndex = 1;
                  return [newIndex - 1, newIndex, newIndex + 1]
                }
              }
              var indices = getYourPlaceInScores();
              for (var ix = 0; ix < indices.length; ix++) {
                var j = indices[ix];
                var entry = scores[j];
                entry.index = j;
                results.push(entry);
              }
            }

            console.log('did a hiscore? ' + hiscore);
            this.endGameScreen.hiscore_top.visible = hiscore;
            this.endGameScreen.hiscore_title.visible = hiscore;
            this.endGameScreen.gameover_top.visible = !this.endGameScreen.hiscore_top.visible;
            this.endGameScreen.gameover_title.visible = !hiscore;
            this.endGameScreen.gameover_subtitle.visible = !hiscore;
            this.endGameScreen.gameover_hiscore.visible = !hiscore;
            this.endGameScreen.gameover_hiscorep.visible = !hiscore;

            this.endGameScreen.blocker.width = this.game.width;
            this.endGameScreen.blocker.height = this.game.height;
            this.endGameScreen.popup.x = this.game.width * .5;
            this.endGameScreen.popup.y = this.game.height + this.endGameScreen.popup.getBounds().height + 5;
            this.endGameScreen.footer.x = this.game.width * .5;
            this.endGameScreen.footer.y = this.game.height + this.endGameScreen.footer.getBounds().height + 5;

            this.endGameScreen.gameover_hiscore.visible = !hiscore;
            var t = "";
            if (this.score < 10) t += "0";
            if (this.score < 100) t += "0";
            if (this.score < 1000) t += "0";
            t += Math.floor(this.score).toString();
            this.endGameScreen.gameover_hiscore.text = t;

            if (scores) {
                this.endGameScreen.loading.visible = false;
                this.game.add.tween(this.endGameScreen.hiscoretable).to({alpha:1},300).start();
            }
            
            for(var i = 0; i < 3; i++) {
              if (hiscore) {
                this.endGameScreen.hiscorelines[i].num.text = numberStringForIndex(results[i].index);
                this.endGameScreen.hiscorelines[i].name.text = results[i].name.toUpperCase();
                this.endGameScreen.hiscorelines[i].points.text = results[i].points;
              } else if (scores) {
                this.endGameScreen.hiscorelines[i].num.text = numberStringForIndex(i);
                this.endGameScreen.hiscorelines[i].name.text = scores[i].name.toUpperCase();
                this.endGameScreen.hiscorelines[i].points.text = scores[i].points;
              } else {

                // no high scores from server on game over
                // will just keep loading forever i guess
                /*
                this.endGameScreen.hiscorelines[i].num.text = '';
                this.endGameScreen.hiscorelines[i].name.text = '';
                this.endGameScreen.hiscorelines[i].points.text = '';
                */
              }
            }

            this.uiGroup.add(this.endGameScreen);

            this.endGameScreen.visible = true;

            this.game.add.tween(this.endGameScreen.popup.position).to( {y:this.game.height - 158}, 900, Phaser.Easing.Circular.Out, true).onComplete.add(function() {
                if (hiscore) {
                    var self = this;
                    popupTextField.call(this, this.endGameScreen.hiscorelines[yourIndex].name, function(name) {
                      self.onSubmitHighscoreStart();
                      var done = function() { self.onSubmitHighscoreComplete(); }
                      setScore(name, self.score, done, done);
                    });
                }
            }, this);

            this.game.add.tween(this.endGameScreen.footer.position).to( {y:this.game.height}, 500, Phaser.Easing.Circular.InOut, true, 900);

        }, this);
    },


    onSubmitHighscoreStart: function(lineIndex) {
        this.endGameScreen.loading.visible = true;
        this.endGameScreen.hiscoretable.alpha = 0;
    },

    onSubmitHighscoreComplete: function() {
        this.gotoHiscores();
    },

    toggleFullScreen: function(button) {
        this.game.scale.startFullScreen();
    },

    togglePause: function(pointer) {
        if (this.showingTutorial == true) return;

        this.pauseScreen.visible = !this.pauseScreen.visible;
        if (this.pauseScreen.visible) {
            this.pauseScreen.popup.scale.set(0.1,0.1);
            var tween1 = this.game.add.tween(this.pauseScreen.popup.scale);
            tween1.to( {x:1,y:1}, 600, Phaser.Easing.Elastic.Out);
            tween1.start();
//            tween.onStart.add(function(context,tween){context.})
        }
        this.music.fadeTo(200, this.pauseScreen.visible ? 0.05 : 1);
    },
    restartGame: function(pointer) {
        this.resetState();
        this.game.add.tween(this.music).to({volume:0}, 300).start()
        TransitionToState('Game', this.stage);
    },
    gotoHiscores: function(pointer) {
        this.resetState();
        this.game.add.tween(this.music).to({volume:0}, 300).start()
        TransitionToState('MainMenu', this.stage);
        BasicGame.openLeaderboards = true;
    },
    openWebsite: function(pointer) {
        window.open("http://www.google.com", "_blank");
    },
    quitGame: function (pointer) {
        this.resetState();
        this.game.add.tween(this.music).to({volume:0}, 300).start()
        TransitionToState('MainMenu', this.stage);

    },
    ignore: function(){},

    // reset
    resetState: function() {
        this.scoreText = null;
        this.pauseScreen = null;
        this.endGameScreen = null;

        this.playing = false;
        this.laptops = [];
        this.damage = 0;
        this.damageBar = {};
        this.score = 0;
        this.currentLevelNumber = 0;
        this.laptopsPressed = 0;
        this.turbulence = 0;
        this.health = 100;

        this.feedback_gratificationCounter = 0;
        removeFloatingInput();
    },

    startLevel: function(levelnumber, startDelay) {
        this.currentLevelNumber = levelnumber;

        // counters
        //this.damage = 0;
        this.laptopsPressed = 0;
        if (levelnumber == 0) {
            this.score = 0;
            this.laptopsPressed = 0;
            this.health = 100;
        }
        //this.health = this.getLevelProperty('total_health');
        //state
        for (var i = 0; i < this.laptops.length; i++) {
            this.resetLaptopCounter(this.laptops[i]);
            this.laptops[i].open = false;
        };

        console.log("Starting level #" + this.currentLevelNumber + " with properties: \n" +
            "laptop_opentime: "+this.getLevelProperty('laptop_opentime') + "\n" + 
            "damage_speed: "+this.getLevelProperty('damage_speed') + "\n" + 
            "max_concurrent_laptops: "+this.getLevelProperty('max_concurrent_laptops') + "\n" + 
            "laptops_goal: "+this.getLevelProperty('laptops_goal')
        );

        // init
        var t = this.tweenLevelText(2000);
        t.delay(startDelay);
        /*
        t.chain(this.tweenLevelText("3", 1000));
        t.chain(this.tweenLevelText("2", 1000));
        t.chain(this.tweenLevelText("1", 1000));
        t.chain(this.tweenLevelText("GO", 1000));
        */
        t.onComplete.add(function(target,tween){this.playing=true;},this);
        t.start();

        var levelmusic = ['level01', 'level02', 'level02', 'level03', 'level03', 'level04', 'level04', 'level05', 'level05', 'level06'];
        var newmusic = levelmusic[levelnumber];
        
        if (this.music == null || (this.music != null && this.music.key != newmusic)) {
            var pos = 0;
            if (this.music != null) {
                pos = this.music.position;
                this.game.add.tween(this.music).to({volume:0}, 300).start()
            }
            this.music = this.sound.play(levelmusic[levelnumber], 1, true);
            this.music.position = pos;
            this.music.onDecoded.add(function(sound){ sound.volume = 0; sound.game.add.tween(sound).to({volume:1}, 500).start()});
        }
        this.showingTutorial = false;

    },
	
    // gameplay
    closeLaptop: function(laptopObject) {
        laptopObject.open = false;
        var special = laptopObject.particles_secrets_special.on == true;

        var score = 10;
        if (special)
            score = 100;
        if (laptopObject.counter < 0.5) {
            score = 50;
            if (special == true)
                score = 100;
        }

        
        if (this.showingTutorial != true) {
            this.score = clamp(this.score + score,0,99999);
            this.showScore(score);
        }

        this.resetLaptopCounter(laptopObject);
        laptopObject.particles_secrets.on = false;
        laptopObject.particles_secrets_special.on = false;
        laptopObject.openRatio = 0.75;

        this.laptopsPressed++;

        
        if (this.feedback_gratificationCounter++ > 5) {
            this.feedback_gratificationCounter = 0;
            this.tweenGratification();
        }

        this.sound.play('positivePoint');
        
    },

    resetLaptopCounter: function(laptopObject) { 
        laptopObject.counter = 0 - (this.getLevelProperty('laptop_opentime')[0] + Math.random() * this.getLevelProperty('laptop_opentime')[1]); 
    },

    getLevelProperty: function(property) {
        var v = null;
        if (BasicGame.leveldata.levels[this.currentLevelNumber] != null) v = BasicGame.leveldata.levels[this.currentLevelNumber][property];
        if (v == null) v = BasicGame.leveldata.defaults[property];
        if (v == null) console.log("Error getting level property " + property);
        return v;
    },

    tweenLevelText: function(duration, autoStart) {
        if (autoStart == null) autoStart = false;

        this.levelNumberText.position.set(this.game.width * .5, this.game.height * .5);
        this.levelNumberText.textSprite.frame = this.currentLevelNumber;

        var tweenIn = this.game.add.tween(this.levelNumberText.scale);
        tweenIn.to( { x:1,y:1 }, duration * 0.1, Phaser.Easing.Circular.Out);
        tweenIn.onStart.add(function(target, tween){ 
            this.levelNumberText.visible = true;
            this.levelNumberText.scale.x = this.levelNumberText.scale.y = 0;
            tween.timeline[tween.current].vStart.x = tween.timeline[tween.current].vStart.y = 0; //update the initial value (onStart gets called after the tween gets the current value)
            this.sound.play('gameLevel');
        }, this);

        var tweenOut = this.game.add.tween(this.levelNumberText.scale);
        tweenOut.to( { x:0,y:0 }, duration * 0.1, Phaser.Easing.Circular.In, false, duration * 0.8);
        tweenOut.onComplete.add(function(target, tween){ 
            this.levelNumberText.visible = false;
        }, this);

        tweenIn.chain(tweenOut);

        return tweenIn;

    },
    tweenGratification: function(sprite, duration) {
        if (sprite == null) {
            var sprites = ['game_gratification1', 'game_gratification2','game_gratification3','game_gratification4','game_gratification5'];
            sprite = sprites[Math.round(Math.random() * (sprites.length -1))];
        }
        var s = this.uiGroup.add(new Phaser.Image(this.game,0,0,sprite));
        s.anchor.set(0.5,0.5);
        s.x = this.game.width * .5;
        s.y = this.game.height * .38;
        s.scale.set(0.6,0.6);

        if (duration == null) duration = 1200;

        var tweenIn = this.game.add.tween(s.scale);
        tweenIn.to( { x:.7,y:.7 }, duration * 0.6, Phaser.Easing.Elastic.Out);
        tweenIn.onStart.add(function(target, tween, sprite){ 
            sprite.scale.set(0,0);
            tween.timeline[tween.current].vStart.x = tween.timeline[tween.current].vStart.y = 0;
        }, this, 0, s);

        var tweenOut = this.game.add.tween(s.scale);
        tweenOut.to( { x:0,y:0 }, duration * 0.2, Phaser.Easing.Circular.In, false, duration * 0.2);
        tweenOut.onComplete.add(function(target, tween, sprite){ 
            sprite.destroy()
        }, this, 0, s);

        tweenIn.chain(tweenOut);
        tweenIn.start();

    },
    showScore: function(amount) {
        
        var pos = this.gameGroup.toLocal(this.input.activePointer);
        var img = '';
        if (amount == 10) img = 'game_points10';
        if (amount == 20) img = 'game_points20';
        if (amount == 50) img = 'game_points50';
        if (amount == 100) img = 'game_points100';

        var duration = 600;

        var pointSprite = new Phaser.Image(this.game, pos.x, pos.y, img);
        pointSprite.anchor.set(0.5,0.5);
        pointSprite.scale.set(0,0);
        this.gameGroup.add(pointSprite);
        var tween1 = this.game.add.tween(pointSprite.position);
        tween1.to({y:pointSprite.y - 100}, duration, Phaser.Easing.Linear.None, true);

        var tween2 = this.game.add.tween(pointSprite.scale);
        tween2.to({x:0.2,y:0.2}, duration, Phaser.Easing.Elastic.Out, true, 0, 0, true);
        tween2.onStart.add(function(target,tween,sprite){sprite.scale.set(0,0)}, this, 0, pointSprite);
        tween2.onComplete.add(function(target,tween,sprite){sprite.destroy();}, this, 0, pointSprite);

    },

    onGameResize: function() {
        this.levelDetails.position.set(this.game.width * .5, this.game.height);
        this.endGameScreen.x = this.game.width * .5;
        this.endGameScreen.y = this.game.height * .5;
        this.pauseScreen.popup.x = this.game.width * .5;
        this.pauseScreen.popup.y = this.game.height * .5;

        //this.gameGroup.x = this.game.width * .5 - 1920.0 * 0.5/;
        //this.gameGroup.y = this.game.height * .5 - 1080.0 * 0.5;

        this.pauseButton.x = this.game.width - this.pauseButton.width*.5 - 10;
        this.pauseButton.y = this.pauseButton.height*.5 + 10;
    },

    onKeyDown: function(event) {
        var k = event.keyCode;
        if (k == Phaser.KeyCode.ESC) {
            this.togglePause();
        }
        // cheats
        if (BasicGame.cheatCodes && floatingInput==null) {
            if (k == Phaser.KeyCode.B) {
              this.score = 951;
              this.onEndGame(true);
            }
            if (k == Phaser.KeyCode.L) {
              this.score = 801;
              this.onEndGame(true);
            }
            if (k == Phaser.KeyCode.P) {
                this.score = 99999;
                this.onEndGame(true);
            }
            if (k == Phaser.KeyCode.O) {
                this.score = 500;
                this.onEndGame(true);
            }
            if (k == Phaser.KeyCode.L) {
                this.score = BasicGame.lastScore -1;
                this.onEndGame(false);
            }
            if (k == Phaser.KeyCode.I) {
                this.playing = false;
                if (this.showingTutorial == true) {
                    this.showingTutorial = false;
                    this.time.events.removeAll();
                    if (this.tutorialText != null) this.tutorialText.destroy();
                    if (this.tutorialCursor != null) this.tutorialCursor.destroy();
                    this.startLevel(0,0);
                } else {
                    if (this.currentLevelNumber < BasicGame.leveldata.levels.length -1)
                        this.startLevel(this.currentLevelNumber+1, 0);
                    else
                        this.onEndGame(true);
                }
            }
        }
    }

};

var px = function(n) { return n + "px"; };

var worldPos = function(el) {
  parentPos = el.parent ? worldPos(el.parent) : [0, 0];
  return [el.x + parentPos[0], el.y + parentPos[1]];
};

var floatingInput;

function removeFloatingInput() {
  if (floatingInput) {
    floatingInput.parentNode.removeChild(floatingInput);
    floatingInput = null;
  }
}

function popupTextField(el, callback) {
  var input = document.createElement("input");
  input.className = "text-overlay";
  input.setAttribute("type", "text");
  input.style.position = "absolute";
  input.setAttribute("placeholder", "YOUR NAME");
  input.onkeypress = function(e) {
    var event = e || window.event;
    var charCode = event.which || event.keyCode;
    var value = input.value.replace(/^\s+|\s+$/g,'');
    if (charCode == '13')  {
      if (value.length > 0)
        submit(value);
      return false;
    }
  };

  var self = this;
  var update = function() {
    var F = window.innerWidth/self.game.width;
    var wp = worldPos(el);
    input.style.left = px(F*wp[0]);
    input.style.top = px(F*wp[1] - F*el.height);
    input.setAttribute('maxlength', 10);
    el.text = '';
  };
  setTimeout(update, 100);
  document.body.appendChild(input);
  var oldResize = window.onresize;
  window.onresize = function() {
    if (oldResize) oldResize.apply(this, arguments);
    setTimeout(update, 100);
  };

  function submit(name) {
    input.onkeypress = null;
    window.onresize = oldResize;
    el.text = name;
    input.parentNode.removeChild(input);
    floatingInput = null;
    callback(name);
  };

  floatingInput = input;
}

