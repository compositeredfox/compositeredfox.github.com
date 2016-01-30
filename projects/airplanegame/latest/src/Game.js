
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
    this.health = 0;
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
        { laptops_goal: 10, laptop_min_open_delay: 1, laptop_max_open_delay: 2, total_health: 15, damage_speed: 0.7, max_concurrent_laptops:2 },
        { laptops_goal: 20, laptop_min_open_delay: 0.2, laptop_max_open_delay: 0.4, total_health: 15, damage_speed: 0.7, max_concurrent_laptops:4 },
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
            laptops[i].particles_secrets.makeParticles(['game_particle_secrets1', 'game_particle_secrets2', 'game_particle_secrets3', 'game_particle_secrets4']);
            laptops[i].particles_secrets.setSize(60,50);
            laptops[i].particles_secrets.particleAnchor.set(0.5,0.5);
            laptops[i].particles_secrets.setRotation(-80,80);
            laptops[i].particles_secrets.gravity = -100;
            laptops[i].particles_secrets.start(false, 1000, 250);
            //laptops[i].particles_secrets.setScale(1,0,1,0,1);
            laptops[i].particles_secrets.on = false;
            laptops[i].particles_secrets.x = laptops_positions[i].x + 80;
            laptops[i].particles_secrets.y = laptops_positions[i].y + 70;
            group_laptops.add(laptops[i].particles_secrets);


            laptops[i].button = new Phaser.Button(this.game, laptops_positions[i].x,laptops_positions[i].y, 'game_laptop');
            laptops[i].button.onInputDown.add(this.onHitLaptop, this, 0, laptops[i]);
            laptops[i].button.scale.x = (i>=2?-1:1);
            if (laptops[i].button.scale.x<0) laptops[i].button.anchor.set(1,0);
            group_laptops.add(laptops[i].button);
            laptops[i].openRatio = laptops[i].button.frame = 0;

            
        };
        laptops[1].button.moveUp();
        laptops[2].button.moveUp();
        laptops[2].button.moveUp();
        
        this.damageBar = {};
        this.damageBar.group = this.uiGroup.add(new Phaser.Group(this.game));
        this.damageBar.group.position.set(450, 9);
        this.damageBar.bg = new Phaser.Image(this.game, 0,0,'game_damagebar_bg');
        this.damageBar.group.add(this.damageBar.bg);
        this.damageBar.fill = new Phaser.Image(this.game, 12,8,'game_damagebar_fill');
        this.damageBar.fill.width = 0;//this.damageBar.bg.width;
        this.damageBar.fill.height = this.damageBar.bg.height-16;//this.damageBar.bg.width;
        this.damageBar.group.add(this.damageBar.fill);
            
        var style = { font: "36px Pebble", fill: "#000000", align: "left" };
        this.scoreText = this.uiGroup.add(new Phaser.Text(this.game, 10, 5, "0P", style));

        style = { font: "36px Pebble", fill: "#000000", align: "left" };
        this.progressText = this.uiGroup.add(new Phaser.Text(this.game, 160, 5, "LEVEL 1  0 / " + this.config_levels[0].laptops_goal, style));

        this.pauseButton = this.uiGroup.add(ButtonWithText(this,0,0, "- PAUSE -", 'graphic_smallbutton', 20, 0x000000, this.togglePause));
        this.pauseButton.scale.set(0.8,0.8);
        this.pauseButton.alpha = 0.8;
        this.pauseButton.x = this.game.width - this.pauseButton.width*.5 - 10;
        this.pauseButton.y = this.pauseButton.height*.5 + 10;

        this.levelText = Label(this, this.game.width * .5, this.game.height * .5 - 40, "", 110, "#000000", 'center');
        this.levelText.visible = false;
        this.uiGroup.add(this.levelText);

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
        this.endGameScreen.x = this.game.width * .5;
        this.endGameScreen.y = this.game.height * .5;

        //// blocker
        g = this.game.add.graphics(0,0, this.endGameScreen);
        g.beginFill("#000000", 0.6);
        g.drawRect(-this.endGameScreen.x,-this.endGameScreen.y, this.game.width, this.game.height);
        g.endFill();

        b = new Phaser.Button(this.game,-this.endGameScreen.x,-this.endGameScreen.y,'');
        b.width = g.width;
        b.height = g.height;
        b.onInputDown.add(this.ignore, this);
        this.endGameScreen.add(b);

        this.endGameScreen.popup = this.endGameScreen.add(new Phaser.Group(this.game));
        this.endGameScreen.popup.add(MenuBackground(this.game, 0, 0, 800, 660));

        this.endGameScreen.title = Label(this,0, -150, "", 85, "#ffffcc", 'center');
        this.endGameScreen.title.anchor.set(0.5,1);
        this.endGameScreen.input = new Phaser.Text(this.game, 120, -105, "| YOUR NAME?   ", { font: "42px Arial", fill: "#ffffff", align: "right" });
        this.endGameScreen.input.anchor.set(1,0.5);
        this.endGameScreen.hiscore = new Phaser.Text(this.game, 120, -105, this.score.toString().substring(0,4) + "P", { font: "42px Arial", fill: "#000000", align: "left"});
        this.endGameScreen.hiscore.anchor.set(0,0.5);
        this.endGameScreen.hiscoretable = new Phaser.Group(this.game);
        var names = ["Lid shutter", "Killer 2", "Hunter", "Klasse", "Maja"];
        var scores = [7500, 5000, 3500, 2500, 1000];
        for (var i = 0; i < 5; i++) {
            var hiscoreline = new Phaser.Group(this.game);
            hiscoreline.add(new Phaser.Text(this.game, -65, 0, "0"+(i+1), { font: "22px Arial", fill: "#000000", align: "right"}));
            hiscoreline.add(new Phaser.Text(this.game, -35, 0, names[i], { font: "22px Arial", fill: "#000000", align: "left"}));
            hiscoreline.add(new Phaser.Text(this.game, 180, 0, scores[i] + "p", { font: "22px Arial", fill: "#000000", align: "left"}));
            hiscoreline.position.y = -95 + i * 18;
            this.endGameScreen.hiscoretable.add(hiscoreline);
        };
        this.endGameScreen.hiscoretable.x = -this.endGameScreen.hiscoretable.getBounds().width;
        this.endGameScreen.hiscoretable.position.y = 30;
        this.endGameScreen.button_hiscore = ButtonWithText(this,0, 70, "- See high scores -", 'graphic_smallbutton', 18, "#ffffff", this.gotoHiscores);
        this.endGameScreen.button_hiscore.scale.set(0.7,0.7);
        this.endGameScreen.button_hiscore.alpha = 0.7
        this.endGameScreen.button_restart = ButtonWithText(this,0, 135, "- Play Again -", 'graphic_longbutton', 28, "#ffffff", this.restartGame);
        this.endGameScreen.button_restart.scale.set(0.7,0.7);
        var t = new Phaser.Text(this.game, 0, 190, "Ok enough now...\nHave you read about what not to do at work at\nthe responsible business conduct site?", { font: "18px Arial", fill: "#000000", align: 'center' });
        t.padding.set(0,-8);
        t.anchor.set(0.5,0);
        this.endGameScreen.button_www = ButtonWithText(this,0, 285, "- Learn More -", 'graphic_smallbutton', 18, "#ffffff", this.openWebsite);
        this.endGameScreen.button_www.scale.set(0.85,0.85);


        this.endGameScreen.popup.add(this.endGameScreen.title);
        this.endGameScreen.popup.add(this.endGameScreen.input);
        this.endGameScreen.popup.add(this.endGameScreen.hiscore);
        this.endGameScreen.popup.add(this.endGameScreen.hiscoretable);
        this.endGameScreen.popup.add(this.endGameScreen.button_hiscore);
        this.endGameScreen.popup.add(this.endGameScreen.button_restart);
        this.endGameScreen.popup.add(t);
        this.endGameScreen.popup.add(this.endGameScreen.button_www);
        
        
        this.endGameScreen.visible = false;
        //this.game.add.existing(this.endGameScreen);


        // feedback
        this.particles_score10 = this.gameGroup.add(new Phaser.Particles.Arcade.Emitter(this.game,0,0,10));
        this.particles_score10.makeParticles('game_score10');
        this.particles_score10.particleAnchor.set(0.5,0.5);
        this.particles_score10.setRotation(-20,20);
        this.particles_score10.gravity = 200;

        this.particles_score50 = this.gameGroup.add(new Phaser.Particles.Arcade.Emitter(this.game,0,0,10));
        this.particles_score50.makeParticles('game_score50');
        this.particles_score50.particleAnchor.set(0.5,0.5);
        this.particles_score50.setRotation(-20,20);
        this.particles_score50.gravity = 200;

        this.game.physics.startSystem(Phaser.Physics.ARCADE);

        this.gameGroup.x = this.game.width * .5 - 1920.0 * 0.5;
        this.gameGroup.y = this.game.height * .5 - 1080.0 * 0.5;

        this.startLevel(0, 500);

	},

	update: function () {
        if (this.pauseScreen == null)
            return;
        
        this.pauseButton.x = this.game.width - this.pauseButton.width*.5 - 10;
        this.pauseButton.y = this.pauseButton.height*.5 + 10;

        if (this.pauseScreen.visible || this.endGameScreen.visible || !this.playing) {
            // paused

        } else {
            /*if (!BasicGame.orientated)
                this.togglePause();*/
            this.turbulence = lerp(this.turbulence, Math.random() * (this.game.time.elapsedMS / 1000) * 4, 0.25);

            this.gameGroup.x = this.game.width * .5 - 1920.0 * 0.5;
            this.gameGroup.y = this.game.height * .5 - 1080.0 * 0.5 + this.turbulence;

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
            this.damageBar.fill.width = (this.damageBar.bg.width-12*2) * d;
            //this.damageBar.fill.tint = Phaser.Color.interpolate("#ffffff", "#ff0000", 10, d * 10, 1.0);

            if (takingDamage) {
                // give some visual feedback
                this.damageBar.angle = -4 + Math.random() * 8;
            } else {
                this.damageBar.angle = 0;
            }

            this.scoreText.text = this.score.toString().split('.')[0] + "P";
            this.progressText.text = "Level " + (this.currentLevelNumber+1) + "  " + this.laptopsPressed + " / " + this.getLevelProperty('laptops_goal');
            
            if(this.damage > this.health) {
                // lose
                this.playing = false;
                var t = this.tweenLevelText("GAME OVER", 3000); //TODO: localize
                t.onComplete.add(function(target,tween){
                    this.onEndGame();
                },this);
                t.start();
            }
            if(this.laptopsPressed >= this.getLevelProperty('laptops_goal')) {
                // win
                this.playing = false;
                var t = this.tweenLevelText("LEVEL COMPLETE", 3000); //TODO: localize
                t.onComplete.add(function(target,tween){
                    this.startLevel(this.currentLevelNumber+1, 3000);
                },this);
                t.start();
            }
        }
        

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

        if (this.score > BasicGame.lastScore)
            this.endGameScreen.title.text = "NEW HIGH SCORE"; //TODO: localize
        else
            this.endGameScreen.title.text = "GAME OVER"; //TODO: localize
        this.endGameScreen.hiscore.text = this.score.toString().split('.')[0] + "p";

        this.uiGroup.add(this.endGameScreen);
        this.endGameScreen.visible = true;

        this.endGameScreen.popup.scale.set(0.1,0.1);
        var tween1 = this.game.add.tween(this.endGameScreen.popup.scale);
        tween1.to( {x:1,y:1}, 900, Phaser.Easing.Elastic.Out);
        tween1.start();

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
        TransitionToState('Leaderboard', this.stage);
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
    },

    startLevel: function(levelnumber, startDelay) {
        this.currentLevelNumber = levelnumber;

        // counters
        this.damage = 0;
        this.laptopsPressed = 0;
        this.health = this.getLevelProperty('total_health');
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
        var t = this.tweenLevelText("LEVEL " + (this.currentLevelNumber + 1), 2000); //TODO: localize
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
            this.particles_score50.position = this.gameGroup.toLocal(this.input.activePointer);
            this.particles_score50.start(true, 1000, null, 1);
        } else {
            this.score += 10;
            this.particles_score10.position = this.gameGroup.toLocal(this.input.activePointer);
            this.particles_score10.start(true, 1000, null, 1);
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

    tweenLevelText: function(string, duration, autoStart) {
        if (autoStart == null) autoStart = false;

        var tweenIn = this.game.add.tween(this.levelText.scale);
        tweenIn.to( { x:1,y:1 }, duration * 0.1, Phaser.Easing.Circular.Out);
        tweenIn.onStart.add(function(target, tween){ 
            this.levelText.text = string;
            this.levelText.visible = true;
            this.levelText.scale.x = this.levelText.scale.y = 0;
            tween.timeline[tween.current].vStart.x = tween.timeline[tween.current].vStart.y = 0; //update the initial value (onStart gets called after the tween gets the current value)
        }, this);

        var tweenOut = this.game.add.tween(this.levelText.scale);
        tweenOut.to( { x:0,y:0 }, duration * 0.1, Phaser.Easing.Circular.In, false, duration * 0.8);
        tweenOut.onComplete.add(function(target, tween){ 
            this.levelText.visible = false;
        }, this);

        tweenIn.chain(tweenOut);

        return tweenIn;

    }

};
