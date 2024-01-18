import BaseOrthographicCameraController
	from "../libs/graphics_engine/src/camera/controller/BaseOrthographicCameraController";
import GraphicsElement from "../libs/graphics_engine/src/graphics/GraphicsElement";
import Time from "../libs/graphics_engine/src/support/Time";
import MouseEvent from "../libs/events_system/src/mouse/MouseEvent";
import KeyboardEvent from "../libs/events_system/src/keyboard/KeyboardEvent";
import Player from "./Player";

class OrthographicCameraController extends BaseOrthographicCameraController<MouseEvent, KeyboardEvent> {
	private readonly player: Player;

	public constructor(graphicsElement: GraphicsElement, player: Player) {
		super(graphicsElement);

		this.player = player;
	}

	protected updateImpl(time: Time): void {
		const cameraPosition = this.camera.getPosition();
		const playerPosition = this.player.getPosition();
		cameraPosition.setX(playerPosition.getX());
	}

	public keyboardInput(event: KeyboardEvent): void {
	}

	public mouseInput(event: MouseEvent): void {
	}

}

export default OrthographicCameraController;