import Background from "@assets/images/world/background.png";
import CreditsImage from "@assets/images/world/credits.png";
import ReturnButton from "@assets/images/UI/back.png";
import SnuffelSheet from "@assets/spritesheets/scenario_1/snuffelidle.png";
import SnuffelData from "@assets/spritesheets/scenario_1/snuffelidle.json";
import { Scene } from "phaser";
import SceneLifecycle from "../SceneLifecycle";
import { addFadeIn } from "../Utilities/Scene/Fader";
import ComponentService from "../Services/ComponentService";
import MakeFullscreen from "../Components/MakeFullscreen";
import { WorldSceneConfig } from "./WorldScene";
import MoveTo from "../Components/MoveTo";
import SettingsConfig = Phaser.Types.Scenes.SettingsConfig;
import Sprite = Phaser.GameObjects.Sprite;

// Config for the scene defining gravity and debug settings.
export const config: SettingsConfig = {
	active: false,
	key: "credits",
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

export default class CreditsScene extends Scene implements SceneLifecycle {
	
	private components!: ComponentService;

	private exitSceneKey!: string;

	private background!: string;

	private creditsImage!: string;

	private returnButton!: string;

	private snuffelEntity!: Sprite;

	constructor(cfg: SettingsConfig = config) {
		super(cfg);
	}

	public init(): void {
		
		this.background = "creditsBackground";
		this.creditsImage = "creditsImage";
		this.returnButton = "returnButton"

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
		this.load.image(this.background, Background);
		this.load.image(this.creditsImage, CreditsImage);
		this.load.image(this.returnButton, ReturnButton);
		this.load.aseprite("Snuffel", SnuffelSheet, SnuffelData);
	}

	public create(): void {
		const centerX = this.scale.displaySize.width * 0.5;
		const centerY = this.scale.displaySize.height * 0.5;
		const img = this.add.image(centerX, centerY, this.background).setDepth(0);
		this.components.addComponent(img, MakeFullscreen);
		this.snuffelEntity = this.add.sprite(300,800, "Snuffel").setFlipX(true);
		this.anims.create({
			key: "Snuffel",
			frameRate: 2,
			frames: this.anims.generateFrameNumbers(
				"Snuffel",
				{
					start: 0,
					end: 1,
				}
			),
			repeat: -1,
		});
		this.snuffelEntity.play("Snuffel");

		const returnButton = this.add.image(1750, 100, this.returnButton);
		returnButton
			.setScale(0.3)
			.setDepth(2)
			.setInteractive({useHandCursor: true})
			.on("pointerover", () => {
				returnButton.setScale(0.35);
			})
			.on("pointerout", () => {
				returnButton.setScale(0.3);
			})
			.on("pointerdown", () => {
				this.scene.start("start-scene");
				this.scene.stop("credits");
			});
		this.createSituation();
	}

	private createSituation(): void {
		const creditsImage = this.add.image(950, 2500, this.creditsImage).setDepth(1).setScale(.7);
		const creditsMove = this.components.addComponent(
			creditsImage,
			MoveTo
		);
		creditsMove.setTarget({
			x: 950,
			y: -1700
		});
		creditsMove.velocity = 100;
		creditsMove.movingDone = () => {
			this.scene.stop("credits");
			this.scene.start("start-scene");
		}
	}
}
