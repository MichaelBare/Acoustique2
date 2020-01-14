let font,fontsize = 60;

let mic;

let nsquare = 20;

let hsquare;

let offset = 40;

function preload() {
  // Ensure the .ttf or .otf font stored in the assets directory
  // is loaded before setup() and draw() are called
  font = loadFont('SourceSansPro-Regular.otf');
}

function setup() {
  createCanvas(windowWidth, windowHeight);

  hsquare = (height - 2*offset)/nsquare;
  // Create an Audio input
  mic = new p5.AudioIn();

  // start the Audio Input.
  // By default, it does not .connect() (to the computer speakers)
  mic.start();

  // Set text characteristics
    textFont(font);
    textSize(fontsize);
    textAlign(CENTER, CENTER);
}

function draw() {
  background(255);

  frameRate(5);

  // Get the overall volume (between 0 and 1.0)
  let vol = mic.getLevel();
  
  stroke(255);
  strokeWeight(4);
  fill(0,200,50);
  
  let h = map(vol, 0, 1, height, 0);
  let n = floor((height-h)/hsquare);
  if(n>20){
    n=20;
  }
  for(var i=0;i<n;i++){ 
    rect(width/2,height-offset-(i+1)*hsquare,width/4,hsquare);
  }
  noFill();

  stroke(0);
  rect(width/2,height-offset-nsquare*hsquare,width/4,nsquare*hsquare);

  fill(30,65,130);
  text('Intensité : ' + vol.toFixed(2) , width/4 ,height/2);
}

