import GraphicsApplication from "../libs/graphics_engine/src/graphics/GraphicsApplication";
import IGraphicsLogic from "../libs/graphics_engine/src/graphics/IGraphicsLogic";

class Game extends GraphicsApplication {

	public constructor(parentElement: HTMLElement, logic: IGraphicsLogic) {
		super(parentElement, logic);
	}
}

export default Game;