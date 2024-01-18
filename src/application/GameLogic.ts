import IGraphicsLogic from "../libs/graphics_engine/src/graphics/IGraphicsLogic";
import GraphicsElement from "../libs/graphics_engine/src/graphics/GraphicsElement";
import Time from "../libs/graphics_engine/src/support/Time";
import ShaderProgramLibrary from "../libs/graphics_engine/src/shader/ShaderProgramLibrary";
import Renderer from "../libs/graphics_engine/src/renderer/Renderer";
import ILayerStack from "../libs/graphics_engine/src/layers/ILayerStack";
import BaseLayer from "../libs/graphics_engine/src/layers/impl/BaseLayer";
import MouseEvent from "../libs/events_system/src/mouse/MouseEvent";
import KeyboardEvent from "../libs/events_system/src/keyboard/KeyboardEvent";
import Mouse from "../libs/events_system/src/mouse/Mouse";
import Keyboard from "../libs/events_system/src/keyboard/Keyboard";
import RendererAPI from "../libs/graphics_engine/src/renderer/RendererAPI";
import BaseInput from "../libs/events_system/src/inputs/BaseInput";
import Input from "../libs/events_system/src/inputs/Input";
import BaseLayerStack from "../libs/graphics_engine/src/layers/impl/BaseLayerStack";
import RendererFactory from "../libs/graphics_engine/src/factories/RendererFactory";
import Vector4 from "../libs/graphics_engine/src/maths/impl/Vector4";
import GameLayer from "./GameLayer";

class GameLogic implements IGraphicsLogic {
	public static readonly shaderProgramLibrary: ShaderProgramLibrary = new ShaderProgramLibrary();

	public static renderer: Renderer;

	private readonly layerStack: ILayerStack<BaseLayer<MouseEvent, KeyboardEvent>>;
	private readonly mouse: Mouse;
	private readonly keyboard: Keyboard;

	public constructor() {
		Renderer.setAPI(RendererAPI.WEB_GL);

		this.mouse = new Mouse(16);
		this.keyboard = new Keyboard(16);
		Input.instance = new BaseInput(this.mouse, this.keyboard);

		this.layerStack = new BaseLayerStack();
	}

	public init(graphicsElement: GraphicsElement): void {
		const context = graphicsElement.getGraphicsContext();
		GameLogic.renderer = RendererFactory.create(context);
		GameLogic.renderer.init(context);

		const gameLayer = new GameLayer(graphicsElement);
		this.layerStack.push(gameLayer);

		const canvasElement = graphicsElement.getCanvasElement();
		this.addMouseListener(canvasElement);
		this.addKeyboardListener(canvasElement);
	}

	public input(): void {
		this.mouseInput();
		this.keyboardInput();
	}

	public update(time: Time): void {
		const layers = this.layerStack.getLayers();
		for (let layer of layers) {
			layer.update(time);
		}

		this.mouse.updateDirection();
	}

	public render(): void {
		GameLogic.renderer.setClearColor(new Vector4(0, 0, 0, 1.0));
		GameLogic.renderer.clear();

		const layers = this.layerStack.getLayers();
		for (let layer of layers) {
			layer.render();
		}
	}

	public clean(): void {
		this.mouse.flush();
		this.keyboard.flush();

		const layers = this.layerStack.getLayers();
		for (let layer of layers) {
			layer.clean();
		}

		GameLogic.shaderProgramLibrary.clean();
	}

	private addMouseListener(canvasElement: HTMLCanvasElement): void {
		canvasElement.addEventListener(
			"mousedown",
			(event) => {
				if (event.button === 0) {
					this.mouse.onLeftKeyPressed(
						event.offsetX,
						event.offsetY
					);
					return;
				}

				if (event.button === 2) {
					this.mouse.onRightKeyPressed(
						event.offsetX,
						event.offsetY
					);
					return;
				}
			});

		canvasElement.addEventListener(
			"mouseup",
			(event) => {
				if (event.button === 0) {
					this.mouse.onLeftKeyReleased(
						event.offsetX,
						event.offsetY
					);
					return;
				}

				if (event.button === 2) {
					this.mouse.onRightKeyReleased(
						event.offsetX,
						event.offsetY
					);
					return;
				}
			});

		canvasElement.addEventListener(
			'mousemove',
			(event) =>
				this.mouse.onMouseMove(
					event.offsetX,
					event.offsetY
				)
		);

		canvasElement.addEventListener(
			'mouseenter',
			() =>
				this.mouse.onMouseEnter()
		);

		canvasElement.addEventListener(
			'mouseleave',
			() =>
				this.mouse.onMouseLeave()
		);
	}

	private addKeyboardListener(canvasElement: HTMLCanvasElement): void {
		document.addEventListener(
			"keydown",
			(event) =>
				this.keyboard.onKeyPressed(event.code),
			false
		);

		document.addEventListener(
			"keyup",
			(event) =>
				this.keyboard.onKeyReleased(event.code),
			false
		);

		document.addEventListener(
			"keypress",
			(event) =>
				this.keyboard.onChar(event.key),
			false
		);
	}

	private mouseInput(): void {
		const mouseEvent = this.mouse.read();
		if (mouseEvent.isValid()) {
			const layers = this.layerStack.getLayers()
				.reverse();

			for (let layer of layers) {
				layer.mouseInput(mouseEvent);
			}
		}
	}

	private keyboardInput(): void {
		const keyboardEvent = this.keyboard.readKey();
		if (keyboardEvent.isValid()) {
			const layers = this.layerStack.getLayers()
				.reverse();

			for (let layer of layers) {
				layer.keyboardInput(keyboardEvent);
			}
		}
	}
}

export default GameLogic;