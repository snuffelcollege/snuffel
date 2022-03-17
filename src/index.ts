import { config, Game } from "./Game";
import StartScene from "./scenes/StartScene";
import WorldScene from "./scenes/WorldScene";
import UI from "./scenes/UI";
import Scene2 from "./scenes/Scene2";
//done
import Scene3 from "./scenes/Scene3";
import Scene4 from "./scenes/Scene4";
import Scene6 from "./scenes/Scene6";
import Scene8 from "./scenes/Scene8";
import Scene11 from "./scenes/Scene11";

// import MoveToTest from "../test/MoveToTest";

function launchGame() {
	// Append game scenes here, order is important!!
	config.scene = [StartScene, WorldScene, Scene2, Scene3, Scene4, Scene6, Scene8, Scene11, UI];

	const snuffelGame = new Game(config);
}

window.addEventListener("load", launchGame);
