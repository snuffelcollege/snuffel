import Background from "@assets/images/world/background.png";
import Logo from "@assets/images/world/snuffelcollege-logo.png";
import Title from "@assets/images/world/title.png";
import StartButton from "@assets/images/world/Start_button.png";
import CreditsButton from "@assets/images/UI/credits_button.png";
import HuskyImage from "@assets/spritesheets/husky/husky.png";
import HuskyJson from "@assets/spritesheets/husky/husky.json";
import { Scene } from "phaser";
import ComponentService from "../Services/ComponentService";
import MakeFullscreen from "../Components/MakeFullscreen";
import { addFadeIn, fadeToBlack } from "../Utilities/Scene/Fader";
import { WorldSceneConfig } from "./WorldScene";
import SettingsConfig = Phaser.Types.Scenes.SettingsConfig;
import PhaserText = Phaser.GameObjects.Text;
import BackgroundSongMP3 from "@assets/audio/overworld.mp3";
import SceneSong from "@assets/audio/scene.mp3";

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

	private startButton!: string;
	private creditsButton!: string;

	constructor(cfg: SettingsConfig = config) {
		super(cfg);
	}

	public init(): void {
		this.startButton = "startButton";
		this.creditsButton = "creditsButton";
		this.husky = "husky";

		this.components = new ComponentService();

		addFadeIn(this);
	}

	// A key has to be unique for the entire project, not just this scene.
	public preload(): void {
		this.load.aseprite(this.husky, HuskyImage, HuskyJson);
		this.load.image("startButton", StartButton);
		this.load.image("creditsButton", CreditsButton);
		this.load.image("background", Background);
		this.load.image("logo", Logo);
		this.load.image("title", Title);
		this.load.audio("backgroundSong", BackgroundSongMP3);
		this.load.audio("scenesong", SceneSong);
	}

	public create(): void {
		const centerX = this.scale.width * 0.5;
		const centerY = this.scale.height * 0.5;

		const img = this.add.image(centerX, centerY, "background");
		this.components.addComponent(img, MakeFullscreen);

		this.add.image(centerX, centerY-150, "title").setScale(0.5);

		this.add.image(this.scale.width - 256, this.scale.height - 128, "logo");

		const dogAnimTags = this.anims.createFromAseprite(this.husky);
		this.add
			.sprite(centerX / 2, centerY + centerY / 2, this.husky)
			.play({ key: dogAnimTags[1].key, repeat: -1 }, true)
			.setScale(0.5);

		const startButton = this.add
			.image(centerX, centerY+150, this.startButton)
			.setScale(0.5)
			.setInteractive({ useHandCursor: true })
			.on("pointerdown", () => {
				fadeToBlack(this, () => {
					this.scene.start(WorldSceneConfig.key);
					this.scene.stop("start-scene");
					var song = this.sound.add("backgroundSong");
					this.sound.add("scenesong");
					song.play({
						loop: true,
						volume: 0.3
					});
					this.scene.stop("UIScene");
					this.scene.start("UIScene");
				});
			})
			.on("pointerover", () => {
				startButton.displayHeight = startButton.displayHeight*1.1;
				startButton.displayWidth = startButton.displayWidth*1.1;
			})
			.on("pointerout", () => {
				startButton.displayHeight = startButton.displayHeight/1.1;
				startButton.displayWidth = startButton.displayWidth/1.1;
			});

		const creditsButton = this.add
			.image(centerX, centerY + 300, this.creditsButton)
			.setScale(0.5)
			.setInteractive({ useHandCursor: true})
			.on("pointerover", () => {
				creditsButton.setScale(0.6);
			})
			.on("pointerout", () => {
				creditsButton.setScale(0.5);
			})
			.on("pointerdown", () => {
				this.scene.start("credits");
				this.scene.stop("start-scene");
			});
	}
}
