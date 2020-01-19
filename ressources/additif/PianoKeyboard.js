class PianoKeyboard {
	constructor(x,y,dx,dy,base) {
		this.x = x;
		this.y = y;
		this.dx = dx;
		this.dy = dy;
		this.noteOn = false;
		this.octave = 2;
		this.noteColorModel = ["w","b","w","b","w","w","b","w","b","w","b","w"];
		this.noteColor = ["w","b","w","b","w","w","b","w","b","w","b","w","w","b","w","b","w","w","b","w","b","w","b","w"];
		this.keywidth = this.dx/(12*this.octave);
		this.iPressed = -1;
		this.base = 48;
	}

	display() {
		strokeWeight(2);
		
		var posx  = this.x
		for(var i=0;i<this.octave*12;i++){
			if(this.noteColor[i]=="w"){
				stroke(0);
				fill(255);
				rect(posx,this.y,this.keywidth,this.dy);
			} else if(this.noteColor[i]=="b")  {
				stroke(0);
				fill(0);
				rect(posx,this.y,this.keywidth,this.dy);
			} else {
				stroke(0);
				fill(30,50,160);
				rect(posx,this.y,this.keywidth,this.dy);
			}
			posx += this.keywidth;
			
		}
	}

	updatePress(x,y){
		if((x>this.x)&&(x<this.x+this.dx)&&(y>this.y)&&(y<this.y+this.dy)){
			this.noteOn = true;
			this.iPressed = floor((x-this.x)/this.keywidth);
			this.noteColor[this.iPressed] = "c"
		} else{
			this.noteOn = false;
		}
		
	}

	updateRelease(x,y){
		this.noteOn = false;
		this.noteColor[this.iPressed] = this.noteColorModel[this.iPressed%12];
		
	}

	updateDragg(x,y){
		if((x>this.x)&&(x<this.x+this.dx)&&(y>this.y)&&(y<this.y+this.dy)){
			this.noteOn = true;
			var currenti = this.iPressed;
			this.iPressed = floor((x-this.x)/this.keywidth);
			if(this.iPressed != currenti){
				this.noteColor[currenti] = this.noteColorModel[currenti%12];
			}
			this.noteColor[this.iPressed] = "c"
		} else{
			this.noteOn = false;
		}
	}

	getNoteOn(){
		return this.noteOn;
	}

	setBase(n){
		this.base = n*12
	}

	getNote(){
		return this.base + this.iPressed
	}

}
