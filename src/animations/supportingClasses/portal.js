import * as PIXI from 'pixi.js';
export default function Portal (w, h, name) {
	let cont = new PIXI.Container();
	cont.loc = name;
    let platform = new PIXI.Graphics();
    platform.beginFill(0xFF0000).drawRect(0,0,w, h).endFill();
    cont.addChild(platform);
    return cont;
 
}