var PLAY =1;
var END = 0;
var gameState = PLAY;
var trex,runningtrex,deadtrex;
var ground,invisibleground,groundimage;
var score = 0;
var cloudimage,CloudsGroup;
var obstaclesGroup, obstacle1, obstacle2, obstacle3, obstacle4, obstacle5, obstacle6;
var restart,restartimage,gameOver,gameoverimage;
var skyimg , sky;
localStorage["HighestScore"] = 0;

function preload (){
  
  runningtrex = loadAnimation("trex1.png", "trex3.png", "trex4.png");
  deadtrex = loadAnimation("trex_collided.png");
  groundimage = loadImage("ground2.png");
  cloudimage = loadImage("cloud.png");
  obstacle1 = loadImage("obstacle1.png");
  obstacle2 = loadImage("obstacle2.png");
  obstacle3 = loadImage("obstacle3.png");
  obstacle4 = loadImage("obstacle4.png");
  obstacle5 = loadImage("obstacle5.png");
  obstacle6 = loadImage("obstacle6.png");
  gameoverimage = loadImage("gameOver.png");
  restartimage = loadImage("restart.png");
  skyimg  = loadImage("desert2.jpg");
}
function setup() {
  createCanvas(800, 700);
  
  sky =createSprite(width/2 ,425 ,800,700)
  sky.addImage(skyimg)
  sky.scale = 2.0

  trex = createSprite(250,580,170,200);
  trex.addAnimation("running",runningtrex);
  trex.addAnimation("collided", deadtrex );
  trex.scale = 0.5;
  
  ground = createSprite(500,580,1100,40);
  ground.addImage(groundimage);
  ground.x = ground.width/2;
  
   gameOver = createSprite(500,500);
  gameOver.addImage(gameoverimage);
  
  restart = createSprite(500,540);
  restart.addImage(restartimage);
  
  gameOver.scale = 0.5;
  restart.scale = 0.5;

  gameOver.visible = false;
  restart.visible = false;
 
  
  invisibleground = createSprite(500,590 , 600 , 10);
  invisibleground.visible = false;
  CloudsGroup = new Group();
  obstaclesGroup = new Group();

  
}

function draw() {
  background(255);

  text("score :"+ score , 450,200);
  if (gameState == PLAY){
    
    camera.x = trex.x
    camera.y = trex.y

    score = score+Math.round(getFrameRate()/60);
    ground.velocityX = -(6*3+score/100);
    if (keyDown ("space")&& trex.y >= 159 ){
       trex.velocityY = -12;
    }
    if (ground.x<0){
      ground.x = ground.width/2;
    }
    
     spawnclouds();
    spawnobstacles();
    if(obstaclesGroup.isTouching(trex)){
     gameState = END; 
    }
  }
  else if (gameState == END){
    ground.velocityX = 0 ;   
    obstaclesGroup.setVelocityXEach(0);
    CloudsGroup.setVelocityXEach(0);
        //change the trex animation
    trex.changeAnimation("collided",deadtrex);
    
    //set lifetime of the game objects so that they are never destroyed
    obstaclesGroup.setLifetimeEach(-1);
    CloudsGroup.setLifetimeEach(-1);
    gameOver.visible = true;
    restart.visible = true;
    if(mousePressedOver(restart)) {
      reset();
    }

  }
  trex.collide(invisibleground);
  trex.velocityY += 0.8;       
  imageMode(CENTER);   
  drawSprites()
}
function spawnclouds (){
  if (frameCount%60 == 0){
     var clouds = createSprite(800,520 , 40 , 10) ;
    clouds.y = random(80,120);
    clouds.addImage(cloudimage);
    clouds.scale = 0.5;
    clouds.velocityX = -3;
    clouds.lifetime = 200;
    clouds.depth = trex.depth;
    trex.depth += 1;
    CloudsGroup.add(clouds);
  }
}
function spawnobstacles(){
   if (frameCount%80 == 0 ) {
     var obstacles = createSprite(800, 565 , 10 , 40)
     var rand = Math.round(random(1,6));
      obstacles.velocityX = -(6*3+score/100);
    switch(rand) {
      case 1 : obstacles.addImage(obstacle1);
        break;
     case 2 : obstacles.addImage(obstacle2);
     break;
      case 3: obstacles.addImage(obstacle3);
         break;
      case 4 : obstacles.addImage(obstacle4);
        break;
        case 5 : obstacles.addImage(obstacle5);
        break;
        case 6 : obstacles.addImage(obstacle6);
    }
        obstacles.scale = 0.5;
        obstacles.lifetime = 101;
       obstaclesGroup.add(obstacles);
 
   }
}
function reset(){
  gameState = PLAY;
  gameOver.visible = false;
  restart.visible = false;
  
  obstaclesGroup.destroyEach();
  CloudsGroup.destroyEach();
  
  trex.changeAnimation("running",runningtrex);
  
  if(localStorage["HighestScore"]<score){
    localStorage["HighestScore"] = score;
  }
  console.log(localStorage["HighestScore"]);
  
  score = 0;
  
}
function keyPressed() {
	if (keyCode === UP_ARROW && trex.y >= 560 && gameState == PLAY ) {

	  trex.velocityY = -12 ;

	}
}