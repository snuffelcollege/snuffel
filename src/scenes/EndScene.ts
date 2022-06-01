import BackgroundImage from "@assets/images/scenario_1/BG.png";
import CongratsImage from "@assets/images/UI/congrats.png";
import Option1 from "@assets/images/world/restart_sign.png";
import Option2 from "@assets/images/world/continue_sign.png";
import EndSceneImage from "@assets/images/UI/end_scene.png";
import EndSceneButton from "@assets/images/UI/end_scene_button.png";
import ReplayButton from "@assets/images/UI/replay_button.png";
import { Scene } from "phaser";
import SceneLifecycle from "../SceneLifecycle";
import { addFadeIn, fadeToBlack } from "../Utilities/Scene/Fader";
import ComponentService from "../Services/ComponentService";
import MakeFullscreen from "../Components/MakeFullscreen";
import { WorldSceneConfig } from "./WorldScene";
import MoveTo from "../Components/MoveTo";
import SettingsConfig = Phaser.Types.Scenes.SettingsConfig;
import Sprite = Phaser.GameObjects.Sprite;
import CongratsAudio from "@assets/audio/congrats.mp3";

// Config for the scene defining gravity and debug settings.
export const config: SettingsConfig = {
	active: false,
	key: "end-scene",
	physics: {
		default: "arcade",
		arcade: {
			gravity: { y: 0 },
			debug: process.env.NODE_ENV === "development",
		},
	},
};

// Config for the text style.
export const textStyle: Phaser.Types.GameObjects.Text.TextStyle = {
	color: "#ffe500",
	fontFamily: "Trebuchet MS",
	fontSize: "48px",
	padding: {
		x: 15,
		y: 15,
	},
	align: "center",
	stroke: "#ffe500",
	strokeThickness: 2,
	shadow: {
		offsetY: 1,
		offsetX: 1,
		stroke: true,
		color: "#000",
	},
};

export const CharacterRunData = {
	frameHeight: 256,
	frameWidth: 256,
};

export default class Scene5 extends Scene implements SceneLifecycle {
	
	private components!: ComponentService;

	private exitSceneKey!: string;

	private option1!: string;

	private option2!: string;

	constructor(cfg: SettingsConfig = config) {
		super(cfg);
	}

	public init(): void {
		
		this.option1 = "option1end";
		this.option2 = "option2end";

		if (!WorldSceneConfig.key) {
			throw Error("Exit scene key is undefined");
		}

		this.exitSceneKey = WorldSceneConfig.key;

		this.components = new ComponentService();
		// The moment the scene renders, a fade from black is started using this function.
		addFadeIn(this);
	}

	// A key has to be unique for the entire project, not just this scene.
	public preload(): void {
		this.load.image(this.option1, Option1);
		this.load.image(this.option2, Option2);
		this.load.image("endSceneImage", EndSceneImage);
		this.load.image("endSceneButton", EndSceneButton);
		this.load.image("backgroundEnd", BackgroundImage);
		this.load.image("congratsImage", CongratsImage);
		this.load.image("replayButton", ReplayButton);
		this.load.audio("congrats", CongratsAudio);		
	}

	public create(): void {
		const centerX = this.scale.displaySize.width * 0.5;
		const centerY = this.scale.displaySize.height * 0.5;

		const img = this.add.image(centerX, centerY, "backgroundEnd");

		this.components.addComponent(img, MakeFullscreen);

		this.add.image(950, 400,"congratsImage").setScale(0.5);

		this.createSituation();
	}

	private createSituation(): void {
		this.game.sound.pauseAll();
		this.sound.add("scenesong", {volume: 0.3}).play({
			loop: true
		});
		this.sound.add("congrats", {volume: 0.5}).play();
		setTimeout(() => {
			this.createChoice();
		}, 2000);
	}
	

	private createChoice(): void {			
		
		this.add.image(1000, 850, "endSceneImage").setScale(0.4);
		
		const linkButton = this.add.image(1000,1000,"endSceneButton");

		linkButton
			.setScale(0.4)
			.on("pointerover", () => {
				linkButton.setScale(0.5)
			})
			.on("pointerout", () => {
				linkButton.setScale(0.4)
			})
			.setInteractive({ useHandCursor: true, pixelPerfect: true })
			.on("pointerdown", () => {
				window.open("https://www.sophia-vereeniging.nl/campagnes/sophiasnuffelcollege/snuffelspel/goed-gedaan/")
			})
		
		const replayButton = this.add.image(1375, 1000, "replayButton");

		replayButton
			.setScale(0.4)
			.on("pointerover", () => {
				replayButton.setScale(0.5)
			})
			.on("pointerout", () => {
				replayButton.setScale(0.4)
			})
			.setInteractive({ useHandCursor: true, pixelPerfect: true })
			.on("pointerdown", () => {
				window.location.reload();
			})
	}
}
