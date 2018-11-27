export default function Portal (PIXI, w,h) {
	let cont = new PIXI.Container();
    let platform = new PIXI.Graphics();
    platform.beginFill(0xFF0000).drawRect(0,0,w, h).endFill();
    cont.addChild(platform);
    return cont;
 
}