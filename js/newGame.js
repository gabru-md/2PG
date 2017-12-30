const WIDTH = 800;
const HEIGHT = 600;

const game = new Phaser.Game(WIDTH, HEIGHT, Phaser.AUTO);

var GameView = {
	init: function(){
		this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
		this.scale.pageAlignVertically = true;
		this.scale.pageAlignHorizontally = true;

		this.game.physics.startSystem(Phaser.Physics.ARCADE);
		this.game.physics.arcade.gravity.y = 1250;
	},
	preload: function(){
		this.load.image('background', 'new-assets/sprites/background/background.png');
		this.load.image('earth', 'new-assets/sprites/extras/earth.png');
		this.load.image('teacher', 'new-assets/sprites/players/teacher.png');
		this.load.image('student', 'new-assets/sprites/players/student.png');
		this.load.image('assignment', 'new-assets/sprites/extras/assignment.png');
		this.load.image('homework', 'new-assets/sprites/extras/homework.png');
	},
	create: function(){
		// Setting up variables
		this.jumpButtonTeacher;
		this.jumpButtonStudent;
		this.jumpTimerTeacher = 0;
		this.jumpTimerStudent = 0;
		this.jumpSpeed = 650;
		this.movementSpeed = 300;
		this.shootingVelocity = 600;
		this.studentShootTime = 0;
		this.teacherShootTime = 0;
		// Setting Bounds to the world
		this.game.physics.setBoundsToWorld();

		// Setting up Background
		this.background = this.game.add.sprite(0, 0, 'background');
		this.background.height = this.game.height;
		this.background.width = this.game.width;

		// Setting up Earth at places
		this.earthGroup = this.game.add.physicsGroup(Phaser.Physics.ARCADE);
		this.earthGroup.create(150,200, 'earth');
		this.earthGroup.create(WIDTH - 150, 200, 'earth');
		this.earthGroup.create(WIDTH/2, HEIGHT/2 + 50, 'earth');
		this.earthGroup.create(150,HEIGHT - 100, 'earth');
		this.earthGroup.create(WIDTH - 150, HEIGHT - 100, 'earth');

		this.earthGroup.forEachAlive(this.resizeEarth, this);
		this.earthGroup.setAll('body.allowGravity', false);
		this.earthGroup.setAll('body.immovable', true);

		// Creating player models
		this.student = this.game.add.sprite(150, 0, 'student');
		this.teacher = this.game.add.sprite(WIDTH - 150, HEIGHT - 300, 'teacher');

		// Health to Players
		this.student.health = 5;
		this.teacher.health = 5;

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

		// Setting up Buttons
		this.jumpButtonStudent = this.game.input.keyboard.addKey(Phaser.Keyboard.W);
		this.jumpButtonTeacher = this.game.input.keyboard.addKey(Phaser.Keyboard.UP);			

		// Setting up Cursors For teacher
		this.cursors = this.input.keyboard.createCursorKeys(); 
		// Settign up keys For Student
		this.leftKey = this.game.input.keyboard.addKey(Phaser.Keyboard.A);
		this.rightKey = this.game.input.keyboard.addKey(Phaser.Keyboard.D);

		// Creating Bullets for Teacher and Student
		// For Teacher
		this.assignments = this.game.add.group();
		this.assignments.enableBody = true;
		this.assignments.physicsBodyType = Phaser.Physics.ARCADE;
		this.assignments.createMultiple(10, 'assignment');
		this.assignments.setAll('outOfBoundsKill', true);
		this.assignments.setAll('checkWorldBounds', true);

		this.shootKeyTeacher = this.game.input.keyboard.addKey(Phaser.Keyboard.CONTROL);

		// For Student
		

	},
	update: function(){
		// Adding Collisions
		this.game.physics.arcade.collide(this.earthGroup, this.student);
		this.game.physics.arcade.collide(this.earthGroup, this.teacher);
		this.game.physics.arcade.collide(this.student, this.teacher);
		
		// Setting Vel to 0
		this.student.body.velocity.x = 0;
		this.teacher.body.velocity.x = 0;

		// Check for Wins


		// Setting up Key Presses
		// Handling Jump Events
		if(this.jumpButtonStudent.isDown && !this.student.body.velocity.y && this.game.time.now > this.jumpTimerStudent){
			// Jump Student
			this.student.body.velocity.y = -this.jumpSpeed;
			this.jumpTimerStudent = game.time.now + 500;
		}
		if(this.jumpButtonTeacher.isDown && !this.teacher.body.velocity.y && this.game.time.now > this.jumpTimerTeacher){
			// Jump Teacher
			this.teacher.body.velocity.y = -this.jumpSpeed;
			this.jumpTimerTeacher = game.time.now + 500;
		}

		// Handling Student's Movements
		if(this.leftKey.isDown){
			this.student.body.velocity.x = -this.movementSpeed;
		}
		if(this.rightKey.isDown){
			this.student.body.velocity.x = this.movementSpeed;
		}

		// Handling Teacher's Movement
		if(this.cursors.left.isDown){
			this.teacher.body.velocity.x = -this.movementSpeed;
		}
		if(this.cursors.right.isDown){
			this.teacher.body.velocity.x = this.movementSpeed;
		}

		// Handling Shooting for Student
		if(this.shootKeyTeacher.isDown){
			this.shootTeacher();
		}
	},
	resizeEarth: function(member){
		// function for setting individual scale
		member.scale.set(0.05);
		member.anchor.setTo(0.5);
	},
	shootTeacher: function(){
		if(game.time.now > this.studentShootTime){
			this.assignmentToShoot = this.assignments.getFirstExists(false);

			if(this.assignmentToShoot){
				this.assignmentToShoot.reset(this.teacher.x, this.teacher.y);
				this.assignmentToShoot.body.velocity.x = -this.shootingVelocity;
				this.assignmentToShoot.scale.setTo(0.05);
				this.assignmentToShoot.anchor.setTo(0.5,1);
				this.assignmentToShoot.body.allowGravity = false;
				this.studentShootTime = this.game.time.now + 1000;
			}
		}
	}
};

game.state.add('GameView', GameView);
game.state.start('GameView');