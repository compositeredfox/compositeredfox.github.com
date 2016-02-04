
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
        { img: 'game_row1_char1', posLooking: {x:1171,y:283}, offsetOnIdle: {x:-1,y:68}, lookAt: 3 },
        { img: 'game_row1_char2', posLooking: {x:1027,y:324}, offsetOnIdle: {x:-5,y:73}, lookAt: 2 },
        { img: 'game_row1_char3', posLooking: {x:870,y:409}, offsetOnIdle: {x:-85,y:12}, lookAt: 1 },
        { img: 'game_row1_char4', posLooking: {x:615,y:293}, offsetOnIdle: {x:-7,y:69}, lookAt: 0 },
        { img: 'game_row2_char1', posLooking: {x:1206,y:379}, offsetOnIdle: {x:-8,y:54}, lookAt: 3 },
        { img: 'game_row2_char2', posLooking: {x:933,y:447}, offsetOnIdle: {x:89,y:-23}, lookAt: 2 },
        { img: 'game_row2_char3', posLooking: {x:761,y:354}, offsetOnIdle: {x:-7,y:76}, lookAt: 1 },
        { img: 'game_row2_char4', posLooking: {x:548, y:358}, offsetOnIdle: {x:4,y:71}, lookAt: 0 }
    ];

    // level
    this.config_defaults = {
        total_health: 30, // max seconds laptops can been open
        laptop_min_open_delay: 2, // minimum time a laptop stays closed
        laptop_max_open_delay: 5, // maximum time a laptop stays closed
        damage_speed: 1, // laptop damage when open, in units per second
        max_concurrent_laptops: 4,

        laptops_goal: 10 // how many laptops to close for the level to be complete
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

};

BasicGame.Game.prototype = {



	create: function () {

        this.resetState();

        var w = this.game.width;
        var h = this.game.height;


        this.gameGroup = this.game.add.group();
        this.uiGroup = this.game.add.group();

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

        this.gameGroup.add(new Phaser.Image(this.game, 483,463,'game_chairs3'));

        var group_characters = this.gameGroup.add(new Phaser.Group(this.game));
        var group_laptops = this.gameGroup.add(new Phaser.Group(this.game));

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

            laptops[i].particles_secrets = new Phaser.Particles.Arcade.Emitter(this.game,0,0,30);
            laptops[i].particles_secrets.makeParticles('game_cube',[0,1,2,3,4,5,6,7]);
            laptops[i].particles_secrets.setSize(60,50);
            laptops[i].particles_secrets.particleAnchor.set(0.5,0.5);
            laptops[i].particles_secrets.setRotation(-80,80);
            laptops[i].particles_secrets.gravity = 200;
            laptops[i].particles_secrets.start(false, 1000, 250);
            //laptops[i].particles_secrets.setScale(1,0,1,0,1);
            laptops[i].particles_secrets.on = false;
            laptops[i].particles_secrets.x = laptops_positions[i].x + 80;
            laptops[i].particles_secrets.y = laptops_positions[i].y + 70;
            group_laptops.add(laptops[i].particles_secrets);


            laptops[i].button = new Phaser.Button(this.game, laptops_positions[i].x,laptops_positions[i].y, (i == 0 || i == 3 ? 'game_laptop' : 'game_laptop2'));
            laptops[i].button.onInputDown.add(this.onHitLaptop, this, 0, laptops[i]);
            laptops[i].button.scale.x = (i>=2?-1:1);
            if (laptops[i].button.scale.x<0) laptops[i].button.anchor.set(1,0);
            group_laptops.add(laptops[i].button);
            laptops[i].openRatio = laptops[i].button.frame = 0;

            
        };
        laptops[1].button.moveUp();
        laptops[2].button.moveUp();
        laptops[2].button.moveUp();

        /// level details

        this.levelDetails = this.uiGroup.add(new Phaser.Group(this.game));
        this.levelDetails.position.set(this.game.width * .5, this.game.height);

        var levelDetailsBg = new Phaser.Image(this.game,0,0,'level_detailsbg');
        levelDetailsBg.anchor.set(0.5,1);
        this.levelDetails.add(levelDetailsBg);

        var style = { font: "40px Pebble", fill: "#000000", align: "right" };
        this.scoreText = new Phaser.Text(this.game, 354, -10, "0000", style);
        this.scoreText.anchor.set(1,1);
        this.levelDetails.add(this.scoreText);

        style = { font: "40px Pebble", fill: "#000000", align: "right" };
        this.progressText = new Phaser.Text(this.game, -277, -10, "01", style);
        this.progressText.anchor.set(1,1);
        this.levelDetails.add(this.progressText);

        this.damageBarBg = UpdateProgressBar(this.game, 1, 0xf2f2f2, null);
        this.damageBar = UpdateProgressBar(this.game, 1, 0x32ff00, null);

        this.damageBarBg.group.position.set(-225,-50);
        this.damageBar.group.position.set(-225,-50);
        this.levelDetails.add(this.damageBarBg.group); //bg
        this.levelDetails.add(this.damageBar.group);
            
        // pause button

        this.pauseButton = this.uiGroup.add(ButtonWithText(this,0,0, "- PAUSE -", 'graphic_smallbutton', 20, 0x000000, this.togglePause));
        this.pauseButton.scale.set(0.8,0.8);
        this.pauseButton.alpha = 0.8;
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

        this.pauseScreen.popup.add(MenuBackground(this.game, 0, 0, 500, 350));

        var l = Label(this,0, - 80, "PAUSED", 85, "#ffffcc", 'center');
        this.pauseScreen.popup.add(l);
        this.pauseScreen.popup.add(ButtonWithText(this,0, 30, "- Continue -", 'graphic_smallbutton', 18, "#ffffff", this.togglePause));
        this.pauseScreen.popup.add(ButtonWithText(this,0, 100, "- Quit -", 'graphic_smallbutton', 18, "#ffffff", this.quitGame));

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
        
        this.endGameScreen.bg_middle = this.endGameScreen.popup.add(new Phaser.Image(this.game,0,0,'game_end_middle'));
        this.endGameScreen.bg_middle.anchor.set(0.5,1);

        this.endGameScreen.bg_gameover = new Phaser.Image(this.game,0,-this.endGameScreen.bg_middle.height,'game_end_top_gameover');
        this.endGameScreen.bg_gameover.anchor.set(0.5,1);
        this.endGameScreen.popup.add(this.endGameScreen.bg_gameover);

        this.endGameScreen.bg_hiscore = new Phaser.Image(this.game,0,-this.endGameScreen.bg_middle.height,'game_end_top_hiscore');
        this.endGameScreen.bg_hiscore.anchor.set(0.5,1);
        this.endGameScreen.popup.add(this.endGameScreen.bg_hiscore);

        /*
        this.endGameScreen.input = new Phaser.Text(this.game, 120, -105, "| YOUR NAME?   ", { font: "42px Arial", fill: "#ffffff", align: "right" });
        this.endGameScreen.input.anchor.set(1,0.5);
        this.endGameScreen.popup.add(this.endGameScreen.input);
        */

        this.endGameScreen.hiscore = this.endGameScreen.popup.add(Label(this, 350, -378 + 20, "", 40, "#000000", 'right'));
        this.endGameScreen.hiscore.anchor.set(1,1);
        
        this.endGameScreen.hiscoretable = this.endGameScreen.popup.add(new Phaser.Group(this.game));
        this.endGameScreen.hiscorelines = [];
        for (var i = 0; i < 3; i++) {
            var y = -268 + 20 + 63 * i;
            this.endGameScreen.hiscorelines[i] = this.endGameScreen.hiscoretable.add(new Phaser.Group(this.game));
            this.endGameScreen.hiscorelines[i].num = new Phaser.Text(this.game, -314, y, "0"+(i+1), { font: "40px Pebble", fill: "#000000", align: "right"});
            this.endGameScreen.hiscorelines[i].num.anchor.set(1,1);
            this.endGameScreen.hiscorelines[i].name = new Phaser.Text(this.game, -292, y, "", { font: "40px Pebble", fill: "#000000", align: "left"});
            this.endGameScreen.hiscorelines[i].name.anchor.set(0,1);
            this.endGameScreen.hiscorelines[i].points = new Phaser.Text(this.game, 351, y, "", { font: "40px Pebble", fill: "#000000", align: "left"});
            this.endGameScreen.hiscorelines[i].points.anchor.set(1,1);
            this.endGameScreen.hiscoretable.add(this.endGameScreen.hiscorelines[i].num);
            this.endGameScreen.hiscoretable.add(this.endGameScreen.hiscorelines[i].name);
            this.endGameScreen.hiscoretable.add(this.endGameScreen.hiscorelines[i].points);

        };
        this.endGameScreen.button_hiscore = ButtonWithTextOver(this,-230, -66, "SEE HIGH SCORE BOARD", 'button_endgame1', 'button_endgame1_over', 12, "#990AE3", this.gotoHiscores);
        this.endGameScreen.popup.add(this.endGameScreen.button_hiscore);
        this.endGameScreen.button_restart = ButtonWithTextOver(this,230, -66, "PLAY AGAIN", 'button_endgame1', 'button_endgame1_over', 12, "#990AE3", this.restartGame);
        this.endGameScreen.popup.add(this.endGameScreen.button_restart);
        
        this.endGameScreen.footer = this.endGameScreen.add(new Phaser.Group(this.game));
        this.endGameScreen.footer.bg = new Phaser.Image(this.game,0,0,'game_end_footer');
        this.endGameScreen.footer.bg.anchor.set(0.5,1);
        this.endGameScreen.footer.button = ButtonWithTextOver(this,232,-75,'VIEW OUR CODE OF CONDUCT', 'button_endgame_url', 'button_endgame_url_over', 12, "#FFFFFF", this.openWebsite);
        this.endGameScreen.footer.add(this.endGameScreen.footer.bg);
        this.endGameScreen.footer.add(this.endGameScreen.footer.button);
        
        this.endGameScreen.visible = false;
        //this.game.add.existing(this.endGameScreen);

        // feedback

        this.game.physics.startSystem(Phaser.Physics.ARCADE);

        this.gameGroup.x = this.game.width * .5 - 1920.0 * 0.5;
        this.gameGroup.y = this.game.height * .5 - 1080.0 * 0.5;

        UpdateGameCursor(this.game,true);

        this.startLevel(0, 900);

	},

	update: function () {
        if (this.pauseScreen == null)
            return;
        
        this.pauseButton.x = this.game.width - this.pauseButton.width*.5 - 10;
        this.pauseButton.y = this.pauseButton.height*.5 + 10;

        this.gameGroup.x = this.game.width * .5 - 1920.0 * 0.5;
        this.gameGroup.y = this.game.height * .5 - 1080.0 * 0.5 - 55;

        // cheats
        if (BasicGame.cheatCodes) {
            if (this.input.keyboard.isDown(Phaser.KeyCode.P)) {
                this.score = BasicGame.lastScore +1;
                this.onEndGame();
            }
            if (this.input.keyboard.isDown(Phaser.KeyCode.O)) {
                this.score = BasicGame.lastScore -1;
                this.onEndGame();
            }
        }

        if (this.pauseScreen.visible || this.endGameScreen.visible || !this.playing) {
            // paused

        } else {
            if (this.input.keyboard.isDown(Phaser.KeyCode.ESC)) {
                this.togglePause();
            }
            /*if (!BasicGame.orientated)
                this.togglePause();*/
            this.turbulence = lerp(this.turbulence, Math.random() * 6 + Math.sin(this.game.time.now * 0.005) * 5 * Math.random(), 0.09);

            this.gameGroup.y += this.turbulence;

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
                            // TODO: some visual feedback that the laptop just opened   
                            this.laptops[i].particles_secrets.on = true;
                        }

                    } else {
                        open_laptops++;

                        this.damage += (this.game.time.elapsedMS / 1000) * this.getLevelProperty('damage_speed');
                        takingDamage = true;
                    }
                }
                this.laptops[i].openRatio = towards(this.laptops[i].openRatio, this.laptops[i].open ? 1.0 : 0.0, 4.0, this.game.time.elapsedMS / 1000);
                 this.laptops[i].button.frame = Math.floor(this.laptops[i].openRatio * 5);
            };

            for(var i=0; i < this.npcs.length; i++) { 
                var looking = this.laptops[this.npcs[i].lookAt].open;
                var t = this.laptops[this.npcs[i].lookAt].counter;
                //this.npcs[i].sprite.x = (looking ? this.npcs[i].offset.x : 0) * Phaser.Easing.Circular.InOut((this.game.time.elapsedMS / 1000) * 0.25);
                //this.npcs[i].sprite.y = (looking ? this.npcs[i].offset.y : 0) * Phaser.Easing.Circular.InOut((this.game.time.elapsedMS / 1000) * 0.25);
                
                var npcx = this.npcs[i].posLooking.x + (looking ? 0 : this.npcs[i].offsetOnIdle.x);
                var npcy = this.npcs[i].posLooking.y + (looking ? 0 : this.npcs[i].offsetOnIdle.y);
                this.npcs[i].sprite.x = lerp(this.npcs[i].sprite.x, npcx, clamp01((this.game.time.elapsedMS / 1000) * 0.75));
                this.npcs[i].sprite.y = lerp(this.npcs[i].sprite.y, npcy, clamp01((this.game.time.elapsedMS / 1000) * 0.75));
                
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
            t += Math.floor(this.score).toString();
            this.scoreText.text = t;

            this.progressText.text = (this.currentLevelNumber < 9 ? "0" : "") + (this.currentLevelNumber+1).toString();
            
            if(this.damage > this.health) {
                // lose
                this.playing = false;
                this.onEndGame();
                /*var t = this.tweenLevelText("GAME OVER", 3000); //TODO: localize
                t.onComplete.add(function(target,tween){
                    this.onEndGame();
                },this);
                t.start();*/
            }
            if(this.laptopsPressed >= this.getLevelProperty('laptops_goal')) {
                // win
                this.playing = false;
                if (this.currentLevelNumber < this.config_levels.length -1)
                    this.startLevel(this.currentLevelNumber+1, 0);
                else
                    this.onEndGame();
                /*var t = this.tweenLevelText("LEVEL COMPLETE", 3000); //TODO: localize
                t.onComplete.add(function(target,tween){
                },this);
                t.start();*/
            }
        }
        
        //console.log(this.debugSprite);

        UpdateGameCursor(this.game);
	},

    onHitLaptop: function(button, game, laptopObject) {
        //console.log("hit laptop " + laptopObject);
        if (laptopObject.open) {
            this.closeLaptop(laptopObject);
            // TODO: some visual feedback you closed the laptop
        } else {
            // TOSO: some visual feedback when touching a laptop that's closed?
        }

        
    },

    onEndGame() {
        // TODO: some visual feedback you lost

        if (this.pauseScreen.visible)
            this.pauseScreen.visible = false;

        var hiscore = this.score > BasicGame.lastScore;

        this.endGameScreen.bg_hiscore.visible = hiscore;
        this.endGameScreen.bg_gameover.visible = !this.endGameScreen.bg_hiscore.visible;

        this.endGameScreen.blocker.width = this.game.width;
        this.endGameScreen.blocker.height = this.game.height;
        this.endGameScreen.popup.x = this.game.width * .5;
        this.endGameScreen.popup.y = this.game.height + this.endGameScreen.popup.getBounds().height + 5;
        this.endGameScreen.footer.x = this.game.width * .5;
        this.endGameScreen.footer.y = this.game.height + this.endGameScreen.footer.getBounds().height + 5;

        this.endGameScreen.hiscore.visible = !hiscore;
        var t = "";
        if (this.score < 10) t += "0";
        if (this.score < 100) t += "0";
        if (this.score < 1000) t += "0";
        t += Math.floor(this.score).toString();
        this.endGameScreen.hiscore.text = t;

        
        for(var i = 0; i < 3; i++) {
            this.endGameScreen.hiscorelines[i].name.text = "SDSFDSF";
            this.endGameScreen.hiscorelines[i].points.text = "1234";
        }

        this.uiGroup.add(this.endGameScreen);
        this.endGameScreen.visible = true;

        this.game.add.tween(this.endGameScreen.popup.position).to( {y:this.game.height - 158}, 900, Phaser.Easing.Circular.Out, true);
        this.game.add.tween(this.endGameScreen.footer.position).to( {y:this.game.height}, 500, Phaser.Easing.Circular.InOut, true, 900);

        if (this.score > BasicGame.lastScore)
            BasicGame.lastScore = this.score;
    },

    toggleFullScreen: function(button) {
        this.game.scale.startFullScreen();
    },

    togglePause: function(pointer) {

        this.pauseScreen.visible = !this.pauseScreen.visible;
        if (this.pauseScreen.visible) {
            this.pauseScreen.popup.scale.set(0.1,0.1);
            var tween1 = this.game.add.tween(this.pauseScreen.popup.scale);
            tween1.to( {x:1,y:1}, 600, Phaser.Easing.Elastic.Out);
            tween1.start();
//            tween.onStart.add(function(context,tween){context.})
        }
    },
    restartGame: function(pointer) {
        this.resetState();
        TransitionToState('Game', this.stage);
    },
    gotoHiscores: function(pointer) {
        TransitionToState('MainMenu', this.stage);
        BasicGame.openLeaderboards = true;
    },
    openWebsite: function(pointer) {
        window.open("http://www.google.com", "_blank");
    },
    quitGame: function (pointer) {
        this.resetState();
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
    },

    startLevel: function(levelnumber, startDelay) {
        this.currentLevelNumber = levelnumber;

        // counters
        //this.damage = 0;
        this.laptopsPressed = 0;
        //this.health = this.getLevelProperty('total_health');
        //state
        for (var i = 0; i < this.laptops.length; i++) {
            this.resetLaptopCounter(this.laptops[i]);
            this.laptops[i].open = false;
        };

        console.log("Starting level #" + this.currentLevelNumber + " with properties: \n" +
            "laptop_min_open_delay: "+this.getLevelProperty('laptop_min_open_delay') + "\n" + 
            "laptop_max_open_delay: "+this.getLevelProperty('laptop_max_open_delay') + "\n" + 
            "total_health: "+this.getLevelProperty('total_health') + "\n" + 
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


    },
	
    // gameplay
    closeLaptop: function(laptopObject) {
        laptopObject.open = false;
        if (laptopObject.counter < 0.5) {
            this.score += 50;
            this.showScore(50);
        } else {
            this.score += 10;
            this.showScore(10);
        }
        this.resetLaptopCounter(laptopObject);
        laptopObject.particles_secrets.on = false;
        laptopObject.openRatio = 0.75;

        this.laptopsPressed++;

        
        
    },

    resetLaptopCounter: function(laptopObject) { 
        laptopObject.counter = 0 - (this.getLevelProperty('laptop_min_open_delay') + Math.random() * this.getLevelProperty('laptop_max_open_delay')); 
    },

    getLevelProperty: function(property) {
        var v = null;
        if (this.config_levels[this.currentLevelNumber] != null) v = this.config_levels[this.currentLevelNumber][property];
        if (v == null) v = this.config_defaults[property];
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
        }, this);

        var tweenOut = this.game.add.tween(this.levelNumberText.scale);
        tweenOut.to( { x:0,y:0 }, duration * 0.1, Phaser.Easing.Circular.In, false, duration * 0.8);
        tweenOut.onComplete.add(function(target, tween){ 
            this.levelNumberText.visible = false;
        }, this);

        tweenIn.chain(tweenOut);

        return tweenIn;

    },
    showScore: function(amount) {
        this.score += 50;
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

        this.gameGroup.x = this.game.width * .5 - 1920.0 * 0.5;
        this.gameGroup.y = this.game.height * .5 - 1080.0 * 0.5;
    }

};
