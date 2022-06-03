import BackgroundImage from "@assets/images/scenario_1/BG.png";
import Black from "@assets/images/UI/black.png";
import CongratsImage from "@assets/images/UI/congrats.png";
import EndSceneImage from "@assets/images/UI/end_scene.png";
import EndSceneButton from "@assets/images/UI/end_scene_button.png";
import EndSceneNo from "@assets/images/UI/end_scene_no.png";
import EndSceneYes from "@assets/images/UI/end_scene_yes.png";
import EndSceneChoose from "@assets/images/UI/end_scene_choose.png";
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

	constructor(cfg: SettingsConfig = config) {
		super(cfg);
	}

	public init(): void {

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
		this.load.image("endSceneImage", EndSceneImage);
		this.load.image("endSceneButton", EndSceneButton);
		this.load.image("endSceneNo", EndSceneNo);
		this.load.image("endSceneYes", EndSceneYes);
		this.load.image("endSceneChoose", EndSceneChoose);
		this.load.image("backgroundEnd", BackgroundImage);
		this.load.image("black", Black);
		this.load.image("congratsImage", CongratsImage);
		this.load.image("replayButton", ReplayButton);
		this.load.audio("congrats", CongratsAudio);		
	}

	public create(): void {
		const centerX = this.scale.displaySize.width * 0.5;
		const centerY = this.scale.displaySize.height * 0.5;

		const background = this.add.image(centerX, centerY, "backgroundEnd").setDepth(0);

		this.components.addComponent(background, MakeFullscreen);

		const congrats = this.add.image(950, 400,"congratsImage").setScale(0.5);

		this.game.sound.pauseAll();
		this.sound.add("scenesong", {volume: 0.3}).play({
			loop: true
		});
		this.sound.add("congrats", {volume: 0.5}).play();
		setTimeout(() => {
			const black = this.add.image(0, 0, "black").setAlpha(0.5).setDepth(1);
			this.components.addComponent(black, MakeFullscreen);
			this.createSituation();
		}, 3000);
	}

	private createSituation(): void {
		const endImage = this.add.image(950, 500, "endSceneImage").setScale(0.4).setDepth(2);
		
		const linkButton = this.add.image(950,650,"endSceneButton").setDepth(2);

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
		
		const replayButton = this.add.image(1325, 450, "replayButton").setDepth(2);

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
				endImage.setTexture("endSceneChoose");
				linkButton.setVisible(false);
				replayButton.setVisible(false);
				const no = this.add.image(1050, 635, "endSceneNo").setDepth(2);
				no
					.setScale(0.4)
					.on("pointerover", () => {
						no.setScale(0.5)
					})
					.on("pointerout", () => {
						no.setScale(0.4)
					})
					.setInteractive({ useHandCursor: true, pixelPerfect: true })
					.on("pointerdown", () => {
						window.open("https://www.sophia-vereeniging.nl/campagnes/sophiasnuffelcollege/snuffelspel/goed-gedaan/")
					})
					
				const yes = this.add.image(850, 635, "endSceneYes").setDepth(2);
				yes
					.setScale(0.4)
					.on("pointerover", () => {
						yes.setScale(0.5)
					})
					.on("pointerout", () => {
						yes.setScale(0.4)
					})
					.setInteractive({ useHandCursor: true, pixelPerfect: true })
					.on("pointerdown", () => {
						window.location.reload();
					})
			})

		this.add.tween({
			targets: [endImage, linkButton, replayButton],
			ease: 'Sine.easeInOut',
			duration: 500,
			delay: 0,
			alpha: {
				getStart: () => 0,
				getEnd: () => 1
			}
		});
	}
}
