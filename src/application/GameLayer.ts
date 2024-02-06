import BaseLayer from "../libs/game_engine/src/libs/graphics_engine/src/layers/impl/BaseLayer";
import CameraController from "../libs/game_engine/src/libs/graphics_engine/src/camera/controller/CameraController";
import ITexture from "../libs/game_engine/src/libs/graphics_engine/src/resource/ITexture";
import GraphicsElement from "../libs/game_engine/src/libs/graphics_engine/src/graphics/GraphicsElement";
import MouseEvent from "../libs/game_engine/src/libs/events_system/src/mouse/MouseEvent";
import KeyboardEvent from "../libs/game_engine/src/libs/events_system/src/keyboard/KeyboardEvent";
import OrthographicCameraController from "./OrthographicCameraController";
import ResourceFactory from "../libs/game_engine/src/libs/graphics_engine/src/factories/ResourceFactory";
import Time from "../libs/game_engine/src/libs/graphics_engine/src/support/Time";
import obstacleImage from "../resources/obstacle.png";
import Level from "./Level";
import Key from "../libs/game_engine/src/libs/events_system/src/keyboard/Key";
import Vector4 from "../libs/game_engine/src/libs/graphics_engine/src/maths/impl/Vector4";
import ElementEvent from "../libs/game_engine/src/libs/events_system/src/element/ElementEvent";
import ElementEventType from "../libs/game_engine/src/libs/events_system/src/element/ElementEventType";
import GameEngine from "../libs/game_engine/src/application/GameEngine";

class GameLayer extends BaseLayer<MouseEvent, KeyboardEvent, ElementEvent> {
	private readonly graphicsElement: GraphicsElement;
	private readonly spaceColor: Vector4;

	private cameraController: CameraController<MouseEvent, KeyboardEvent> | undefined;
	private level: Level | undefined;

	private obstacleTexture: ITexture | undefined;

	public constructor(graphicsElement: GraphicsElement) {
		super("Game layer");

		this.graphicsElement = graphicsElement;
		this.spaceColor = new Vector4(0.05, 0.05, 0.05, 1.0);
	}

	public attach(): void {
		const context = this.graphicsElement.getGraphicsContext();

		const obstacle = new Image();
		obstacle.src = obstacleImage;
		this.obstacleTexture = ResourceFactory.create2DTexture(context, obstacle, 4);
		this.obstacleTexture.bind(0);

		this.level = new Level(context);
		this.cameraController = new OrthographicCameraController(this.graphicsElement.getWidth(), this.graphicsElement.getHeight(), this.level.getPlayer());
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

	public elementInput(event: ElementEvent) {
		if (event.getType() === ElementEventType.RESIZE) {
			this.cameraController.resize(event.getWidth(), event.getHeight());
		}
	}

	public update(time: Time): void {
		this.cameraController.update(time);

		if (this.level.isPause()) {
			return;
		}

		if (this.level.isGameOver()) {
			this.level.restart();

			this.level.update(time);
		}

		this.level.update(time);
	}

	public render(): void {
		GameEngine.renderer2D.resetStatistics();

		GameEngine.renderer2D.setClearColor(this.spaceColor);
		GameEngine.renderer2D.clear();

		GameEngine.renderer2D.begin(this.cameraController.getCamera());
		this.level.render();
		GameEngine.renderer2D.end();

		GameEngine.renderer2D.getStatics();
	}

	public clean(): void {
		this.obstacleTexture?.clean();
		this.level.clean();
	}
}

export default GameLayer;