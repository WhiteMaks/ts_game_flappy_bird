import Vector3 from "../libs/game_engine/src/libs/graphics_engine/src/maths/impl/Vector3";
import ITexture from "../libs/game_engine/src/libs/graphics_engine/src/resource/ITexture";
import Cleanable from "../libs/game_engine/src/libs/graphics_engine/src/support/Cleanable";
import GameEngine from "../libs/game_engine/src/application/GameEngine";

class Obstacle implements Cleanable {
	private readonly texture: ITexture;

	private readonly position: Vector3;
	private readonly rotation: Vector3;
	private readonly scale: Vector3;

	public constructor(position: Vector3, rotation: Vector3, texture: ITexture) {
		this.position = position;
		this.rotation =  rotation;
		this.scale = new Vector3(0.1, 1, 1);

		this.texture = texture;
	}

	public render(): void {
		GameEngine.renderer2D.drawQuadWithTexture(this.position, this.rotation, this.scale, this.texture);
	}

	public getPosition(): Vector3 {
		return this.position;
	}

	public getCollision(): number[] {
		return [
			-0.5 * this.scale.getX() + this.position.getX(), -0.5 * this.scale.getY() + this.position.getY(), //leftBottom
			0.5 * this.scale.getX() + this.position.getX(), -0.5 * this.scale.getY() + this.position.getY(), //rightBottom
			0.5 * this.scale.getX() + this.position.getX(),  0.5 * this.scale.getY() + this.position.getY(), //rightTop
			-0.5 * this.scale.getX() + this.position.getX(),  0.5 * this.scale.getY() + this.position.getY(), //leftTop
		];
	}

	public clean(): void {
		this.texture.clean();
	}

}

export default Obstacle;