import Background from "@assets/background.png";
import Logo from "@assets/snuffelcollege-logo.png";
import PlayButtonJson from "@assets/spritesheets/playButton/play_button.json";
import PlayButtonImage from "@assets/spritesheets/playButton/play_button.png";
import HuskyImage from "@assets/spritesheets/husky/husky.png";
import HuskyJson from "@assets/spritesheets/husky/husky.json";
import { Scene } from "phaser";
import ComponentService from "../Services/ComponentService";
import MakeFullscreen from "../Components/MakeFullscreen";
import { addFadeIn, fadeToBlack } from "../Utilities/Scene/Fader";
import { WorldSceneConfig } from "./WorldScene";
import SettingsConfig = Phaser.Types.Scenes.SettingsConfig;
import PhaserText = Phaser.GameObjects.Text;

export const config: SettingsConfig = {
	active: false,
	key: "start-scene",
	physics: {
		default: "arcade",
		arcade: {
			gravity: { y: 200 },
			debug: process.env.NODE_ENV === "development",
		},
	},
};

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

export default class StartScene extends Scene {
	private components!: ComponentService;

	private husky!: string;

	private playButton!: string;

	constructor(cfg: SettingsConfig = config) {
		super(cfg);
	}

	public init(): void {
		this.playButton = "play_button";
		this.husky = "husky";

		this.components = new ComponentService();

		addFadeIn(this);
	}

	// A key has to be unique for the entire project, not just this scene.
	public preload(): void {
		this.load.aseprite(this.husky, HuskyImage, HuskyJson);
		this.load.aseprite(this.playButton, PlayButtonImage, PlayButtonJson);
		this.load.image("background", Background);
		this.load.image("logo", Logo);
	}

	public create(): void {
		const centerX = this.scale.width * 0.5;
		const centerY = this.scale.height * 0.5;

		const img = this.add.image(centerX, centerY, "background");
		this.components.addComponent(img, MakeFullscreen);

		const title = new PhaserText(
			this,
			centerX,
			centerY / 2,
			"Sophia SnuffelSpel",
			textStyle
		);
		title.setFontSize(124).setOrigin(0.5, 0.5);
		this.add.existing(title);

		this.add.image(this.scale.width - 256, this.scale.height - 128, "logo");

		const dogAnimTags = this.anims.createFromAseprite(this.husky);
		this.add
			.sprite(centerX / 2, centerY + centerY / 2, this.husky)
			.play({ key: dogAnimTags[1].key, repeat: -1 }, true)
			.setScale(0.5);

		const startButtonAnimTags = this.anims.createFromAseprite(
			this.playButton
		);
		const startButton = this.add
			.sprite(centerX, centerY, this.playButton, 1)
			.play({ key: startButtonAnimTags[0].key, repeat: -1 })
			.setInteractive({ useHandCursor: true })
			.on("pointerdown", () => {
				fadeToBlack(this, () => {
					this.scene.start(WorldSceneConfig.key);
				});
			})
			.on("pointerover", () => {
				startButton.tint = 0xf0_d8_00;
			})
			.on("pointerup", () => {
				startButton.tint = 0xf0_d8_00;
			})
			.on("pointerout", () => startButton.clearTint());
	}
}
