// 1. Primeiro, modifique a classe Lever para ter um estado mais claro:
class Lever {
  constructor(x, y, name) {
      this.sprite = createSprite(x, y, 20, 35);
      this.sprite.addImage(leverImgOff);
      this.sprite.scale = 0.25;
      this.name = name;
      this.isActive = false;
      this.canInteract = false;
  }

  update() {
    let distance = dist(player.position.x, player.position.y, this.sprite.position.x, this.sprite.position.y);
    
    this.canInteract = (distance <= 75);
    
    if (this.canInteract) {
      this.sprite.scale = 0.3;
    } else {
      this.sprite.scale = 0.25;
    }
  }

  toggle() {
    this.isActive = !this.isActive;
    if (this.isActive) {
        this.sprite.addImage(leverImgOn);
    } else {
        this.sprite.addImage(leverImgOff);
    }
  }

  activate() {
      this.isActive = true;
      this.sprite.addImage(leverImgOn);
  }

  deactivate() {
      this.isActive = false;
      this.sprite.addImage(leverImgOff);
  }
}