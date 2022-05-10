import { config, Game } from "./Game";
import StartScene from "./scenes/StartScene";
import WorldScene from "./scenes/WorldScene";
import UI from "./scenes/UI";
import Scene1 from "./scenes/Scene1"
import Scene2 from "./scenes/Scene2";
import Scene3 from "./scenes/Scene3";
import Scene4 from "./scenes/Scene4";
import Scene5 from "./scenes/Scene5";
import Scene6 from "./scenes/Scene6";
import Scene7 from "./scenes/Scene7";
import Scene8 from "./scenes/Scene8";
import Scene9 from "./scenes/Scene9";
import Scene11 from "./scenes/Scene11";
import EndScene from "./scenes/EndScene";

// import MoveToTest from "../test/MoveToTest";

function launchGame() {
	// Append game scenes here, order is important!!
	config.scene = [StartScene, WorldScene, Scene1, Scene2, Scene3, Scene4, Scene5, Scene6, Scene7, Scene8, Scene9, Scene11, EndScene, UI];

	const snuffelGame = new Game(config);
}

window.addEventListener("load", launchGame);
