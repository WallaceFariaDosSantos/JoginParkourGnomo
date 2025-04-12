class ParticleSystem {
    constructor() {
        this.windParticles = [];
        this.lastParticleTime = 0;
        this.particleInterval = 50;
    }
  
    addWindParticles() {
        const y = random(height);
        this.windParticles.push(new WindParticles(width, y));
    }
  
    update() {
        if (millis() - this.lastParticleTime > this.particleInterval) {
            this.addWindParticles();
            this.lastParticleTime = millis();
        }
        
        // Atualiza todas as partículas
        for (let i = this.windParticles.length - 1; i >= 0; i--) {
            this.windParticles[i].update();
            if (this.windParticles[i].finished()) {
                this.windParticles.splice(i, 1);
            }
        }
    }
  
    draw() {
        this.windParticles.forEach(p => p.show());
    }
}
  
class WindParticles {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.vx = random(-4.5, -1.5);
        this.vy = random(-0.5, 0.5);
        this.alpha = random(100, 200);
        this.size = random(2, 5);
    }
  
    update() {
        this.x += this.vx;
        this.y += this.vy;
        this.alpha -= 0.1;
    }
  
    finished() {
        return this.alpha < 0 || this.x < 0;
    }
  
    show() {
        push();
        noStroke();
        fill(random(100,200), 200, random(215,255), this.alpha);
        ellipse(this.x, this.y, this.size);
        pop();
    }
}