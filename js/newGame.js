const WIDTH = 800;
const HEIGHT = 600;

const game = new Phaser.Game(WIDTH, HEIGHT, Phaser.AUTO);

var GameView = {
	init: function(){
		this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
		this.scale.pageAlignVertically = true;
		this.scale.pageAlignHorizontally = true;

		this.game.physics.startSystem(Phaser.Physics.ARCADE);
		this.game.physics.arcade.gravity.y = 1000;
	},
	preload: function(){
		this.load.image('background', 'new-assets/sprites/background/background.png');
		this.load.image('earth', 'new-assets/sprites/extras/earth.png');
		this.load.image('teacher', 'new-assets/sprites/players/teacher.png');
		this.load.image('student', 'new-assets/sprites/players/student.png');
	},
	create: function(){
		// Setting up variables
		this.jumpButtonTeacher;
		this.jumpButtonStudent;
		this.jumpTimerTeacher;
		this.jumpTimerStudent;

		// Setting Bounds to the world
		this.game.physics.setBoundsToWorld();

		// Setting up Background
		this.background = this.game.add.sprite(0, 0, 'background');
		this.background.height = this.game.height;
		this.background.width = this.game.width;

		// Setting up Earth at places
		this.earthGroup = this.game.add.physicsGroup(Phaser.Physics.ARCADE);
		this.earthGroup.create(150,150, 'earth');
		this.earthGroup.create(WIDTH - 150, 150, 'earth');
		this.earthGroup.create(WIDTH/2, HEIGHT/2, 'earth');
		this.earthGroup.create(150,HEIGHT - 150, 'earth');
		this.earthGroup.create(WIDTH - 150, HEIGHT - 150, 'earth');

		this.earthGroup.forEachAlive(this.resizeEarth, this);
		this.earthGroup.setAll('body.allowGravity', false);
		this.earthGroup.setAll('body.immovable', true);

		// Creating player models
		this.student = this.game.add.sprite(150, 0, 'student');
		this.teacher = this.game.add.sprite(WIDTH - 150, HEIGHT - 300, 'teacher');

		// Scalling Player Models
		this.student.scale.setTo(0.1);
		this.teacher.scale.setTo(0.15);
		this.student.anchor.setTo(0.5,1);
		this.teacher.anchor.setTo(0.5,1);

		// Setting up Physics for Bodies
		this.game.physics.arcade.enable(this.student);
		this.game.physics.arcade.enable(this.teacher);
		this.student.body.allowGravity = true;
		this.teacher.body.allowGravity = true;
		this.earthGroup.setAll('body.allowGravity', false);

		
		
	},
	update: function(){
		// Adding Collisions
		this.game.physics.arcade.collide(this.earthGroup, this.student);
		this.game.physics.arcade.collide(this.earthGroup, this.teacher);
		this.game.physics.arcade.collide(this.student, this.teacher);

	},
	resizeEarth: function(member){
		// function for setting individual scale
		member.scale.set(0.3);
		member.anchor.setTo(0.5);
	}
};

game.state.add('GameView', GameView);
game.state.start('GameView');