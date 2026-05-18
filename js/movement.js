/** Advanced movement — sprint, slide, wall run, grapple, vehicles */
export class MovementSystem {
  constructor() {
    this.grappleActive = false;
    this.grappleTimer = 0;
    this.ziplineActive = false;
    this.vehicles = [];
  }

  getModifiers(player, input, skills) {
    const mods = {
      speedMult: 1 + (skills.courierSpeed || 0) * 0.1,
      canSprint: true,
      canJump: true,
      jumpForce: 320,
      canSlide: skills.slide || false,
      canWallRun: skills.wallRun || false,
      grappling: false,
    };

    if (input.slide && mods.canSlide && player.onGround) {
      player.sliding = true;
      setTimeout(() => { player.sliding = false; }, 400);
    }

    if (input.grapple && skills.grapple) {
      this.grappleActive = true;
      this.grappleTimer = 0.4;
    }

    if (this.grappleActive) {
      this.grappleTimer -= 0.016;
      mods.grappling = this.grappleTimer > 0;
      if (this.grappleTimer <= 0) this.grappleActive = false;
    }

    if (player.onVehicle === 'skateboard') mods.speedMult *= 1.3;
    if (player.onVehicle === 'bike') mods.speedMult *= 1.5;
    if (player.onVehicle === 'hoverboard') mods.speedMult *= 1.8;

    return mods;
  }

  mountVehicle(player, type) {
    player.onVehicle = type;
  }

  dismount(player) {
    player.onVehicle = null;
  }

  handleZipline(player, points) {
    if (!points.length) return;
    this.ziplineActive = true;
    player.vx = 400;
    player.vy = 0;
  }
}
