// classe spectroscope
class Spectroscope {
  constructor(fft, posx, posy, sizex, sizey) {
		this.x = posx;
		this.y = posy;
		this.dx = sizex;
		this.dy = sizey;
    	this.fft = fft;
		
		this.paused = false;
		this.nv = 20;
		this.nh = 10;
		this.nx = this.dx/this.nv
		this.ny = this.dy/this.nh
  }

  
  display() {
	

    if (!(this.paused)) {
	    fill(111, 20, 25);
        rect(this.x,this.y,this.dx,this.dy);

        let spectrum = fft.analyze();  // analyze the waveform
        beginShape();
        strokeWeight(2);
        noFill();
        stroke(245,55,109);
        for (i = 0; i < spectrum.length; i++) {
            vertex(this.x+map(i, 0, spectrum.length, 0,this.dx), this.y+map(spectrum[i], 0, 255, this.dy, 0));
        }
	    endShape();
	}
	//Affichage de la grille
	stroke(255,109,245,40);
	for(var i=0;i<this.nv;i++){
		line(this.x+i*this.nx,this.y,this.x+i*this.nx,this.y+this.dy);
	}
	for(var i=0;i<this.nh;i++){
		line(this.x,this.y+i*this.ny,this.x+this.dx,this.y+i*this.ny);
    }
  }
}
