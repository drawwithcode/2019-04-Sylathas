var analyzer;
let cols;
let rows;
let scale = 15;
let w = 1280;
let h = 540;
let terrain = [];

function preload(){
  mySong = loadSound('./assets/Song.mp3');
  sfondo = loadImage('./assets/background.jpg')
  myFont = loadFont('./assets/adieu.otf');
}

function setup() {
  //Create the window shaped Canvas
  createCanvas(windowWidth, windowHeight, WEBGL);

  //Calculate number of columns and rows
  cols = w / scale;
  rows = h / scale;

  //Configurate the song with the analyzer
  analyzer = new p5.FFT();
  analyzer.setInput(mySong);

  //Create the lines in the array
  for (let x = 0; x < cols; x++) {
    terrain[x] = [];
    for (let y = 0; y < rows; y++) {
        terrain[x][y] = 0;
    }
  }
}

function draw() {
  //Analyze the song and get the various frequencies of the waveform
  analyzer.analyze();
  var bass = analyzer.getEnergy(100,150);
  var treble = analyzer.getEnergy(150,250);
  var mid = analyzer.getEnergy("mid");

  var mapbass = map(bass, 0, 255, 50, 200);
  var maptreble = map(treble, 0, 255, 200, 350);
  var mapmid = map(mid, 0, 255, -100, 200);

  //Create the background
  background("black");
  imageMode(CENTER);
  tint(255, 0, 0, bass);
  let scala = Math.max(width/sfondo.width,height/sfondo.height);
  image(sfondo,0,0,sfondo.width*scala*mapbass/50,sfondo.height*scala*mapbass/50);

  if(!mySong.isPlaying()){
    cursor('./assets/play.png');
  } else{
    cursor('./assets/pause.png');
  }

  //Create the movement of the lines
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      terrain[x][y] = map(noise(mapbass*10*x, maptreble*10*y), 0, 1, -20, 50);
    }
  }

  //Create the three Ellipses
  push();
  translate(-width/2,-height/1.5);

  stroke(bass, treble, mid);
  noFill();
  ellipse(width/6,height/2,mapbass);

  stroke(mid, bass, treble);
  noFill();
  ellipse(width/2,height/2,mapmid);

  stroke(treble, mid, bass);
  noFill();
  ellipse(5*width/6,height/2,maptreble);
  pop();

  //Create the Terrain
  stroke(bass, treble, mid);
  noFill();
  rotateX(PI/2.5);
  translate(-w/2, -h/6); // draw relative to center of window

  for (let y = 0; y < rows-1; y++) {
    beginShape(TRIANGLE_STRIP);
    for (let x = 0; x < cols; x++) {
      vertex(x*scale, y*scale, terrain[x][y]);
    }
    endShape();
  }
}

//Pause and Play on click
function mousePressed() {
  if(!mySong.isPlaying()){
    mySong.play();
  } else{
    mySong.pause();
  }
}

//Responsive Window
function windowResized() {
	resizeCanvas(windowWidth, windowHeight);
}
