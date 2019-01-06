import ArtBoard from './art_board_sub';
export default function Panel(PIXI, wH, portal_code) {
	return {
		cont: new PIXI.Container(),
        artBoardLoaded: false,
		build: function (num, width, height, userData, point, primary, stage, assignPrimaryArtBoard) {
			this.Doorway = portal_code;
            this.primary = primary;
            this.stage = stage;
			this.panelWidth = width;
			this.panelHeight = height;
            this.assignPrimaryArtBoard = assignPrimaryArtBoard;
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
            this.cont.addChild(name);

            this.username = userData.username;

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
         

            let leftDoor = this.Doorway(PIXI, 10, wH.characterHeight, 'left');
            leftDoor.x = 0;
            leftDoor.y = (height - wH.characterHeight)/2;
            if (point.x !== 0) {
                this.cont.addChild(leftDoor);
            }

            let rightDoor = this.Doorway(PIXI, 10, wH.characterHeight, 'right');
            rightDoor.x = width - 10;
            rightDoor.y = (height - wH.characterHeight)/2;
            if(point.x !== wH.leftX){
                this.cont.addChild(rightDoor);
            } else {

            }

            let bottomDoor = this.Doorway(PIXI, wH.characterHeight, 10, 'bottom');
            bottomDoor.x = (width - wH.characterHeight)/2;
            bottomDoor.y = this.panelHeight - 10;
            if(point.y !== wH.bottomY){
                this.cont.addChild(bottomDoor);
            }
            
            this.doors = [topDoor, bottomDoor, leftDoor, rightDoor];

            let line1 = new PIXI.Graphics();
            line1.lineStyle(25, 0xFF00FF, 0.25, 0).moveTo(0,0).lineTo(this.panelWidth, this.panelHeight);
            this.cont.addChild(line1);

            let line2 = new PIXI.Graphics();
            line2.lineStyle(25, 0xFF00FF, 0.25, 0).moveTo(0,this.panelHeight).lineTo(this.panelWidth,0);
            this.cont.addChild(line2);


            let gear;
            let corners = [[0,0],[this.panelWidth, 0], [this.panelWidth, this.panelHeight], [0, this.panelHeight]];
            this.gears = [];
            for(let i = 0; i < 4;i++){
                gear = new PIXI.Sprite.fromImage('/bmps/gear.png');
                gear.anchor.x = gear.anchor.y = 0.5;
                gear.x = corners[i][0];
                gear.y = corners[i][1];
                gear.alpha = 0.25;
                gear.rotate = (Math.random()*0.01)+0.01;
                //this.cont.addChild(gear);
                this.gears.push(gear);
            }

            //if primary user load artboard to start
            console.log("panel primary? ", primary)
            if(primary){
                this.loadArtBoard(primary);
            }
            // if(artBoard){
            // 	// //console.log("art board = ", artBoard.stage)
            //  //    artBoard.pivot.x  = artBoard.width / 2;
            //  //    artBoard.pivot.y = artBoard.height / 2;
            //  //    artBoard.x = this.panelWidth / 2;
            //  //    artBoard.y = this.panelHeight / 2;
            // 	// this.cont.addChild(artBoard);
            //  //    this.artBoardLoaded = true;
            // }

           
            
		},
        loadArtBoard: function (primary) {
            console.log("load artboard for ", this.username);
            this.art_board = ArtBoard();
            this.art_board.init(primary);
            let artBoard = this.art_board.returnArtBoard();
            artBoard.pivot.x  = artBoard.width / 2;
            artBoard.pivot.y = artBoard.height / 2;
            artBoard.x = this.panelWidth / 2;
            artBoard.y = this.panelHeight / 2;

            this.art_board.loadData({username: this.username});
            this.cont.addChild(artBoard);
            this.artBoardLoaded = true;
            if(this.primary){
                this.art_board.assignStage(this.stage);
                console.log("TESTING = ", this.assignPrimaryArtBoard)
                this.assignPrimaryArtBoard(this.art_board);
            }
            
        },
		returnPanel: function () {
			return this.cont;
		}
	}
}