import Vector3 from "../libs/graphics_engine/src/maths/impl/Vector3";
import ITexture from "../libs/graphics_engine/src/resource/ITexture";
import ResourceFactory from "../libs/graphics_engine/src/factories/ResourceFactory";
import IGraphicsContext from "../libs/graphics_engine/src/renderer/IGraphicsContext";
import GameLogic from "./GameLogic";
import Transformation from "../libs/graphics_engine/src/maths/support/Transformation";
import Cleanable from "../libs/graphics_engine/src/support/Cleanable";
import Time from "../libs/graphics_engine/src/support/Time";
import Input from "../libs/events_system/src/inputs/Input";
import Key from "../libs/events_system/src/keyboard/Key";

class Player implements Cleanable {
	private readonly texture: ITexture;

	private readonly position: Vector3;
	private readonly rotation: Vector3;
	private readonly scale: Vector3;
	private readonly velocity: Vector3;

	private readonly jumpPower: number;
	private readonly gravity: number;

	public constructor(context: IGraphicsContext, position: Vector3, image: HTMLImageElement) {
		this.position = position;
		this.rotation =  new Vector3(0, 0, 0);
		this.scale = new Vector3(0.1, 0.1, 1);
		this.velocity = new Vector3(0.0007, 0, 0);

		this.jumpPower = 0.00005;
		this.gravity = 0.00004;

		this.texture = ResourceFactory.create2DTexture(context, image, 4);
		this.texture.bind(0);
	}

	public reset(): void {
		this.position.setX(0);
		this.position.setY(0);
		this.position.setZ(0);

		this.rotation.setZ(0);

		this.velocity.setY(0);
	}

	public update(time: Time): void {
		let velocityY: number;
		if (Input.isKeyboardKeyPressed(Key.SPACE)) {
			velocityY = this.velocity.getY() + this.jumpPower;
		} else {
			velocityY = this.velocity.getY() - this.gravity;
		}
		velocityY = this.clamp(velocityY, -0.002, 0.002);
		this.velocity.setY(velocityY);

		this.position.setX(this.position.getX() + this.velocity.getX() * time.getDeltaTime());
		this.position.setY(this.position.getY() + this.velocity.getY() * time.getDeltaTime());

		this.rotation.setZ(this.velocity.getY() * 40000);
	}

	public render(): void {
		GameLogic.renderer.drawTrianglesWithTexture(Transformation.getWorldMatrix(this.position, this.rotation, this.scale), this.texture);
	}

	public getPosition(): Vector3 {
		return this.position;
	}

	public clean(): void {
		this.texture.clean();
	}

	public getCollision(): number[] {
		return [
			-0.5 * this.scale.getX() + this.position.getX(), -0.5 * this.scale.getY() + this.position.getY(), //leftBottom
			0.5 * this.scale.getX() + this.position.getX(), -0.5 * this.scale.getY() + this.position.getY(), //rightBottom
			0.5 * this.scale.getX() + this.position.getX(),  0.5 * this.scale.getY() + this.position.getY(), //rightTop
			-0.5 * this.scale.getX() + this.position.getX(),  0.5 * this.scale.getY() + this.position.getY(), //leftTop
		];
	}

	private clamp(currentValue: number, minValue: number, maxValue: number): number {
		if (currentValue > maxValue) {
			return maxValue;
		}

		if (currentValue < minValue) {
			return minValue;
		}

		return currentValue;
	}

}

export default Player;