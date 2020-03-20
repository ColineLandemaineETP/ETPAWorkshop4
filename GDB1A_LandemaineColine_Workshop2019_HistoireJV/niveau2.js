var config = {
	type: Phaser.AUTO,
	width: 1126,
	height: 845,
	physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 200 },  
            debug: false
        }
    },
	scene: {
		init: init,
		preload: preload,
		create: create,
		update: update
	}

};

var game = new Phaser.Game(config);

function init(){
	var platforms;
	var player;
	var cursor;
	var monster;
	var poisons;
	var atari;
	var victory;	
}

//aller chercher les assets dans le dossier

function preload(){
	this.load.image('background','assets/sky.png');	
	this.load.image('sol','assets/platform.png');
	this.load.image('short','assets/platform1.png');
	this.load.image('short2','assets/platform2.png');
    this.load.spritesheet('perso','assets/dude.png',{frameWidth: 80, frameHeight: 66});
    this.load.spritesheet('monster','assets/mob.png',{frameWidth: 58, frameHeight: 55});
    this.load.image('poison','assets/poison.png');
    this.load.image('objective','assets/atari.png');
    this.load.image('victory','assets/victory.png');
    

}

//charger les assets du dossier

function create(){
	this.add.image(0, 0, 'background').setOrigin(0, 0);

	platforms = this.physics.add.staticGroup();
	platforms.create(450,825,'sol').setScale(1).refreshBody();       //refreshbody: permet de régler la hitbox par rapport à l'asset
	platforms.create(150,320,'short').setScale(0.35).refreshBody();
	platforms.create(1000,280,'short').setScale(0.35).refreshBody();
	platforms.create(550,400,'short2').setScale(0.35).refreshBody();
	platforms.create(700,520,'short').setScale(0.35).refreshBody();
	platforms.create(500,200,'short2').setScale(0.35).refreshBody();
	platforms.create(750,325,'short2').setScale(0.30).refreshBody();
	platforms.create(355,600,'short').setScale(0.35).refreshBody();
	platforms.create(650,680,'short2').setScale(0.35).refreshBody();
	platforms.create(300,460,'short2').setScale(0.35).refreshBody();



    //emplacement Monster

    monster = this.physics.add.sprite(1050,690,'monster');

    //emplacement objective        
    
    atari = this.physics.add.sprite(500,165,'objective');    //en violet (st): coord.
    
    //emplacement des poisons

    poisons = this.physics.add.group();
    var poison = poisons.create(945, 232, 'poison');
    var poison2 = poisons.create(680, 472, 'poison');
    var poison3 = poisons.create(120, 275, 'poison');

    poison.setCollideWorldBounds(true);



	//Player-Chara

    player = this.physics.add.sprite(100,723,'perso'); //endroit ou le personnage spawn
	player.setCollideWorldBounds(true);
	player.setBounce(0);   //pas de rebondissement
	player.body.setGravityY(100);
	this.physics.add.collider(player,platforms);

	cursor = this.input.keyboard.createCursorKeys();

	this.physics.add.collider(monster, platforms);         //!\ créer le perso avant 
    this.physics.add.collider(monster, [player], hitmonster, null, this);

    this.physics.add.collider(poisons, platforms);
    this.physics.add.collider(player, poisons, hitPoison, null, this);

    this.physics.add.collider(atari, platforms);
    this.physics.add.collider(player, atari, hitAtari, null, this);


	//Fram de l'asset dude selon sa direction - Le setFlip fait automatiquement tourner le sprite dans la direction voulu
    //Creation d'animations

    this.anims.create({
		key:'right',
		frames: this.anims.generateFrameNumbers('perso', {start: 0, end: 3}),
		frameRate: 10,
		repeat: -1
	});

    this.anims.create({
		key:'stop',
		frames: this.anims.generateFrameNumbers('perso', {start: 3, end: 3}),
		frameRate: 20,
		repeat: -1
	});

	this.anims.create({
		key:'jump',
		frames: this.anims.generateFrameNumbers('perso', {start: 4, end: 4}),
		frameRate: 20,
		repeat: -1
	});
 
    this.anims.create({
		key:'left',
		frames: this.anims.generateFrameNumbers('monster', {start: 0, end: 3}),
		frameRate: 20,
		repeat: -1
	});


}

function hitmonster (player, monster){                          //création de la fonction de collision
	player.setTint(0x3E3E3E); 
	playerAlive = false;                    //entre le mob et le perso - Mort du perso
};

function hitPoison (player, poison){             
   player.setTint(0x3E3E3E);
   playerAlive = false;
};


function hitAtari (player, nes){             
   alert("victory\nManque de temps, ici est sensé apparaître une illustration en liens avec la console Atari");
   this.add.image(0, 0, 'victory').setOrigin(0, 0);
};



var aFaitPremierMouvement = false;
var playerAlive = true;




function update(){

    //animation selon la direction horizontale

    //si playerAlive == true, on peut contrôler le perso, si false, on peut plus
    if (playerAlive == true)
    {
	    if (player.body.touching.down)
	    {
	        if(cursor.left.isDown){
	            player.anims.play('right',true);
	            player.setVelocityX(-350);                    //if-Else "soit je vais à droite, 
	            player.setFlipX(true);                       //soit à gauche ou je stop".
	        }
	        else if(cursor.right.isDown) {
	            player.anims.play('right',true);
	            player.setVelocityX(350);
	            player.setFlipX(false);
	        }
	        else {
	            player.anims.play('stop',true);                        //x: coordonées hori
	            player.setVelocityX(0);                                //y: coordonées verti
	        } 
	    }


	    else
	    {
	        if(cursor.left.isDown){          //En l'air, changer de direction
	            player.setVelocityX(-350);   // sans changer l'animation du saut                 
	            player.setFlipX(true);                       
	        }
	        else if(cursor.right.isDown) {
	            player.setVelocityX(350);
	            player.setFlipX(false);
	        }
	        else {
	            player.setVelocityX(0);
	        } 
	    }


	    //animation du saut 

	    if(cursor.up.isDown && player.body.touching.down){
	        player.setVelocityY(-300);  //hauteur du saut, plus les chiffres sont petits, moins le perso sautera haut
	        player.anims.play('jump',true);    //animation du saut
	    }

	    if(cursor.down.isDown){
	        player.setVelocityY(500); //vitesse à laquelle le perso retombe avec la touche du bas
	    }

	     
    }
    else if(playerAlive == false)
    {

    }

      //faire déambuler le mob indéfiniment 

    monster.anims.play('left',true);

	      if(aFaitPremierMouvement == false)
	    {
	    monster.setVelocityX(-200);    //vitesse à la quelle il déambule                
	    monster.setFlipX(true);        //- = vers la gauche , sinon, vers la droite
	    }

	    if(monster.x <= 10){
	    monster.setVelocityX(200);
	    monster.setFlipX(false);       //comme le sprite est vers la droite, pas besoin de flip
	    aFaitPremierMouvement = true;
	    }

	    if(monster.x >= 1100){
	    monster.setVelocityX(-200);    //retour en arrière-demi tours
	    monster.setFlipX(true);     
	    }  	
}


