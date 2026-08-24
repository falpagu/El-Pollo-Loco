class MovableObject {
  x = 120;
  y = 250;
  img;
  height = 150;
  width = 100;


loadImage(path) {
  this.img = new Image();  // hier Image ist gleich wie hier: this.img = document.getElementById('image) <img id="image">
  this.img.src = path;
}  

moveRight() {
  console.log('Moving right');
}  

 moveLeft() {
        
     }


}