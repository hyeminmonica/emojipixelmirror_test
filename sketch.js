//layer를 하나 덧 씌워 픽셀 미러가 안 보이게끔 하고 마우스를 클릭 & 드래그하여 지워서 밑의 레이어가 드러나게끔...!
//마우스 x좌표값에 따라 이모지가 더 잘 보이기도 하고 작게 축소되기도 하고...! 

//const for 불변variables

const videoXResolution = 640;
const videoYResolution = 480;

let imgs = []; 
let video;
let pixelSize = 10;
const minSize = 5;
const maxSize = 40;
let windowVideoRatio;
let isMovingEnabled = true;

let layer; 
let r = 100; 
let mouseIsDragged = false; 


function preload() {
  for (let i=0; i<8; i++) {
    let t = loadImage("assets/"+i+".png");
    imgs.push(t);
  }
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  video = createCapture(VIDEO);
  video.size(videoXResolution, videoYResolution);
  video.hide();
  windowVideoRatio = windowWidth/ video.width; 
  
   // let w = 900, h = 700;
  
  alphaC = color(0,0);
  layer = createGraphics(windowWidth,windowHeight);
  layer.fill(255);
  layer.rect(0,0,width,height);
}


function draw() {
  background(245);
  video.loadPixels();
  
  if (isMovingEnabled) {
    pixelSize = int(map(mouseX, 0, windowWidth, minSize, maxSize));

    for (let x = 0; x < video.width; x += pixelSize) {
      for (let y = 0; y < video.height; y += pixelSize) {
        
        let index = y * video.width + x;
        let r = video.pixels[index * 4];
        let g = video.pixels[index * 4+ 1];
        let b = video.pixels[index * 4 + 2];
        
                //frame안에서 늘어났다가 줄어들었다가
        let scaledX = floor(x * windowVideoRatio);
        let scaledY = floor(y * windowVideoRatio);
        let scaledPixelSize = floor(pixelSize * windowVideoRatio);
        
        let bright = (r + g + b)/3.0;
        let gri = parseInt(bright/35.0);
        noStroke();
        fill(0,255,255,25);
        rect(scaledX, scaledY, scaledPixelSize, scaledPixelSize);
        image(imgs[gri], scaledX, scaledY,scaledPixelSize, scaledPixelSize);
      }
    }
  } else {
    image(video, 0,0, videoXResolution * windowVideoRatio, 
          videoYResolution * windowVideoRatio);
  }
  
  image(layer,0,0);
  
  if (mouseIsPressed){
    noFill();
    stroke(0,0,0,25);
    ellipse(mouseX,mouseY,r*2,r*2);
    line(mouseX-10,mouseY,mouseX+10,mouseY);
    line(mouseX,mouseY-10,mouseX,mouseY+10);
  }
}


function mouseDragged(){
   for ( x = mouseX - r; x < mouseX+r; x++) {
    for ( y = mouseY - r; y < mouseY+r; y++) {
      if ((dist(x,y, mouseX, mouseY) < r) && x > 0 && x <= width) {
        layer.set(x,y,alphaC);
     }
    }
   }
  layer.updatePixels();
}