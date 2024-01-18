import BaseLayer from "../libs/graphics_engine/src/layers/impl/BaseLayer";
import CameraController from "../libs/graphics_engine/src/camera/controller/CameraController";
import Vector4 from "../libs/graphics_engine/src/maths/impl/Vector4";
import IArrayBuffer from "../libs/graphics_engine/src/buffer/IArrayBuffer";
import IShaderProgram from "../libs/graphics_engine/src/shader/IShaderProgram";
import ITexture from "../libs/graphics_engine/src/resource/ITexture";
import GraphicsElement from "../libs/graphics_engine/src/graphics/GraphicsElement";
import MouseEvent from "../libs/events_system/src/mouse/MouseEvent";
import KeyboardEvent from "../libs/events_system/src/keyboard/KeyboardEvent";
import OrthographicCameraController from "./OrthographicCameraController";
import BufferLayout from "../libs/graphics_engine/src/buffer/BufferLayout";
import {NewBufferElement} from "../libs/graphics_engine/src/buffer/BufferElement";
import ShaderDataType from "../libs/graphics_engine/src/shader/ShaderDataType";
import BufferFactory from "../libs/graphics_engine/src/factories/BufferFactory";
import ShaderProgramFactory from "../libs/graphics_engine/src/factories/ShaderProgramFactory";
import GameLogic from "./GameLogic";
import ResourceFactory from "../libs/graphics_engine/src/factories/ResourceFactory";
import Time from "../libs/graphics_engine/src/support/Time";
import {textureFragmentShaderCode, textureVertexShaderCode} from "./TextureShader";
import obstacleImage from "../resources/obstacle.png";
import Level from "./Level";

class GameLayer extends BaseLayer<MouseEvent, KeyboardEvent> {
	private readonly graphicsElement: GraphicsElement;
	private readonly color: Vector4;

	private cameraController: CameraController<MouseEvent, KeyboardEvent> | undefined;
	private level: Level | undefined;

	private vertexArray: IArrayBuffer | undefined;
	private shaderProgram: IShaderProgram | undefined;
	private obstacleTexture: ITexture | undefined;

	public constructor(graphicsElement: GraphicsElement) {
		super("Game layer");

		this.graphicsElement = graphicsElement;
		this.color = new Vector4(1.0, 0.0, 1.0, 1.0);
	}

	public attach(): void {
		const square: number[] = [
			-0.5, -0.5,  0.0,  0.0,
			 0.5, -0.5,  1.0,  0.0,
			 0.5,  0.5,  1.0,  1.0,
			-0.5,  0.5,  0.0,  1.0
		];

		const indexes: number[] = [
			0, 1, 2,
			2, 3, 0
		];

		const bufferLayout: BufferLayout = new BufferLayout([
			NewBufferElement(ShaderDataType.FLOAT_2, "a_Position"),
			NewBufferElement(ShaderDataType.FLOAT_2, "a_TextureCoordinate"),
		]);

		const context = this.graphicsElement.getGraphicsContext();

		const vertexBuffer = BufferFactory.createFloat32VertexStaticBuffer(context, square);
		vertexBuffer.setLayout(bufferLayout);

		const indexBuffer = BufferFactory.createUint16IndexStaticBuffer(context, indexes);

		this.vertexArray = BufferFactory.createVertexArrayBuffer(context);
		this.vertexArray.addVertexBuffer(vertexBuffer);
		this.vertexArray.setIndexBuffer(indexBuffer);

		this.vertexArray.unbind();
		vertexBuffer.unbind();
		indexBuffer.unbind();

		this.shaderProgram = ShaderProgramFactory.createProgram(context, "First shader program", textureVertexShaderCode, textureFragmentShaderCode);
		this.shaderProgram.bind();
		GameLogic.shaderProgramLibrary.add(this.shaderProgram);

		const obstacle = new Image();
		obstacle.src = obstacleImage;
		this.obstacleTexture = ResourceFactory.create2DTexture(context, obstacle, 4);
		this.obstacleTexture.bind(0);
		this.shaderProgram.setVector4f("u_Color", this.color);

		this.shaderProgram.unbind();

		this.level = new Level(context, this.shaderProgram, this.vertexArray);
		this.cameraController = new OrthographicCameraController(this.graphicsElement, this.level.getPlayer());
	}

	public detach(): void {
	}

	public keyboardInput(event: KeyboardEvent): void {
		this.cameraController.keyboardInput(event);
	}

	public mouseInput(event: MouseEvent): void {
		this.cameraController.mouseInput(event);
	}

	public update(time: Time): void {
		this.cameraController.update(time);
		this.level.update(time);

		if (this.level.isGameOver()) {
			this.level.restart();
		}
	}

	public render(): void {
		GameLogic.renderer.begin(this.cameraController.getCamera());
		this.level.render();
		GameLogic.renderer.end();
	}

	public clean(): void {
		this.vertexArray?.clean();
		this.shaderProgram?.clean();
		this.obstacleTexture?.clean();
		this.level.clean();
	}
}

export default GameLayer;