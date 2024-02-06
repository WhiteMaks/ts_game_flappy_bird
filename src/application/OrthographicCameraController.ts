import BaseOrthographicCameraController
	from "../libs/game_engine/src/libs/graphics_engine/src/camera/controller/BaseOrthographicCameraController";
import Time from "../libs/game_engine/src/libs/graphics_engine/src/support/Time";
import MouseEvent from "../libs/game_engine/src/libs/events_system/src/mouse/MouseEvent";
import KeyboardEvent from "../libs/game_engine/src/libs/events_system/src/keyboard/KeyboardEvent";
import Player from "./Player";

class OrthographicCameraController extends BaseOrthographicCameraController<MouseEvent, KeyboardEvent> {
	private readonly player: Player;

	public constructor(width: number, height: number, player: Player) {
		super(width, height);

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