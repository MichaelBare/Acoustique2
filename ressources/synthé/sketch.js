var piano

let font,fontsize = 24;

//Types d'oscillateurs
var types = [
    'sine', 'triangle', 'sawtooth', 'square'
]

var typesfr = ['sinus','triangle','dent de scie', 'carrée']

var amp = 0.4;

var osc, env;

var oscilloscope;

//Les paramètres de l'enveloppe
var attackLevel = 0.8;
var releaseLevel = 0;

var attackTime = 0.001;
var decayTime = 0.2;
var susPercent = 0.4;
var releaseTime = 0.5;


//Slider
var aSlider;
var tSlider;

function preload() {
  // Ensure the .ttf or .otf font stored in the assets directory
  // is loaded before setup() and draw() are called
  font = loadFont('SourceSansPro-Regular.otf');
}


function setup() {
  createCanvas(windowWidth, windowHeight);
	piano = new PianoKeyboard(0,3*height/4,width,height/4 -10);

	
	
	// creation des sliders
	
  ampSlider = createSlider(0, 100, 40);
  ampSlider.position(20, height/20);
	ampSlider.input(changeAmpl);
	tSlider = createSlider(1, 4, 1);
  tSlider.position(20, 2*height/20);
	tSlider.input(changeForm);
	bSlider = createSlider(0,8,4);
	bSlider.position(20, 3* height/20);
	bSlider.input(changeBase);
	
	ASlider = createSlider(0, 10, 0.1,0.1);
	ASlider.style('rotate',270);
  	ASlider.position(20, 6*height/20);
	ASlider.input(changeEnv);
	DSlider = createSlider(0, 10, 0.1,0.1);
	DSlider.style('rotate',270);
  	DSlider.position(60, 6*height/20);
	DSlider.input(changeEnv);
	SSlider = createSlider(0, 1, 0.0,0.01);
	SSlider.style('rotate',270);
  	SSlider.position(100, 6*height/20);
	SSlider.input(changeEnv);
	RSlider = createSlider(0, 10, 0, 0.1);
	RSlider.style('rotate',270);
  	RSlider.position(140, 6*height/20);
	RSlider.input(changeEnv);

	/*RSlider = createSlider(-50, 50, 0, 1);
  	RSlider.position(20, 7*height/10);
	RSlider.input(changeEnv);*/

	
	env = new p5.Envelope();
  env.setADSR(ASlider.value(), DSlider.value(), SSlider.value(), RSlider.value());
  env.setRange(attackLevel, releaseLevel);
	env.mult(amp);

	osc = new p5.Oscillator('sine');
	//osc = new p5.TriOsc();
  osc.amp(env);
	osc.start();

	fft = new p5.FFT();

	//Analyse du premier fichier audio chargé par défaut
	fft.setInput(osc);
	
	
	// Création de l'oscilloscope
	oscilloscope = new Oscilloscope(fft, 1, 2*width/3,0,width/3,height/2);

	// Set text characteristics
    textFont(font);
    textSize(fontsize);
    textAlign(LEFT, CENTER);
  
}

function draw() {
	background(255);
	piano.display();
	oscilloscope.display(); 
	strokeWeight(1);
	stroke(0);
	fill(30,65,130);
	text('Amplitude : '+ amp, ampSlider.x * 2 + ampSlider.width, ampSlider.y);
	text('Forme : '+ typesfr[tSlider.value()-1], tSlider.x * 2 + tSlider.width, tSlider.y);
	text('Base ', bSlider.x * 2 + bSlider.width, bSlider.y);

	translate(ASlider.x, ASlider.y); 
	rotate(HALF_PI);
	text('A : '+ ASlider.value(), ASlider.x, ASlider.y);
	

	if(piano.getNoteOn()){
    	fill(30,65,130);
    	text(midiToFreq(piano.getNote()) + ' Hz', 20, 3*height/8);
  	}
}

function changeForm(){
	osc.stop();
	var val = tSlider.value()-1;
	if(val == 0){
		osc = new p5.SinOsc();
		osc.amp(env);
	} else {
		osc = new p5.Oscillator(types[val]);
		osc.amp(env);
	}
	osc.start();
	fft.setInput(osc);
}

function changeBase(){
	piano.setBase(bSlider.value());
}

function changeAmpl(){
	amp = ampSlider.value()/100.;
	env.mult(amp);
}

function changeEnv(){
	env.setADSR(ASlider.value(), DSlider.value(), SSlider.value(), RSlider.value());
	env.mult(amp);
}
  
function mousePressed() {
 	piano.updatePress(mouseX,mouseY);
	if(piano.getNoteOn()){
		osc.freq(midiToFreq(piano.getNote()))
		env.play(osc);
		env.triggerAttack();
	}
}

function mouseReleased() {
	piano.updateRelease();
	env.triggerRelease();
	//env.stop();
	//osc.fade(0,0.2);
}

function mouseDragged() {
	piano.updateDragg(mouseX,mouseY)
	if(piano.getNoteOn()){
		osc.freq(midiToFreq(piano.getNote()))
	}
}
