export default function keyHandler (speed) {
    return {
    	moveAllow: false,
    	vx: 2,
    	vy: 0,
    	activate: function () {
            this.keyDown = this.keyDown.bind(this);
            this.keyUp = this.keyUp.bind(this);
    		window.addEventListener('keydown', this.keyDown);
            window.addEventListener('keyup', this.keyUp);
    	},
    	deactivate: function () {
    		window.removeEventListener('keydown', this.keyDown);
            window.removeEventListener('keyup', this.keyUp);
    	},
    	keyDown: function (e) {
            e.preventDefault();
            switch (e.keyCode) {
                case 37:
                    this.moveAllow = true;
                    this.vx = -speed;
                    this.vy = 0;
                    break;
                case 38:
                    //alert('up');
                    this.moveAllow = true;
                    this.vy = -speed;
                    this.vx = 0;
                    break;
                case 39:
                    //alert('right');
                    this.moveAllow = true;
                    this.vx = speed;
                    this.vy = 0;
                    break;
                case 40:
                    //alert('down');
                    this.moveAllow = true;
                    this.vy = speed;
                    this.vx = 0;
                    break;
                default:
                    this.vy = 0;
            }
        },
        keyUp: function (e) {
            e.preventDefault();
            this.moveAllow = false;
        }
    }
}