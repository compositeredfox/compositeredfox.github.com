
BasicGame.Leaderboard = function (game) {

    
};

BasicGame.Leaderboard.prototype = {

    create: function () {

        var bg = this.add.image(0, 0, 'mainmenu_bg');
        bg.width = this.game.width;
        bg.height = this.game.height;

        this.game.add.existing(ButtonWithText(this, 100, 35, "Main Menu", 'graphic_longbutton', 15, "#ffffff", this.gotoMainMenu)); //TODO: localize

        this.table = new Phaser.Group(this.game);

        this.table.title = Label(this,0 , 0, "HIGH SCORES", 32, "#00000", 'center');
        this.table.title.anchor.set(0.5,1);
        this.table.add(this.table.title);

        this.table.hiscoretable = new Phaser.Group(this.game);
        var names = ["Lid shutter", "Killer 2", "Hunter", "Klasse", "Maja", "Lid shutter", "Killer 2", "Hunter", "Klasse", "Maja"];
        var scores = [7500, 5000, 3500, 2500, 1000, 500, 400, 300, 200, 100];
        for (var i = 0; i < 10; i++) {
            var hiscoreline = new Phaser.Group(this.game);
            hiscoreline.add(new Phaser.Text(this.game, -110, 0, (i<9 ? "0" : "")+(i+1), { font: "18px Arial", fill: "#000000", align: "right"}));
            hiscoreline.add(new Phaser.Text(this.game, -80, 0, names[i], { font: "18px Arial", fill: "#000000", align: "left"}));
            hiscoreline.add(new Phaser.Text(this.game, 70, 0, scores[i] + "p", { font: "18px Arial", fill: "#000000", align: "left"}));
            hiscoreline.position.y = i * 20;
            this.table.hiscoretable.add(hiscoreline);
        };
        this.table.hiscoretable.y = 0;
        this.table.add(this.table.hiscoretable);

        this.table.x = this.game.width * .5;
        this.table.y = 105;


    },

    update: function () {

    },

    gotoMainMenu: function (pointer) {
        TransitionToState('MainMenu', this.stage);
    }

};
