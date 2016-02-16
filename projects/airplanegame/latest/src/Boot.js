BasicGame = {

    lastScore: -1,

    /* If the music in your game needs to play through-out a few State swaps, then you could reference it here */
    music: null,

    // levels JSON
    leveldata: null,

    /* Your game can check BasicGame.orientated in internal loops to know if it should pause or not */
    orientated: false,

    openLeaderboards: false,
    seenTutorial: false,

    cheatCodes: true,

    scale: 1,
    scaleY: 1,
    width:0,
    height:0

};

BasicGame.Boot = function (game) {
};

BasicGame.Boot.prototype = {

    init: function () {

        this.input.maxPointers = 1;

        if (this.game.device.desktop)
        {
            this.scale.scaleMode = Phaser.ScaleManager.RESIZE;
            //this.scale.setMinMax(480, 270, 1920, 1080);
            this.scale.pageAlignHorizontally = true;
            this.scale.pageAlignVertically = true;
        }
        else
        {
            this.scale.scaleMode = Phaser.ScaleManager.RESIZE;
            this.scale.setMinMax(480, 270, 1920, 1080);
            this.scale.pageAlignHorizontally = true;
            this.scale.pageAlignVertically = true;
            this.scale.forceOrientation(true, false);
            //this.scale.setResizeCallback(this.gameResized, this);
            this.scale.enterIncorrectOrientation.add(this.enterIncorrectOrientation, this);
            this.scale.leaveIncorrectOrientation.add(this.leaveIncorrectOrientation, this);
        }

        //this.game.canvas.style.cursor = 'none';

        this.scale.onSizeChange.add(this.onSizeChanged, this);
        this.onSizeChanged();

    },

    preload: function () {

        //  Here we load the assets required for our preloader (in this case a background and a loading bar)
        this.load.image('preloaderBackground', 'images/preloader_background.png');
        this.load.image('preloaderBar', 'images/preloader_bar.png');

    },

    create: function () {

        this.state.start('Preloader');

    },

    onSizeChanged: function () {
        console.log('resize game');
        BasicGame.scale = clamp01(this.game.width / 850);
        BasicGame.scaleY = clamp01(this.game.height / 730) / BasicGame.scale;
        BasicGame.width = this.game.width / BasicGame.scale;
        BasicGame.height = this.game.height / BasicGame.scale;
        this.world.scale.setTo(BasicGame.scale,BasicGame.scale);
        
    },

    enterIncorrectOrientation: function () {

        BasicGame.orientated = false;

        document.getElementById('orientation').style.display = 'block';

    },

    leaveIncorrectOrientation: function () {

        BasicGame.orientated = true;

        document.getElementById('orientation').style.display = 'none';

    }

};