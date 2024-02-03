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
import Element from "../libs/events_system/src/element/Element";
import Keyboard from "../libs/events_system/src/keyboard/Keyboard";
import RendererAPI from "../libs/graphics_engine/src/renderer/RendererAPI";
import BaseInput from "../libs/events_system/src/inputs/BaseInput";
import Input from "../libs/events_system/src/inputs/Input";
import BaseLayerStack from "../libs/graphics_engine/src/layers/impl/BaseLayerStack";
import RendererFactory from "../libs/graphics_engine/src/factories/RendererFactory";
import GameLayer from "./GameLayer";
import Renderer2D from "../libs/graphics_engine/src/renderer/Renderer2D";
import ShaderProgramFactory from "../libs/graphics_engine/src/factories/ShaderProgramFactory";
import ElementEvent from "../libs/events_system/src/element/ElementEvent";
import Default2DShader from "../libs/graphics_engine/src/support/Default2DShader";

class GameLogic implements IGraphicsLogic {
	public static readonly shaderProgramLibrary: ShaderProgramLibrary = new ShaderProgramLibrary();

	public static renderer: Renderer2D;

	private readonly layerStack: ILayerStack<BaseLayer<MouseEvent, KeyboardEvent, ElementEvent>>;
	private readonly mouse: Mouse;
	private readonly keyboard: Keyboard;
	private readonly element: Element;

	public constructor() {
		Renderer.setAPI(RendererAPI.WEB_GL);

		this.element = new Element(16);
		this.mouse = new Mouse(16);
		this.keyboard = new Keyboard(16);
		Input.instance = new BaseInput(this.mouse, this.keyboard);

		this.layerStack = new BaseLayerStack();
	}

	public init(graphicsElement: GraphicsElement): void {
		this.element.onResize(graphicsElement.getWidth(), graphicsElement.getHeight());

		const context = graphicsElement.getGraphicsContext();

		const shaderProgram = ShaderProgramFactory.createProgram(context, "2D Default shader program", Default2DShader.getVertexShader(), Default2DShader.getFragmentShader());
		GameLogic.shaderProgramLibrary.add(shaderProgram);

		GameLogic.renderer = RendererFactory.create2D(context);
		GameLogic.renderer.init(context, shaderProgram);

		const gameLayer = new GameLayer(graphicsElement);
		this.layerStack.push(gameLayer);

		const canvasElement = graphicsElement.getCanvasElement();
		this.addMouseListener(canvasElement);
		this.addKeyboardListener(canvasElement);
		this.addElementListener(graphicsElement);
	}

	public input(): void {
		const layers = this.layerStack.getLayers()
			.reverse();

		const mouseEvent = this.mouse.read();
		if (mouseEvent.isValid()) {
			for (let layer of layers) {
				layer.mouseInput(mouseEvent);
			}
		}

		const keyboardEvent = this.keyboard.readKey();
		if (keyboardEvent.isValid()) {
			for (let layer of layers) {
				layer.keyboardInput(keyboardEvent);
			}
		}

		const elementEvent = this.element.read();
		if (elementEvent.isValid()) {
			for (let layer of layers) {
				layer.elementInput(elementEvent);
			}
		}
	}

	public update(time: Time): void {
		const layers = this.layerStack.getLayers();
		for (let layer of layers) {
			layer.update(time);
		}

		this.mouse.updateDirection();
	}

	public render(): void {
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
		GameLogic.renderer.clean();
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

	private addElementListener(graphicsElement: GraphicsElement): void {
		window.addEventListener(
			"resize",
			() => {
				graphicsElement.resize();
				this.element.onResize(graphicsElement.getWidth(), graphicsElement.getHeight());
			}
		);
	}
}

export default GameLogic;