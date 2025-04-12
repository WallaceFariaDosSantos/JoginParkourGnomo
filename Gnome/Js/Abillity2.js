class PlayerGrapplingHook {
    constructor(playerSprite) {
      this.player = playerSprite;
      this.hook = null;
      this.ropeLength = 0;
      this.maxRopeLength = 300;
      this.hookSpeed = 15;
      this.isAttached = false;
      this.swingPower = 0.2;
      this.hookSize = 10;
      this.cooldown = 1000;
      this.lastShotTime = 0;
    }
  
    shoot(targetX, targetY) {
      const now = millis();
      if (now - this.lastShotTime < this.cooldown) return;
      
      this.lastShotTime = now;
      
      if (this.isAttached) {
        this.release();
        return;
      }
  
      let direction = createVector(targetX - this.player.position.x, 
                                 targetY - this.player.position.y).normalize();
      
      this.hook = {
        x: this.player.position.x,
        y: this.player.position.y,
        vx: direction.x * this.hookSpeed,
        vy: direction.y * this.hookSpeed,
        attached: false
      };
      isHookActive = true;
    }
  
    update() {
      if (!this.hook) return;
  
      if (!this.hook.attached) {
        this.hook.x += this.hook.vx;
        this.hook.y += this.hook.vy;
  
        // Verifica colisão com blocos
        for (let block of blocks) {
          if (!block.removed && this.checkBlockCollision(block)) {
            this.hook.attached = true;
            this.isAttached = true;
            this.ropeLength = dist(this.player.position.x, this.player.position.y, 
                                 this.hook.x, this.hook.y);
            break;
          }
        }
  
        // Verifica distância máxima
        if (dist(this.player.position.x, this.player.position.y, 
                this.hook.x, this.hook.y) > this.maxRopeLength) {
          this.release();
        }
      } else {
        this.applySwingPhysics();
      }
    }
  
    checkBlockCollision(block) {
      return (this.hook.x > block.position.x - block.width/2 &&
              this.hook.x < block.position.x + block.width/2 &&
              this.hook.y > block.position.y - block.height/2 &&
              this.hook.y < block.position.y + block.height/2);
    }
  
    applySwingPhysics() {
      let dx = this.hook.x - this.player.position.x;
      let dy = this.hook.y - this.player.position.y;
      let distance = dist(this.player.position.x, this.player.position.y, 
                         this.hook.x, this.hook.y);
  
      // Força de tensão
      if (distance > this.ropeLength) {
        let pullForce = (distance - this.ropeLength) * 0.1;
        let direction = createVector(dx, dy).normalize();
        this.player.velocity.x += direction.x * pullForce;
        this.player.velocity.y += direction.y * pullForce;
      }
  
      // Física do pêndulo
      let angle = atan2(dy, dx);
      let tangentAcceleration = gravity * sin(angle);
      this.player.velocity.x += cos(angle + PI/2) * tangentAcceleration * this.swingPower;
      this.player.velocity.y += sin(angle + PI/2) * tangentAcceleration * this.swingPower;
    }
  
    release() {
      this.hook = null;
      this.isAttached = false;
      isHookActive = false;
    }
  
    draw() {
      if (!this.hook) return;
  
      // Desenha a corda
      stroke(139, 69, 19);
      strokeWeight(2);
      line(this.player.position.x, this.player.position.y, this.hook.x, this.hook.y);
  
      // Desenha o gancho
      fill(70);
      ellipse(this.hook.x, this.hook.y, this.hookSize);
      fill(120);
      ellipse(this.hook.x, this.hook.y, this.hookSize * 0.6);
    }
  }