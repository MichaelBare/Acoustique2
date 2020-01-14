class Ruban {
	constructor(x,y,dx,dy) {
		this.x = x;
		this.y = y;
		this.dx = dx;
		this.dy = dy;
		this.noteOn = false;
		this.curx=0;
		this.cury=0;
		this.max = 20000.0;
		this.min = 20.0;
		this.a  = Math.log(this.max / this.min) / this.dx
		
	}

	display() {
		strokeWeight(2);
		fill(127);
		rect(this.x,this.y,this.dx,this.dy);
		if(this.noteOn){
			noFill();
			stroke(0,160,0);
			line(this.x+this.curx,this.y,this.x+this.curx,this.y);
		}
	}

	updatePress(x,y){
		if((x>this.x)&&(x<this.x+this.dx)&&(y>this.y)&&(y<this.y+this.dy)){
			this.noteOn = true;
			this.curx = x;
			this.cury = y;
		}
	}

	updateRelease(x,y){
		this.noteOn = false;
	}

	updateDragg(x,y){
		if((x>this.x)&&(x<this.x+this.dx)&&(y>this.y)&&(y<this.y+this.dy)){
			this.noteOn = true;
			this.curx = x;
			this.cury = y;
		}
	}

	getNoteOn(){
		return this.noteOn;
	}

	getFrequency(){
		return this.min*Math.exp(this.a*this.curx);
	}

}
