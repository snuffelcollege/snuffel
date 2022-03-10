import { config, Game } from "./Game";
import StartScene from "./scenes/StartScene";
import WorldScene from "./scenes/WorldScene";
import Scene2 from "./scenes/Scene2";
import Scene1 from "./scenes/Scene1";
import Scene3 from "./scenes/Scene3";
import Scene4 from "./scenes/Scene4";
import Scene5 from "./scenes/Scene5";
import Scene6 from "./scenes/Scene6";

// import MoveToTest from "../test/MoveToTest";

function launchGame() {
	// Append game scenes here
	config.scene = [StartScene, WorldScene, Scene1, Scene2, Scene3,Scene4,Scene5,Scene6];

	const snuffelGame = new Game(config);
}

window.addEventListener("load", launchGame);
