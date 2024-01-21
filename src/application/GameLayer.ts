import BaseLayer from "../libs/graphics_engine/src/layers/impl/BaseLayer";
import CameraController from "../libs/graphics_engine/src/camera/controller/CameraController";
import ITexture from "../libs/graphics_engine/src/resource/ITexture";
import GraphicsElement from "../libs/graphics_engine/src/graphics/GraphicsElement";
import MouseEvent from "../libs/events_system/src/mouse/MouseEvent";
import KeyboardEvent from "../libs/events_system/src/keyboard/KeyboardEvent";
import OrthographicCameraController from "./OrthographicCameraController";
import GameLogic from "./GameLogic";
import ResourceFactory from "../libs/graphics_engine/src/factories/ResourceFactory";
import Time from "../libs/graphics_engine/src/support/Time";
import obstacleImage from "../resources/obstacle.png";
import Level from "./Level";
import Key from "../libs/events_system/src/keyboard/Key";

class GameLayer extends BaseLayer<MouseEvent, KeyboardEvent> {
	private readonly graphicsElement: GraphicsElement;

	private cameraController: CameraController<MouseEvent, KeyboardEvent> | undefined;
	private level: Level | undefined;

	private obstacleTexture: ITexture | undefined;

	public constructor(graphicsElement: GraphicsElement) {
		super("Game layer");

		this.graphicsElement = graphicsElement;
	}

	public attach(): void {
		const context = this.graphicsElement.getGraphicsContext();

		const obstacle = new Image();
		obstacle.src = obstacleImage;
		this.obstacleTexture = ResourceFactory.create2DTexture(context, obstacle, 4);
		this.obstacleTexture.bind(0);

		this.level = new Level(context);
		this.cameraController = new OrthographicCameraController(this.graphicsElement, this.level.getPlayer());
	}

	public detach(): void {
	}

	public keyboardInput(event: KeyboardEvent): void {
		this.cameraController.keyboardInput(event);

		if (event.getCode() === Key.SPACE.valueOf()) {
			this.level.start();
		}
	}

	public mouseInput(event: MouseEvent): void {
		this.cameraController.mouseInput(event);
	}

	public update(time: Time): void {
		if (this.level.isPause()) {
			return;
		}

		if (this.level.isGameOver()) {
			this.level.restart();

			this.cameraController.update(time);
			this.level.update(time);
		}

		this.cameraController.update(time);
		this.level.update(time);
	}

	public render(): void {
		GameLogic.renderer.begin(this.cameraController.getCamera());
		this.level.render();
		GameLogic.renderer.end();
	}

	public clean(): void {
		this.obstacleTexture?.clean();
		this.level.clean();
	}
}

export default GameLayer;