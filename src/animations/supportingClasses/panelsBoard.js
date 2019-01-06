export default function PanelsBoard(PIXI, obj) {
	return {
		rows: obj.rows,
		cols: obj.cols,
		panelWidth: obj.panelWidth,
		panelHeight: obj.panelHeight,
		canvasWidth:obj.canvasWidth,
		canvasHeight: obj.canvasHeight,
		backgroundCont: obj.backgroundCont,
		getUserName: obj.getUserName,
		userObject: obj.userObject,
		wH: obj.wH,
		portal_code: obj.portal_code,
		getUserName: obj.getUserName,
		activePanel: obj.activePanel,
		panelForArtBoard: obj.panelForArtBoard,
		stage: obj.stage,
		pelletCont: obj.pelletCont,
		hero: obj.hero,
		utils: obj.utils,
        assignPrimaryArtBoard: obj.assignPrimaryArtBoard,
        assignPrimaryPanel: obj.assignPrimaryPanel,
        panels: obj.panels,
		init: function () {
			this.total = this.cols * this.rows;
			let panelCounter = 0;
            //this.panels = [];
            this.backgroundCont.removeChildren();
            for(let i = 0; i < this.rows; i++){
                for (let j = 0; j < this.cols; j ++) {
                
                    let w = this.panelWidth;
                    let h = this.panelHeight;
                    //console.log("user object = ", this.userObject)
                    
                    let userObject = (this.userObject.users[panelCounter])?this.userObject.users[panelCounter]:{username: this.getUserName(), fake: true};

                    let xVal = w * j;
                    let yVal = h * i;
                    this.wH.leftX = (this.cols - 1) * this.panelWidth;
                    this.wH.bottomY = (this.rows - 1) * this.panelHeight;

                    let panelClass = obj.Panel(PIXI, this.wH, this.portal_code);

                    let primary = false;
                    if (panelCounter === this.panelForArtBoard) {
                        this.activePanel = panelClass;
                        //alert("assign primary panel")
                        this.assignPrimaryPanel(this.activePanel);
                        
                        // artBoard = this.art_board.returnArtBoard();
                        // this.art_board.assignStage(this.stage);
                        primary = true;
                    }

                    panelClass.build(panelCounter, this.panelWidth, this.panelHeight, userObject,  {x: xVal, y: yVal}, primary, this.stage);
                    let panel = panelClass.returnPanel();
                    panel.panelClass = panelClass;
                    panel.x = xVal;
                    panel.y = yVal;
                    this.panels.push(panel)
                    panel.index = panelCounter;
                    this.backgroundCont.addChild(panel);

                   
                    panelCounter ++;
                }
            }

            this.backgroundCont.x = -this.activePanel.cont.x + (this.canvasWidth /2) - (this.panelWidth /2);
            this.backgroundCont.y = -this.activePanel.cont.y+ (this.canvasHeight /2) - (this.panelHeight /2);
         
           //this.backgroundCont.scale.x = this.backgroundCont.scale.y = 0.25;
           this.mask = new PIXI.Graphics();
           this.mask.beginFill(0x000000).drawRect(0,0,this.backgroundCont.width, this.backgroundCont.height).endFill();
           this.mask.x = this.backgroundCont.x;
           this.mask.y = this.backgroundCont.y;
           this.stage.addChild(this.mask);
           this.pelletCont.mask = this.mask;   
		},
	  	whichPanel: function (door, panel) {

            let rightX = panel.cont.x + this.panelWidth;
            let bottomY = panel.cont.y + this.panelHeight;
            let topY = panel.cont.y - this.panelHeight;
            let leftX = panel.cont.x - this.panelWidth
             for (let i = 0; i < this.total; i++) {
                //console.log(`${door.loc} ${panel.cont.x} ${this.panelWidth} versus ${this.panels[i].x}`);
                if (door.loc === 'top' && this.panels[i].y === topY && this.panels[i].x === panel.cont.x) {
                    this.switchPanel(i);
                    break;
                } else if (door.loc === 'bottom' && this.panels[i].y === bottomY && this.panels[i].x === panel.cont.x) {
                    this.switchPanel(i);
                    break;

                } else if (door.loc === 'left' && this.panels[i].x === leftX && this.panels[i].y === panel.cont.y){
                    this.switchPanel(i);
                    break;

                } else if (door.loc === 'right' && this.panels[i].x === rightX && this.panels[i].y === panel.cont.y) {
                   this.switchPanel(i);
                    break;
                }
             }
        },
        switchPanel: function (index) {
            this.activePanel = this.panels[index].panelClass;
            this.panelForArtBoard = index;
            this.backgroundCont.x = -this.activePanel.cont.x + (this.canvasWidth /2) - (this.panelWidth /2);
            this.backgroundCont.y = -this.activePanel.cont.y + (this.canvasHeight /2) - (this.panelHeight /2);
            // console.log("SWITCH PANEL");
            // console.log(this.activePanel);
            // console.log(this.backgroundCont.y);

            // console.log('LOAD NEW PANEL ART BOARD!!!!!!');
           
            this.activePanel.loadArtBoard();
            //this.assignPrimaryArtBoard(this.activePanel.art_board);
        },
		animate: function () {
		   // this.mask.x = this.backgroundCont.x;
     //       this.mask.y = this.backgroundCont.y;

            let rect = new PIXI.Rectangle();
            for(let i = 0; i < this.activePanel.doors.length; i++){
                let globalPoint = this.activePanel.doors[i].toGlobal(this.stage, undefined, true);
                rect = new PIXI.Rectangle(
                    Math.floor(globalPoint.x), 
                    Math.floor(globalPoint.y), 
                    this.activePanel.doors[i].width, 
                    this.activePanel.doors[i].height);
                this.hero.cont.radius = 50;
                if(this.utils.circleRectangleCollision(this.hero.cont, rect)){
                    this.whichPanel(this.activePanel.doors[i], this.activePanel);
                }

                this.activePanel.gears[i].rotation += (this.activePanel.gears[i].rotate / 2);

            }
             
          this.yLimit =  this.activePanel.cont.y + (this.panelHeight) -  (this.canvasHeight / 2);
          this.yLimit2 = this.activePanel.cont.y  -  (this.canvasHeight / 2);

          this.xLimit = this.activePanel.cont.x + this.panelWidth - (this.canvasWidth / 2);
          this.xLimit2 = this.activePanel.cont.x - (this.canvasWidth/2) ;

       
		}
	}
}