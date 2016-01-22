
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

    this.quitButton = null;
    this.scoreText = null;

    this.laptops = [];
    this.damage = 0;
    this.damageBar = {};
    this.score = 0;

    this.level_laptop_min_open_delay = 2;
    this.level_laptop_max_open_delay = 5;
    this.level_max_damage = 30; // max total seconds laptops have been open
    this.level_damage_speed = 1; // units per second
    this.level_score_speed = 100; // units per second

};

BasicGame.Game.prototype = {

	create: function () {

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
        this.scoreText = this.game.add.text(5, 5, "0", style);

        this.quitButton = this.add.button(5, h-45, 'game_quitbutton', this.quitGame, this);


	},

	update: function () {
        var takingDamage = false;

        this.damage = 0;

        for (var i = 0; i < this.laptops.length; i++) {
            this.laptops[i].counter += (this.game.time.elapsedMS / 1000) * this.level_damage_speed; 

            var wasOpen = this.laptops[i].open;
            this.laptops[i].open = this.laptops[i].counter > 0;
            
            if (this.laptops[i].open) {
                this.damage += this.laptops[i].counter;
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
        this.scoreText.text = this.score.toString().substring(0,4);
        
        if(this.damage > this.level_max_damage) {
            // lose
            //this.state.start('MainMenu');
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

    toggleFullScreen: function(button) {
        this.game.scale.startFullScreen();
    },

	quitGame: function (pointer) {

		//	Here you should destroy anything you no longer need.
		//	Stop music, delete sprites, purge caches, free resources, all that good stuff.

		//	Then let's go back to the main menu.
		this.state.start('MainMenu');

	},

    closeLaptop: function(laptopObject) {
        laptopObject.counter = 0 - (this.level_laptop_min_open_delay + Math.random() * this.level_laptop_max_open_delay);
    }

};
