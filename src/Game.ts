import { Scale } from "phaser";
import GameConfig = Phaser.Types.Core.GameConfig;
import ScaleModes = Phaser.Scale.ScaleModes;

// TODO: Detect mobile browsers and adjust zoom factor

const config: GameConfig = {
	title: process.env.TITLE,
	parent: process.env.TARGET_ID,
	zoom: window.devicePixelRatio,
	scale: {
		autoCenter: Scale.CENTER_BOTH,
		mode: ScaleModes.FIT,
		width: window.innerWidth,
		height: window.innerHeight,
	},
	audio: {
		disableWebAudio: true
	},
	pixelArt: false,
	antialiasGL: false,
	roundPixels: false,
};

class Game extends Phaser.Game {
	constructor(cfg: GameConfig = config) {
		super(cfg);
	}
}

export { Game, config };
