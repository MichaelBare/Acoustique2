var piano

let font,fontsize = 24;



var amp = 0.6;

var oscNum = 10
var osc = []
var env = []
var hSliders = []

var oscilloscope;
var spectroscope;

//Les paramètres de l'enveloppe
var attackLevel = 0.8;
var releaseLevel = 0;

var attackTime = 0.001;
var decayTime = 0.2;
var susPercent = 0.4;
var releaseTime = 0.5;




function preload() {
  // Ensure the .ttf or .otf font stored in the assets directory
  // is loaded before setup() and draw() are called
  font = loadFont('SourceSansPro-Regular.otf');
}


function setup() {
    background(color(0,30,38));
    createCanvas(windowWidth, windowHeight);
	piano = new PianoKeyboard(0,3*height/4,width,height/4 -10);

	
	
	// creation des sliders
	
    
	
	bSlider = createSlider(0,8,4);
	bSlider.position(150, 1*height/20);
	bSlider.input(changeBase);
	
	ASlider = createSlider(0, 10, 0.1,0.1);
	
  	ASlider.position(-20, 4*height/20);
  	ASlider.style('rotate',270);
  	ASlider.style('height', '20px');
  	ASlider.style('width', '100px');
	ASlider.input(changeEnv);
	
	DSlider = createSlider(0, 10, 0.1,0.1);
	DSlider.style('rotate',270);
  	DSlider.position(60, 4*height/20);
  	DSlider.style('height', '20px');
  	DSlider.style('width', '100px');
	DSlider.input(changeEnv);
	
	SSlider = createSlider(0, 1, 0.5,0.01);
	SSlider.style('rotate',270);
  	SSlider.position(140, 4*height/20);
  	SSlider.style('height', '20px');
  	SSlider.style('width', '100px');
	SSlider.input(changeEnv);
	
	RSlider = createSlider(0, 10, 0, 0.1);
	RSlider.style('rotate',270);
  	RSlider.position(220, 4*height/20);
  	RSlider.style('height', '20px');
  	RSlider.style('width', '100px');
	RSlider.input(changeEnv);
	
	// création d'un tableau de sliders contrôlant les harmoniques
	for (let i = 0; i < oscNum; i++) {
	    let s
	    if(i==0){
	        s = createSlider(0, 1,1.0,0.01);
	    }
	    else {
	        s = createSlider(0, 1,0.0,0.01);
	    }
	    
	    s.style('rotate',270);
	    s.position(30*i, 10*height/20);
	    s.style('height', '20px');
	    s.style('width', '100px');
	    s.input(changeHarm);
	    hSliders.push(s)
    }

	/*RSlider = createSlider(-50, 50, 0, 1);
  	RSlider.position(20, 7*height/10);
	RSlider.input(changeEnv);*/
	
	//Création d'un tableau d'oscillateurs. Le premier sera la fondamentale, les autres, les harmoniques
	
	for (let i = 0; i < oscNum; i++) {
	    let h = hSliders[i].value();
        let singleOsc = new p5.Oscillator();
        singleOsc.setType('sine');
        
        let singleEnv = new p5.Envelope();
        singleEnv.setADSR(ASlider.value(), DSlider.value(), SSlider.value(), RSlider.value());
        singleEnv.setRange(attackLevel, releaseLevel);
        singleEnv.mult(amp/oscNum)
        singleEnv.mult(h/oscNum)
        
        singleOsc.amp(singleEnv); 
        singleOsc.start();
        
        osc.push(singleOsc);
        env.push(singleEnv);
    }

	
	


	fft = new p5.FFT();

	//Analyse du premier fichier audio chargé par défaut
	fft.analyze();
	
	// Création du spectroscope
	spectroscope = new Spectroscope(fft, 2*width/3,30,width/3,height/2);
	// Création de l'oscilloscope
	oscilloscope = new Oscilloscope(fft, 1, 1*width/3,30,width/3,height/2);

	// Caractéristiques du texte
    textFont(font);
    textSize(fontsize);
    textAlign(LEFT, CENTER);
    
    
    
  
}

function draw() {
	//background(255);
	background(color(0,30,38));
	
	piano.display();
	oscilloscope.display(); 
	spectroscope.display()
	strokeWeight(1);
	stroke(0);
	fill(60,130,230);
	bTxt = text('Fréquence de base :', 0, bSlider.y);
	bSlider.position(200, 1*height/20);
	
	text('Oscilloscope',1*width/3,10)
	text('Spectroscope',2*width/3,10)

	//translate(ASlider.x, ASlider.y); 
	//rotate(HALF_PI);
	text('A : '+ ASlider.value(), ASlider.x+1.8*ASlider.height, ASlider.y+0.8*ASlider.width);
	text('D : '+ DSlider.value(), DSlider.x+1.8*DSlider.height, DSlider.y+0.8*DSlider.width);
	text('S : '+ SSlider.value(), SSlider.x+1.8*SSlider.height, SSlider.y+0.8*SSlider.width);
	text('R : '+ RSlider.value(), RSlider.x+1.8*RSlider.height, RSlider.y+0.8*RSlider.width);
	
	for (let i = 0; i < oscNum; i++) {
	    if (i == 0) {
	        text('F', hSliders[i].x+hSliders[i].width*0.85/2, hSliders[i].y+hSliders[i].height*4);
	        //text('F', hSliders[i].x+1*hSliders[i], hSliders[i].y+1*hSliders[i].width);
        }
        else {
            text('H'+i, hSliders[i].x+hSliders[i].width*0.85/2, hSliders[i].y+hSliders[i].height*4);
            //text('H'+i, hSliders[i].x+1*hSliders[i], hSliders[i].y+1*hSliders[i].width);
        }
    }
	

	if(piano.getNoteOn()){
    	fill(30,65,130);
    	text(midiToFreq(piano.getNote()) + ' Hz', 20, 3*height/8);
  	}
}



function changeBase(){
	piano.setBase(bSlider.value());
}

function changeAmpl(){
    
	//amp = ampSlider.value()/100.;
	for (let i = 0; i < oscNum; i++) {
	    h = hSliders[i].value();
	    env[i].mult(amp/oscNum);
	    env[i].mult(h/oscNum);
	}
}

function changeHarm(){
    for (let i = 0; i < oscNum; i++) {
        h = hSliders[i].value();
        env[i].mult(h/oscNum);
    }
}

function changeEnv(){
    for (let i = 0; i < oscNum; i++) {
        h = hSliders[i].value();
	    env[i].setADSR(ASlider.value(), DSlider.value(), SSlider.value(), RSlider.value());
	    env[i].mult(amp/oscNum);
	    env[i].mult(h/oscNum);
	}
	
}
  
function mousePressed() {
 	piano.updatePress(mouseX,mouseY);
	if(piano.getNoteOn()){
	    for (let i = 0; i < oscNum; i++) {
	        osc[i].freq(midiToFreq(piano.getNote())*(i+1))
		    env[i].play(osc[i]);
		    env[i].triggerAttack();
		}
	}
}

function mouseReleased() {
	piano.updateRelease();
	for (let i = 0; i < oscNum; i++) {
	    env[i].triggerRelease();
	}
	
}

function mouseDragged() {
	piano.updateDragg(mouseX,mouseY)
	if(piano.getNoteOn()){
	    for (let i = 0; i < oscNum; i++) {
		    osc[i].freq(midiToFreq(piano.getNote())*(i+1))
		}
	}
}
