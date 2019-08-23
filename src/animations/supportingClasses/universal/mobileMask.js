import Utils from '../../utils/utils';
import Assets from '../../utils/assetCreation';
export default function () {
    return {
        border: 25,
        frameWidth: 2.5,
        frame: Assets.Graphics(),
        kingContBackground: Assets.Graphics(),
        utils: Utils,
        setMask: function () {
            console.log(this.utils.root.kingCont)
            let containerToMask = this.utils.root.kingCont;
            let containerToAddFrameTo = this.utils.root.stage;
            let backgroundColor = this.utils.root.backgroundColor;
            containerToMask.mask = null;
            let mask = Assets.Graphics();
            let halfBorder = this.border / 2;
            let maskWidth = this.utils.canvasWidth - this.border;
            let maskHeight = this.utils.canvasHeight - this.border;
            mask.beginFill(0x000000).drawRect(halfBorder,halfBorder,maskWidth, maskHeight).endFill();
            containerToMask.mask = mask;

            this.kingContBackground.clear();
            this.kingContBackground.beginFill(backgroundColor).drawRect(0,0,this.utils.canvasWidth, this.utils.canvasHeight).endFill();
            containerToMask.addChildAt(this.kingContBackground, 0)

            this.frame.clear();
            let frameBoxWidth = maskWidth + (this.frameWidth * 2);
            let frameBoxHeight = maskHeight + (this.frameWidth * 2);
            let frameX = halfBorder - this.frameWidth;
            let frameY = halfBorder - this.frameWidth;
            this.frame.beginFill(0xFFFFFF).drawRoundedRect(frameX, frameY, frameBoxWidth, frameBoxHeight, 5).endFill();
            containerToAddFrameTo.addChildAt(this.frame, 0)
        },
    }
}


 