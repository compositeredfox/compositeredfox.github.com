
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

    this.playing = false;

    this.npcs = [
        { img: 'game_chars1_1', offset: {x:-3, y:25}, lookAt: 3 },
        { img: 'game_chars1_2', offset: {x:-1, y:26}, lookAt: 2 },
        { img: 'game_chars1_3', offset: {x:-55, y:2}, lookAt: 1 },
        { img: 'game_chars1_4', offset: {x:-4, y:35}, lookAt: 0 },
        { img: 'game_chars2_1', offset: {x:-8, y:40}, lookAt: 3 },
        { img: 'game_chars2_2', offset: {x:63, y:-2}, lookAt: 2 },
        { img: 'game_chars2_3', offset: {x:-2, y:35}, lookAt: 1 },
        { img: 'game_chars2_4', offset: {x:4, y:38}, lookAt: 0 }
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

        var sky = this.game.add.image(0,0,'mainmenu_bg');
        sky.width = w;
        sky.height = h;

        this.game.add.image(0,0,'game_bg');

        for(var i=0; i < 4; i++) { this.npcs[i].sprite = this.game.add.image(this.npcs[i].offset.x,this.npcs[i].offset.y,this.npcs[i].img); }

        this.game.add.image(0,0,'game_row1');

        for(var i=4; i < 8; i++) { this.npcs[i].sprite = this.game.add.image(this.npcs[i].offset.x,this.npcs[i].offset.y,this.npcs[i].img); }

        this.game.add.image(0,0,'game_row2');

        this.game.add.image(0,0,'game_characters');

        var group_characters = this.game.add.group();
        var group_laptops = this.game.add.group();

        laptops = this.laptops;
        laptops_positions = [
            { x: 130, y: 312 },
            { x: 290, y: 311 },
            { x: 608, y: 320 },
            { x: 756, y: 303 }
        ];
        for (var i = 0; i < 4; i++) {
            laptops[i] = {};
            laptops[i].index = i;
            /*
            laptops[i].character = new Phaser.Sprite(position[i].x,positions[i].y,'game_character');
            laptops[i].character.scale.x = (i>2?-1:1);
            group_characters.add(laptops[i].character);
            */
            laptops[i].button = new Phaser.Button(this.game, laptops_positions[i].x,laptops_positions[i].y, 'game_laptop');
            laptops[i].button.onInputDown.add(this.onHitLaptop, this, 0, laptops[i]);
            laptops[i].button.scale.x = (i>=2?-1:1);
            if (laptops[i].button.scale.x<0) laptops[i].button.anchor.set(1,0);
            group_laptops.add(laptops[i].button);
            laptops[i].button.frame = 0;
            

        };
        
        this.damageBar = {};
        this.damageBar.group = this.game.add.group();
        this.damageBar.group.position.set(w * .35, h * .1);
        this.damageBar.bg = new Phaser.Image(this.game, 0,0,'game_damagebar_bg');
        this.damageBar.bg.anchor.set(0,0.5);
        this.damageBar.group.add(this.damageBar.bg);
        this.damageBar.fill = new Phaser.Image(this.game, 0,0,'game_damagebar_fill');
        this.damageBar.fill.anchor.set(0,0.5);
        this.damageBar.fill.width = 0;//this.damageBar.bg.width;
        this.damageBar.group.add(this.damageBar.fill);
            
        var style = { font: "18px Pebble", fill: "#ffffff", align: "left" };
        this.scoreText = this.game.add.text(5, 5, "0P", style);

        style = { font: "18px Pebble", fill: "#ffffff", align: "left" };
        this.progressText = this.game.add.text(90, 5, "0 / " + this.config_levels[0].laptops_goal, style);

        this.pauseButton = this.game.add.existing(ButtonWithText(this, 50, h-35, "pause", 'graphic_smallbutton', 13, "#ffffff", this.togglePause));

        this.levelText = Label(this, this.game.width * .5, this.game.height * .5 - 40, "", 64, "#ff0000", 'center');
        this.levelText.visible = false;
        this.game.add.existing(this.levelText);

        // Pause screen
        this.pauseScreen = this.game.add.group();

        var g = this.game.add.graphics(0,0, this.pauseScreen);
        g.beginFill("#000000", 0.6);
        g.drawRect(0,0, this.game.width, this.game.height);
        g.endFill();

        var b = new Phaser.Button(this.game,0,0,'');
        b.width = g.width;
        b.height = g.height;
        b.onInputDown.add(this.togglePause, this);
        this.pauseScreen.add(b);

        var l = Label(this,this.game.width * .5, this.game.height * .5, "PAUSED", 72, "#00ff00", 'center');
        l.alpha = 0.5;
        this.pauseScreen.add(l);
        this.pauseScreen.add(ButtonWithText(this,this.game.width * .5, this.game.height * .5 + 60, "continue", 'graphic_smallbutton', 13, "#ffffff", this.togglePause));
        this.pauseScreen.add(ButtonWithText(this,this.game.width * .5, this.game.height * .5 + 100, "quit", 'graphic_smallbutton', 13, "#ffffff", this.quitGame));

        this.pauseScreen.visible = false;

        // End Game

        this.endGameScreen = new Phaser.Group(this.game);
        this.endGameScreen.x = this.game.width * .5;
        this.endGameScreen.y = this.game.height * .5 - 70;

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

        this.endGameScreen.title = Label(this,0 , 0, "", 64, "#00ff00", 'center');
        this.endGameScreen.title.anchor.set(0.5,1);
        this.endGameScreen.input = new Phaser.Text(this.game, 80, 15, "| YOUR NAME?   ", { font: "24px Arial", fill: "#ffffff", align: "right" });
        this.endGameScreen.input.anchor.set(1,0.5);
        this.endGameScreen.hiscore = new Phaser.Text(this.game, 80, 15, this.score.toString().substring(0,4) + "P", { font: "24px Arial", fill: "#000000", align: "left"});
        this.endGameScreen.hiscore.anchor.set(0,0.5);
        this.endGameScreen.hiscoretable = new Phaser.Group(this.game);
        var names = ["Lid shutter", "Killer 2", "Hunter", "Klasse", "Maja"];
        var scores = [7500, 5000, 3500, 2500, 1000];
        for (var i = 0; i < 5; i++) {
            var hiscoreline = new Phaser.Group(this.game);
            hiscoreline.add(new Phaser.Text(this.game, -10, 0, "0"+i, { font: "10px Arial", fill: "#000000", align: "right"}));
            hiscoreline.add(new Phaser.Text(this.game, 5, 0, names[i], { font: "10px Arial", fill: "#000000", align: "left"}));
            hiscoreline.add(new Phaser.Text(this.game, 80, 0, scores[i] + "p", { font: "10px Arial", fill: "#000000", align: "left"}));
            hiscoreline.position.y = i * 12;
            this.endGameScreen.hiscoretable.add(hiscoreline);
        };
        this.endGameScreen.hiscoretable.x = -this.endGameScreen.hiscoretable.getBounds().width;
        this.endGameScreen.hiscoretable.position.y = 30;
        this.endGameScreen.button_hiscore = ButtonWithText(this,0, 110, "See high score", 'graphic_longbutton', 13, "#ffffff", this.gotoHiscores);
        this.endGameScreen.button_hiscore.scale.set(0.7,0.7);
        this.endGameScreen.button_restart = ButtonWithText(this,0, 135, "Play Agan", 'graphic_longbutton', 13, "#ffffff", this.restartGame);
        this.endGameScreen.button_restart.scale.set(0.7,0.7);
        var t = new Phaser.Text(this.game, 0, 155, "Ok enough now...\nHave you read about what not to do at work at\nthe responsible business conduct site?", { font: "10px Arial", fill: "#000000", align: 'center' });
        t.padding.set(0,-8);
        t.anchor.set(0.5,0);
        this.endGameScreen.button_www = ButtonWithText(this,0, 210, "website", 'graphic_smallbutton', 13, "#ffffff", this.openWebsite);
        this.endGameScreen.button_www.scale.set(0.7,0.7);


        this.endGameScreen.add(this.endGameScreen.title);
        this.endGameScreen.add(this.endGameScreen.input);
        this.endGameScreen.add(this.endGameScreen.hiscore);
        this.endGameScreen.add(this.endGameScreen.hiscoretable);
        this.endGameScreen.add(this.endGameScreen.button_hiscore);
        this.endGameScreen.add(this.endGameScreen.button_restart);
        this.endGameScreen.add(t);
        this.endGameScreen.add(this.endGameScreen.button_www);
        
        
        this.endGameScreen.visible = false;
        //this.game.add.existing(this.endGameScreen);

        this.startLevel(0, 500);

	},

	update: function () {

        if (this.pauseScreen.visible || this.endGameScreen.visible || !this.playing) {
            // paused

        } else {
            /*if (!BasicGame.orientated)
                this.togglePause();*/

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
                        }

                    } else {
                        open_laptops++;

                        this.damage += (this.game.time.elapsedMS / 1000) * this.getLevelProperty('damage_speed');
                        takingDamage = true;
                    }
                }
                this.laptops[i].button.frame = this.laptops[i].open ? 2 : 0;
            };

            for(var i=0; i < this.npcs.length; i++) { 
                var looking = this.laptops[this.npcs[i].lookAt].open;
                var t = this.laptops[this.npcs[i].lookAt].counter;
                //this.npcs[i].sprite.x = (looking ? this.npcs[i].offset.x : 0) * Phaser.Easing.Circular.InOut((this.game.time.elapsedMS / 1000) * 0.25);
                //this.npcs[i].sprite.y = (looking ? this.npcs[i].offset.y : 0) * Phaser.Easing.Circular.InOut((this.game.time.elapsedMS / 1000) * 0.25);
                this.npcs[i].sprite.x = lerp(this.npcs[i].sprite.x, (looking ? 0 : this.npcs[i].offset.x), clamp01((this.game.time.elapsedMS / 1000) * 0.75));
                this.npcs[i].sprite.y = lerp(this.npcs[i].sprite.y, (looking ? 0 : this.npcs[i].offset.y), clamp01((this.game.time.elapsedMS / 1000) * 0.75));
            }


            var d = (this.damage / this.health);
            this.damageBar.fill.width = this.damageBar.bg.width * d;
            //this.damageBar.fill.tint = Phaser.Color.interpolate("#ffffff", "#ff0000", 10, d * 10, 1.0);

            if (takingDamage) {
                // give some visual feedback
                this.damageBar.angle = -4 + Math.random() * 8;
            } else {
                this.damageBar.angle = 0;
            }

            this.scoreText.text = this.score.toString().split('.')[0] + "P";
            this.progressText.text = this.laptopsPressed + " / " + this.getLevelProperty('laptops_goal');
            
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
                var t = this.tweenLevelText("WIN", 3000); //TODO: localize
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

        this.game.add.existing(this.endGameScreen);
        this.endGameScreen.visible = true;

        if (this.score > BasicGame.lastScore)
            BasicGame.lastScore = this.score;
    },

    toggleFullScreen: function(button) {
        this.game.scale.startFullScreen();
    },

    togglePause: function(pointer) {

        this.pauseScreen.visible = !this.pauseScreen.visible;
    },
    restartGame: function(pointer) {
        this.resetState();
        this.state.start('Game');
    },
    gotoHiscores: function(pointer) {
        this.state.start('Leaderboard');
    },
    openWebsite: function(pointer) {
        window.open("http://www.google.com", "_blank");
    },
    quitGame: function (pointer) {
        this.resetState();
        this.state.start('MainMenu');

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
        this.resetLaptopCounter(laptopObject);
        this.score += 10;
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
