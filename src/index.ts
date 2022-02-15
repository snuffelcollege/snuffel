import { config, Game } from "./Game";
import StartScene from "./scenes/StartScene";
import WorldScene from "./scenes/WorldScene";
import Scene2 from "./scenes/Scene2";
import Scene1 from "./scenes/Scene1";
import Scene3 from "./scenes/Scene3";

// import MoveToTest from "../test/MoveToTest";

function launchGame() {
	// Append game scenes here
	config.scene = [StartScene, WorldScene, Scene1, Scene2, Scene3];

	const snuffelGame = new Game(config);
}

window.addEventListener("load", launchGame);
