export default function Protagonist (PIXI, diameter) {
    let sprite = new PIXI.Sprite.fromImage('/bmps/character.png');
    sprite.anchor.x = sprite.anchor.y =0.5;

    const cont = new PIXI.Container();
    cont.alpha = 0.5;
    cont.radius = diameter / 2;
    cont.sprite = sprite;
    cont.addChild(sprite);
    return cont;
}