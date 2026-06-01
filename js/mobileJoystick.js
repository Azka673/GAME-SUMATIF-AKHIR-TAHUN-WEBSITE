/** Mobile Joystick Controller — untuk perangkat touchscreen */
export class MobileJoystick {
  constructor(game) {
    this.game = game;
    this.container = document.getElementById('mobile-joystick');
    this.base = document.querySelector('.joystick-base');
    this.stick = document.querySelector('.joystick-stick');
    this.interactBtn = document.getElementById('mobile-interact');
    this.sprintBtn = document.getElementById('mobile-sprint');
    
    this.isActive = false;
    this.touchId = null;
    this.baseRadius = 60; // Container width/2
    this.stickRadius = 22.5; // Stick width/2
    this.maxDistance = this.baseRadius - this.stickRadius;
    
    this.axis = { x: 0, y: 0 };
    
    this._init();
  }

  _init() {
    // Deteksi touch support
    const isTouchDevice = () => {
      return window.ontouchstart !== undefined || navigator.maxTouchPoints > 0;
    };

    // Show mobile joystick hanya di mobile
    if (isTouchDevice()) {
      this.container?.classList.remove('hidden');
      this._bindJoystick();
      this._bindButtons();
    } else {
      // Desktop: hide tapi bisa diaktifkan via pause menu
      this.container?.classList.add('hidden');
    }

    // Allow toggle mobile controls from pause menu
    window.addEventListener('mobileControlsToggle', () => {
      if (this.container) {
        this.container.classList.toggle('show-mobile');
      }
    });
  }

  _bindJoystick() {
    if (!this.base) return;

    const getJoystickPos = (clientX, clientY) => {
      const rect = this.base.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      
      const deltaX = clientX - centerX;
      const deltaY = clientY - centerY;
      const distance = Math.hypot(deltaX, deltaY);
      
      let x = deltaX;
      let y = deltaY;
      
      if (distance > this.maxDistance) {
        const angle = Math.atan2(deltaY, deltaX);
        x = Math.cos(angle) * this.maxDistance;
        y = Math.sin(angle) * this.maxDistance;
      }
      
      return { x, y, distance };
    };

    const updateStick = (x, y) => {
      if (this.stick) {
        this.stick.style.transform = `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`;
      }
      // Normalize ke -1 ke 1
      this.axis.x = x / this.maxDistance;
      this.axis.y = y / this.maxDistance;
    };

    const resetStick = () => {
      updateStick(0, 0);
      this.isActive = false;
    };

    // Touch events
    this.base.addEventListener('touchstart', (e) => {
      this.isActive = true;
      const touch = e.touches[0];
      this.touchId = touch.identifier;
      const pos = getJoystickPos(touch.clientX, touch.clientY);
      updateStick(pos.x, pos.y);
    });

    document.addEventListener('touchmove', (e) => {
      if (!this.isActive || this.touchId === null) return;
      
      const touch = Array.from(e.touches).find(t => t.identifier === this.touchId);
      if (!touch) return;
      
      const pos = getJoystickPos(touch.clientX, touch.clientY);
      updateStick(pos.x, pos.y);
    });

    document.addEventListener('touchend', (e) => {
      const touch = Array.from(e.changedTouches).find(t => t.identifier === this.touchId);
      if (!touch) return;
      resetStick();
      this.touchId = null;
    });

    // Mouse events (untuk testing di desktop)
    let mouseDown = false;
    this.base.addEventListener('mousedown', () => {
      mouseDown = true;
    });

    document.addEventListener('mousemove', (e) => {
      if (!mouseDown || !this.base) return;
      const pos = getJoystickPos(e.clientX, e.clientY);
      updateStick(pos.x, pos.y);
    });

    document.addEventListener('mouseup', () => {
      if (!mouseDown) return;
      mouseDown = false;
      resetStick();
    });
  }

  _bindButtons() {
    if (this.interactBtn) {
      this.interactBtn.addEventListener('touchstart', (e) => {
        e.preventDefault();
        if (this.game) {
          this.game.input.interact = true;
          this.interactBtn.style.opacity = '0.7';
        }
      });

      this.interactBtn.addEventListener('touchend', (e) => {
        e.preventDefault();
        if (this.game) {
          this.game.input.interact = false;
          this.interactBtn.style.opacity = '1';
        }
      });

      // Mouse support
      this.interactBtn.addEventListener('mousedown', () => {
        if (this.game) {
          this.game.input.interact = true;
          this.interactBtn.style.opacity = '0.7';
        }
      });

      this.interactBtn.addEventListener('mouseup', () => {
        if (this.game) {
          this.game.input.interact = false;
          this.interactBtn.style.opacity = '1';
        }
      });
    }

    if (this.sprintBtn) {
      this.sprintBtn.addEventListener('touchstart', (e) => {
        e.preventDefault();
        if (this.game) {
          this.game.input.sprint = true;
          this.sprintBtn.style.opacity = '0.7';
        }
      });

      this.sprintBtn.addEventListener('touchend', (e) => {
        e.preventDefault();
        if (this.game) {
          this.game.input.sprint = false;
          this.sprintBtn.style.opacity = '1';
        }
      });

      // Mouse support
      this.sprintBtn.addEventListener('mousedown', () => {
        if (this.game) {
          this.game.input.sprint = true;
          this.sprintBtn.style.opacity = '0.7';
        }
      });

      this.sprintBtn.addEventListener('mouseup', () => {
        if (this.game) {
          this.game.input.sprint = false;
          this.sprintBtn.style.opacity = '1';
        }
      });
    }
  }

  update() {
    // Update game input dari joystick axis
    if (this.isActive) {
      if (Math.abs(this.axis.x) > 0.1) {
        if (this.axis.x > 0) this.game.input.right = true;
        else this.game.input.left = true;
      }
      if (Math.abs(this.axis.y) > 0.1) {
        if (this.axis.y > 0) this.game.input.down = true;
        else this.game.input.up = true;
      }
    }
  }

  toggle() {
    const event = new Event('mobileControlsToggle');
    window.dispatchEvent(event);
  }
}
