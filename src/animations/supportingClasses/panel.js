export default function Panel(PIXI, wH, portal_code) {
	return {
		cont: new PIXI.Container(),
		build: function (num, width, height, userData, point) {

			this.Doorway = portal_code;

			this.panelWidth = width;
			this.panelHeight = height;

            let dot = new PIXI.Graphics();
            dot.beginFill(0x000000).drawCircle(0,0,100).endFill();
            dot.x = this.panelWidth/2;
            dot.y = this.panelHeight/2;
            dot.pivot.x = dot.pivot.y = 0.5;
            this.cont.addChild(dot);

            let text = new PIXI.Text(num,{fontFamily : 'Arial', fontSize: 48, fill : 0xffffff, align : 'center'});
            text.x = this.panelWidth/2;
            text.y = this.panelHeight/2;
            text.anchor.x = text.anchor.y = 0.5;
            this.cont.addChild(text)

            let name = new PIXI.Text(`user name: ${userData.username}`,{fontFamily : 'Arial', fontSize: 22, fill : 0xFFFFFF, align : 'center'});
            name.x = 20;
            name.y = 60;
            this.cont.addChild(name)

             let frame = new PIXI.Graphics();
                frame.lineStyle(5, 0xFF00FF)
                .moveTo(0,0)
                .lineTo(this.panelWidth, 0)
                .lineTo(this.panelWidth,this.panelHeight)
                .lineTo(0,this.panelHeight).lineTo(0,0)
                this.cont.addChild(frame);
         
            let topDoor = this.Doorway(PIXI, wH.characterHeight, 10, 'top');
            topDoor.x = (width - wH.characterHeight)/2;
            if (point.y !== 0) {
                this.cont.addChild(topDoor);
            }
            
            let bottomDoor = this.Doorway(PIXI, wH.characterHeight, 10, 'bottom');
            bottomDoor.x = (width - wH.characterHeight)/2;
            bottomDoor.y = this.panelHeight - 10;
            if(point.y !== this.bottomY){
                this.cont.addChild(bottomDoor);
            }

            let leftDoor = this.Doorway(PIXI, 10, wH.characterHeight, 'left');
            leftDoor.x = 0;
            leftDoor.y = (height - wH.characterHeight)/2;
            if (point.x !== 0) {
                this.cont.addChild(leftDoor);
            }

            let rightDoor = this.Doorway(PIXI, 10, wH.characterHeight, 'right');
            rightDoor.x = width - 10;
            rightDoor.y = (height - wH.characterHeight)/2;
            if(point.x !== this.leftX){
                this.cont.addChild(rightDoor);
            }
            
            
            this.doors = [topDoor, bottomDoor, leftDoor, rightDoor];

       
		},
		returnPanel: function () {
			return this.cont;
		}
	}
}