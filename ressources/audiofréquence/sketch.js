let font,fontsize = 60;

var amp = 0.5;

var osc;

var ruban;

function preload() {
  // Ensure the .ttf or .otf font stored in the assets directory
  // is loaded before setup() and draw() are called
  font = loadFont('SourceSansPro-Regular.otf');
}


function setup() {
  createCanvas(windowWidth, windowHeight);
	
	

	osc = new p5.SinOsc();
	osc.amp(amp);
  

	fft = new p5.FFT();

	//Analyse du premier fichier audio chargé par défaut
	fft.setInput(osc);

	ruban = new Ruban(20,0,width-20,height/2);

	// Set text characteristics
    textFont(font);
    textSize(fontsize);
    textAlign(CENTER, CENTER);
  
}

function draw() {
	background(255);
	ruban.display();
	strokeWeight(1);
	stroke(0);
  if(ruban.getNoteOn()){
    fill(30,65,130);
    text(ruban.getFrequency() + ' Hz', width/2, 3*height/4);
  }
  stroke(0);
	
	
}

  
function mousePressed() {
 	ruban.updatePress(mouseX,mouseY);
	if(ruban.getNoteOn()){
		//print('Fréquence : '+ruban.getFrequency()+' Hz');
		osc.freq(ruban.getFrequency());
		osc.start();
    
	}
}

function mouseReleased() {
	ruban.updateRelease();
	osc.stop();
}

function mouseDragged() {
	ruban.updateDragg(mouseX,mouseY)
	if(ruban.getNoteOn()){
		//print('Fréquence : '+ruban.getFrequency()+' Hz');
		osc.freq(ruban.getFrequency());
	}
}
