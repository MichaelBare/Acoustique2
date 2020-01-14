// classe oscilloscope
class Oscilloscope {
  constructor(fft, timestamp, posx, posy, sizex, sizey) {
		this.x = posx;
		this.y = posy;
		this.dx = sizex;
		this.dy = sizey;
    	this.fft = fft;
		this.n = timestamp;
		this.paused = false;
		this.trigger = 0;
		this.firstpos = 0;
		this.nv = 20;
		this.nh = 10;
		this.nx = this.dx/this.nv
		this.ny = this.dy/this.nh
  }

  
  display() {
	

    if (!(this.paused)) {
			fill(25,120,111);
		  rect(this.x,this.y,this.dx,this.dy);

		  var waveform = fft.waveform();  // analyze the waveform
		  beginShape();
		  strokeWeight(2);
		  noFill();
		  stroke(109,255,245);
		  this.trigger = 0;
		  for (var i = 0; i < waveform.length; i++){

		    // find the first point in the waveform buffer
		    // where the waveform crosses zero, going in a positive direction
		    if ((waveform[i] > 0) && (waveform[i-1] <= 0) && (this.trigger == 0))
		    {
		      this.trigger = 1;
		      this.firstPos = i;
		    }
		    //once that first positive-going zero crossing is found, 
		    //start drawing the waveform
		    if (this.trigger == 1)
		    {
		      // subtract the offset of the first zero crossing from "i",
		      // and use only use an early section of the buffer 
		      // (in this case, the first third of it, because it will 
		      // end in different places based on where the zero crossing
		      // happened)
		      var x = map((i - this.firstPos), 0, waveform.length/this.n, 0, this.dx);
		      var y = map(waveform[i], -1, 1, this.dy, 0);
		    }
		    vertex(this.x+x, this.y+y);
		  }
		  endShape();
  		}
		//Affichage de la grille
		stroke(109,255,245,40);
		for(var i=0;i<this.nv;i++){
			line(this.x+i*this.nx,this.y,this.x+i*this.nx,this.y+this.dy);
		}
		for(var i=0;i<this.nh;i++){
			line(this.x,this.y+i*this.ny,this.x+this.dx,this.y+i*this.ny);
	}
	}
}
