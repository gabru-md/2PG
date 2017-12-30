const WIDTH = 650;
const HEIGHT = 480;
const game = new Phaser.Game(WIDTH, HEIGHT, Phaser.AUTO);

var GameState = {
	init: function(){
	},
	preload: function(){
		this.load.image('background', 'assets/background/background.png');
		this.load.image('zombie', 'assets/players/zombie.png');
		this.load.image('ninja', 'assets/players/ninja.png');
		this.load.image('shuriken', 'assets/players/shuriken.png');
	},
	create: function(){
		this.physics.startSystem(Phaser.Physics.ARCADE);

		this.background = this.game.add.sprite(0, 0, 'background');
		this.ninja = this.game.add.sprite(100, HEIGHT - 150, 'ninja');
		this.zombie = this.game.add.sprite(WIDTH - 100, HEIGHT - 150, 'zombie');
		this.shuriken = this.game.add.sprite(150, HEIGHT - 150, 'shuriken');

		this.game.physics.arcade.enable(this.ninja);
		this.game.physics.arcade.enable(this.zombie);
		this.game.physics.arcade.enable(this.shuriken);

		this.shuriken.enableBody = true;
		this.zombie.enableBody = true;
		
		//this.zombie.body.immovable = true;		

		this.zombie.scale.setTo(0.05);
		this.ninja.scale.setTo(0.15);
		this.shuriken.scale.setTo(0.1);
		this.ninja.anchor.setTo(0.5);
		this.zombie.anchor.setTo(0.5);
		this.zombie.scale.x *= -1;
		this.ninja.scale.x *= -1;
		this.shuriken.anchor.setTo(0.5);
		
		this.ninja.body.collideWorldBounds = true;
		this.zombie.body.collideWorldBounds = true;
		//this.shuriken.body.collideWorldBounds = true;

		this.zombie.health = 5;

		this.cursors = this.input.keyboard.createCursorKeys();
		this.fireButton = this.input.keyboard.addKey(Phaser.KeyCode.SPACEBAR);

	},
	update: function(){
		//this.game.physics.arcade.collide(this.shuriken,this.zombie);
		this.game.physics.arcade.overlap(this.zombie, this.shuriken, this.killShuriken, null, this);
		if(this.shuriken.body.x > WIDTH || this.shuriken.body.y < 0 || this.shuriken.body.y >= HEIGHT){
			this.shuriken.body.x = 150;
			this.shuriken.body.y = this.ninja.body.y;
			this.shuriken.body.velocity.x = 0;
			this.shuriken.body.velocity.y = 0;
		}
		if(this.fireButton.isDown){
			this.shuriken.body.velocity.x = 1000; 
		}
		if(this.cursors.up.isDown){
			this.ninja.body.velocity.y = -300;
			if(this.shuriken.body.x <= 150){
				this.shuriken.body.velocity.y = -300;
			}
		}
		if(this.cursors.down.isDown){
			this.ninja.body.velocity.y = 300;
				this.shuriken.body.velocity.y = 300;
		}
	},
	killShuriken: function(obj1, obj2){
		this.zombie.health -= 1;
		if(!this.zombie.health){
			alert('You Win! You killed the Zombie');
			this.game.state.start('Win');
		}
		this.shuriken.body.x = 150;		
		this.shuriken.body.y = this.ninja.body.y + 20;
		this.shuriken.body.velocity.x = 0;
	}

};

var Win = {
	preload: function(){
		this.load.image('winBackground', 'assets/win/win.png');
	},
	create: function(){
		this.background = this.game.add.sprite(0, 0, 'winBackground');
	},
	update: function(){

	}
};

game.state.add('GameState', GameState);
game.state.add('Win', Win);
game.state.start('GameState');

