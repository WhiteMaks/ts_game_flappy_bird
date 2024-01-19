import Player from "./Player";
import IGraphicsContext from "../libs/graphics_engine/src/renderer/IGraphicsContext";
import Vector3 from "../libs/graphics_engine/src/maths/impl/Vector3";
import birdImage from "../resources/bird.png";
import obstacleImage from "../resources/obstacle.png";
import Time from "../libs/graphics_engine/src/support/Time";
import IShaderProgram from "../libs/graphics_engine/src/shader/IShaderProgram";
import IArrayBuffer from "../libs/graphics_engine/src/buffer/IArrayBuffer";
import Cleanable from "../libs/graphics_engine/src/support/Cleanable";
import Obstacle from "./Obstacle";
import ITexture from "../libs/graphics_engine/src/resource/ITexture";
import ResourceFactory from "../libs/graphics_engine/src/factories/ResourceFactory";

class Level implements Cleanable {
	private readonly context: IGraphicsContext;
	private readonly shaderProgram: IShaderProgram;
	private readonly arrayBuffer: IArrayBuffer;
	private readonly player: Player;
	private readonly obstacleTexture: ITexture;
	private readonly obstacleOffset: number;
	private readonly maxObstaclesCount: number;

	private obstacles: Obstacle[];
	private gameOver: boolean;
	private pause: boolean;

	public constructor(context: IGraphicsContext, shaderProgram: IShaderProgram, arrayBuffer: IArrayBuffer) {
		this.context = context;
		this.shaderProgram = shaderProgram;
		this.arrayBuffer = arrayBuffer;
		this.obstacleOffset = 1.1;
		this.maxObstaclesCount = 4;

		this.gameOver = false;
		this.pause = true;

		const bird = new Image();
		bird.src = birdImage;
		this.player = new Player(context, new Vector3(0, 0, 0), bird);
		this.obstacles = [];

		const obstacle = new Image();
		obstacle.src = obstacleImage;
		this.obstacleTexture = ResourceFactory.create2DTexture(context, obstacle, 4);
		this.obstacleTexture.bind(0);

		for (let i = 0; i < this.maxObstaclesCount; i++) {
			this.createObstacle(i * this.obstacleOffset + 1.5);
		}
	}

	public update(time: Time): void {
		this.player.update(time);

		if (this.collisionTest()) {
			this.gameOver = true;
		}

		if (this.player.getPosition().getX() > this.obstacles[2].getPosition().getX()) {
			this.createObstacle(this.obstacles[this.obstacles.length - 1].getPosition().getX() + this.obstacleOffset);

			this.obstacles.shift();
			this.obstacles.shift();
		}
	}

	public render(): void {
		this.shaderProgram.bind();
		for (const obstacle of this.obstacles) {
			obstacle.render(this.shaderProgram, this.arrayBuffer);
		}
		this.player.render(this.shaderProgram, this.arrayBuffer);
	}

	public getPlayer(): Player {
		return this.player;
	}

	public collisionTest(): boolean {
		const playerPosition = this.player.getPosition();
		if (Math.abs(playerPosition.getY()) > 1) {
			return true;
		}

		const playerCollision = this.player.getCollision();
		for (const obstacle of this.obstacles) {
			const obstacleCollision = obstacle.getCollision();
			if (
				this.checkSquareCollisions(
					playerCollision[0],
					playerCollision[1],
					playerCollision[2] - playerCollision[0],
					playerCollision[7] - playerCollision[1],
					obstacleCollision[0],
					obstacleCollision[1],
					obstacleCollision[2] - obstacleCollision[0],
					obstacleCollision[7] - obstacleCollision[1]
				)
			) {
				return true;
			}
		}

		return false;
	}

	public checkSquareCollisions(square1x: number, square1y: number, square1w: number, square1h: number, square2x: number, square2y: number, square2w: number, square2h: number): boolean {
		return (
			square1x + square1w >= square2x &&
			square1x <= square2x + square2w &&
			square1y + square1h >= square2y &&
			square1y <= square2y + square2h
		);

	}

	private createObstacle(offset: number): void {
		const gap = Math.random() * 0.2;
		const centre = Math.random() * 0.5 - 0.25;

		const bottomObstacle = new Obstacle(this.context, new Vector3(offset, centre - 0.6 - gap, 0), new Vector3(0, 0, 0), this.obstacleTexture);
		this.obstacles.push(bottomObstacle);

		const topObstacle = new Obstacle(this.context, new Vector3(offset, centre + 0.6 + gap, 0), new Vector3(0, 0, 180), this.obstacleTexture);
		this.obstacles.push(topObstacle);
	}

	public isGameOver(): boolean {
		return this.gameOver;
	}

	public isPause(): boolean {
		return this.pause;
	}

	public start(): void {
		this.pause = false;
	}

	public restart(): void {
		this.player.reset();

		this.obstacles = [];
		for (let i = 0; i < this.maxObstaclesCount; i++) {
			this.createObstacle(i * this.obstacleOffset + 1.5);
		}

		this.gameOver = false;
		this.pause = true;
	}

	public clean(): void {
		for (const obstacle of this.obstacles) {
			obstacle.clean();
		}
		this.player.clean();
	}
}

export default Level;