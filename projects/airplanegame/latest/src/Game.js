
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
    this.pauseScreen = null;
    this.endGameScreen = null;
    this.countdownText = null;

    this.laptops = [];
    this.damage = 0;
    this.damageBar = {};
    this.score = 0;
    this.startCountdown = 5;

    this.level_laptop_min_open_delay = 2;
    this.level_laptop_max_open_delay = 5;
    this.level_max_damage = 30; // max total seconds laptops have been open
    this.level_laptop_open_speed = 1; // units per second
    this.level_damage_speed = 0.7; // units per second
    this.level_score_speed = 100; // units per second

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

        var group_characters = this.game.add.group();
        var group_laptops = this.game.add.group();

        var laptops = this.laptops;
        for (var i = 0; i < 4; i++) {
            var pos = new Phaser.Point(w * (.18 + .22 * i), h * .6);
            laptops[i] = {};
            laptops[i].index = i;
            laptops[i].character = new Phaser.Sprite(this.game,pos.x,pos.y,'game_character');
            laptops[i].character.anchor.set(0.5,0.5);
            laptops[i].character.scale.x = laptops[i].character.scale.y = 0.8;
            group_characters.add(laptops[i].character);

            laptops[i].button = new Phaser.Button(this.game,pos.x,pos.y, 'game_laptop');
            laptops[i].button.onInputDown.add(this.onHitLaptop, this, 0, laptops[i]);
            
            laptops[i].button.anchor.set(0.5,0.5);
            laptops[i].button.scale.x = laptops[i].button.scale.y = 0.8;
            group_laptops.add(laptops[i].button);
            laptops[i].button.frame = 0;

            this.closeLaptop(laptops[i]);

        };
        
        this.damageBar = {};
        this.damageBar.group = this.game.add.group();
        this.damageBar.group.position.set(w * .35, h * .1);
        this.damageBar.bg = new Phaser.Image(this.game, 0,0,'game_damagebar_bg');
        this.damageBar.bg.anchor.set(0,0.5);
        this.damageBar.group.add(this.damageBar.bg);
        this.damageBar.fill = new Phaser.Image(this.game, 0,0,'game_damagebar_fill');
        this.damageBar.fill.anchor.set(0,0.5);
        this.damageBar.fill.scale.x = 0;
        this.damageBar.fill.width = this.damageBar.bg.width;
        this.damageBar.group.add(this.damageBar.fill);
            
        var style = { font: "18px Arial", fill: "#ffffff", align: "left" };
        this.scoreText = this.game.add.text(5, 5, "0P", style);

        this.game.add.existing(ButtonWithText(this, 50, h-35, "pause", 'graphic_smallbutton', 13, "#ffffff", this.togglePause));

        this.countdownText = Label(this, this.game.width * .5, this.game.height * .5 - 40, "", 64, "#ff0000", 'center');
        this.countdownText.visible = false;
        this.game.add.existing(this.countdownText);

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

        this.endGameScreen.title = Label(this,0 , 0, "GAME OVER", 64, "#00ff00", 'center');
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


	},

	update: function () {


        if (this.startCountdown > 0) {
            this.startCountdown -= this.game.time.elapsedMS / 1000;
            this.countdownText.visible = this.startCountdown > 0;
            if (this.startCountdown <= 4) {
                if (this.startCountdown > 1)
                    this.countdownText.text = (this.startCountdown).toString().substring(0,1);
                else
                    this.countdownText.text = 'GO!';
                this.countdownText.scale.set(0.1 + 0.9 * (this.startCountdown % 1));
            }
        }

        if (this.pauseScreen.visible || this.endGameScreen.visible || this.startCountdown > 1) {
            // paused

        } else {
            var takingDamage = false;

            for (var i = 0; i < this.laptops.length; i++) {
                this.laptops[i].counter += (this.game.time.elapsedMS / 1000) * this.level_laptop_open_speed; 

                var wasOpen = this.laptops[i].open;
                this.laptops[i].open = this.laptops[i].counter > 0;
                
                if (this.laptops[i].open) {
                    
                    //this.damage += this.laptops[i].counter;
                    this.damage += (this.game.time.elapsedMS / 1000) * this.level_damage_speed;

                    takingDamage = true;
                    if (!wasOpen) {
                        // TODO: some visual feedback that the laptop just opened   
                    }
                }
                this.laptops[i].button.frame = this.laptops[i].open ? 1 : 0;
            };

            var d = (this.damage / this.level_max_damage);
            this.damageBar.fill.width = this.damageBar.bg.width * d;
            //this.damageBar.fill.tint = Phaser.Color.interpolate("#ffffff", "#ff0000", 10, d * 10, 1.0);

            if (takingDamage) {
                // give some visual feedback
                this.damageBar.angle = -4 + Math.random() * 8;
            } else {
                this.damageBar.angle = 0;
            }

            this.score += (this.game.time.elapsedMS / 1000) * this.level_score_speed;
            this.scoreText.text = this.score.toString().split('.')[0] + "P";
            
            if(this.damage > this.level_max_damage) {
                // lose
                this.onEndGame();
            }
        }
        

	},

    onHitLaptop: function(button, game, laptopObject) {
        //console.log("hit laptop " + laptopObject.index);
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

        this.endGameScreen.hiscore.text = this.score.toString().split('.')[0] + "p";

        this.game.add.existing(this.endGameScreen);
        this.endGameScreen.visible = true;
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
        //
    },
    openWebsite: function(pointer) {
        window.open("http://www.google.com", "_blank");
    },
    quitGame: function (pointer) {
        this.resetState();
        this.state.start('MainMenu');

    },
    ignore: function(pointer){},

    // reset
    resetState: function(point) {
        this.scoreText = null;
        this.pauseScreen = null;
        this.endGameScreen = null;

        this.laptops = [];
        this.damage = 0;
        this.damageBar = {};
        this.score = 0;
        this.startCountdown = 5;
    },
	
    // gameplay
    closeLaptop: function(laptopObject) {
        laptopObject.counter = 0 - (this.level_laptop_min_open_delay + Math.random() * this.level_laptop_max_open_delay);
    }

};
