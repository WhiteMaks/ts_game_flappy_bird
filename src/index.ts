import Game from "./application/Game";
import GameLayer from "./application/GameLayer";

const parentElement = document.getElementById("game");
if (!parentElement) {
	throw new Error("Game element nof found");
}

const game = new Game(parentElement);
const gameLayer = new GameLayer(game.getGraphicsElement());
game.pushLayer(gameLayer);
game.init2DRenderer();
game.start();