import Game from "./application/Game";
import GameLogic from "./application/GameLogic";

const parentElement = document.getElementById("game");
if (!parentElement) {
	throw new Error("Game element nof found");
}

const game = new Game(parentElement, new GameLogic());
game.start();