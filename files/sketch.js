

let ps;

function setup() {
  createCanvas(windowWidth,windowHeight);
  ps = new ParticleSystem(createVector(width / 2, 50));
}

function draw() {
  background(250, 234, 209);

  // Option #1 (move the Particle System origin)
  ps.origin.set(mouseX, mouseY, 0);

  ps.addParticle();
  ps.run();

  // Option #2 (move the Particle System origin)
  // ps.addParticle(mouseX, mouseY);



}


