import BackgroundImage from "@assets/images/scenario_5/Scenario5_BG.png";
import CorrectAnswerImage from "@assets/images/scenario_1/scenario_option_1.png";
import IncorrectAnswerImage from "@assets/images/scenario_1/scenario_option_2.png";
import IncorrectAnswerImage2 from "@assets/images/scenario_1/scenario_option_3.png";
import PlayerCharacterSheet from "@assets/spritesheets/player/scenario/icecreamidle/icecream_idle.png";
import CharacterRunSheet from "@assets/spritesheets/player/scenario/run/character_run_.png";
import CharacterWalkSheet from "@assets/spritesheets/player/scenario/walk/character_walk.png";
import CharacterWalkData from "@assets/spritesheets/player/scenario/walk/character_walk.json";
import CharacterIdleSheet from "@assets/spritesheets/player/scenario/idle/character_idle.png";
import CharacterIdleData from "@assets/spritesheets/player/scenario/idle/character_idle.json";
import shepherdSheet from "@assets/spritesheets/scenario5_dog/scenario5_dog.png";
import shepherdData from "@assets/spritesheets/scenario5_dog/scenario5_dog.json";
import shepherdImage from "@assets/images/scenario_5/scenario5_dog1.png";
import stickImage from "@assets/images/scenario_5/scenario5_stick.png";
import { GameObjects, Scene } from "phaser";
import SceneLifecycle from "../SceneLifecycle";
import { addFadeIn, fadeToBlack } from "../Utilities/Scene/Fader";
import ComponentService from "../Services/ComponentService";
import MakeFullscreen from "../Components/MakeFullscreen";
import { WorldSceneConfig } from "./WorldScene";
import MoveTo from "../Components/MoveTo";
import SettingsConfig = Phaser.Types.Scenes.SettingsConfig;
import Sprite = Phaser.GameObjects.Sprite;
import FixedHeightAnimator from "../Components/FixedHeightAnimator";

// Config for the scene defining gravity and debug settings.
export const config: SettingsConfig = {
	active: false,
	key: "scene-5",
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

	private characterEntity!: Sprite;

	private husky!: string;

	private imageIncorrectAnswer1!: string;

	private imageIncorrectAnswer2!: string;

	private imageCorrectAnswer!: string;

	private spriteSheetPlayerCharacter!: string;

	private characterRun!: string;

	private exitSceneKey!: string;

	private characterWalk!: string;

	private characterIdle!: string;

	private shepherdImage!: string

	private shepherdSheet!: string

	private shepherdEntity!: Sprite

	private stickImage!: string

	private dogWalkAnims!: Phaser.Animations.Animation[];

	private characterWalkAnims!: Phaser.Animations.Animation[];

	constructor(cfg: SettingsConfig = config) {
		super(cfg);
	}

	public init(): void {
		this.imageIncorrectAnswer1 = "scene1IncorrectAnswer1";
		this.imageIncorrectAnswer2 = "scene1IncorrectAnswer2";
		this.imageCorrectAnswer = "scene1CorrectAnswer";
		this.shepherdImage = "shepherdImage";
		this.shepherdSheet = "shepherdSheet";
		this.stickImage = "stickImage";
		this.spriteSheetPlayerCharacter = "spriteSheetPlayerCharacter5";
		this.characterRun = "spriteSheetPlayerCharacterRun5";
		this.characterWalk = "characterWalk5";
		this.characterIdle = "characterIdle5";

		if (!WorldSceneConfig.key) {
			throw Error("Exit scene key is undefined");
		}

		this.exitSceneKey = WorldSceneConfig.key;

		this.components = new ComponentService();

		this.characterWalkAnims = [];
		this.dogWalkAnims = [];

		// The moment the scene renders, a fade from black is started using this function.
		addFadeIn(this);
	}

	// A key has to be unique for the entire project, not just this scene.
	public preload(): void {
		this.load.image("background5", BackgroundImage);
		this.load.image(this.shepherdImage, shepherdImage);
		this.load.image(this.stickImage, stickImage);
		this.load.image(this.imageCorrectAnswer, CorrectAnswerImage);
		this.load.image(this.imageIncorrectAnswer1, IncorrectAnswerImage);
		this.load.image(this.imageIncorrectAnswer2, IncorrectAnswerImage2);
		this.load.aseprite(
			this.characterWalk,
			CharacterWalkSheet,
			CharacterWalkData
		);
		this.load.aseprite(
			this.characterIdle,
			CharacterIdleSheet,
			CharacterIdleData
		);
		this.load.aseprite(
			this.shepherdSheet,
			shepherdSheet,
			shepherdData
		);
		this.load.spritesheet(
			this.spriteSheetPlayerCharacter,
			PlayerCharacterSheet,
			CharacterRunData
		);
		this.load.spritesheet(
			this.characterRun,
			CharacterRunSheet,
			CharacterRunData
		);
	}

	public create(): void {
		const centerX = this.scale.displaySize.width * 0.5;
		const centerY = this.scale.displaySize.height * 0.5;

		const img = this.add.image(centerX, centerY, "background5");

		this.components.addComponent(img, MakeFullscreen);

		// todo; make into a component
		this.dogWalkAnims.push(...this.anims.createFromAseprite(this.husky));
		this.characterWalkAnims.push(
			...this.anims.createFromAseprite(this.characterWalk)
		);

		this.createSituation();
	}

	private createSituation(): void {
		// Add child.
		this.anims.create({
			key: this.spriteSheetPlayerCharacter,
			frameRate: 2,
			frames: this.anims.generateFrameNumbers(
				this.spriteSheetPlayerCharacter,
				{
					start: 0,
					end: 1,
				}
			),
			repeat: -1,
		});

		this.characterEntity = this.add.sprite(
			1100,
			720,
			this.spriteSheetPlayerCharacter
		);
		this.characterEntity
			.play(this.spriteSheetPlayerCharacter)
			.setScale(1.8);
		
		this.shepherdEntity = this.add.sprite(
			1000,
			350,
			this.shepherdSheet
		);

		this.add.image(1100, 900, this.stickImage)

		this.createChoice();
	}

	private createChoice(): void {
		const button1 = this.add.image(500, 900, this.imageCorrectAnswer);
		const button2 = this.add.image(900, 900, this.imageIncorrectAnswer1);
		const button3 = this.add.image(1300, 900, this.imageIncorrectAnswer2);

		button1
			.setInteractive({ useHandCursor: true, pixelPerfect: true })
			.on("pointerdown", () => {
				button1.disableInteractive();
				button2.disableInteractive();
				button3.disableInteractive();

				this.createResult1();
			});
		button2
			.setInteractive({ useHandCursor: true, pixelPerfect: true })
			.on("pointerdown", () => {
				button1.disableInteractive();
				button2.disableInteractive();
				button3.disableInteractive();

				this.createResult2();
			});
		button3
			.setInteractive({ useHandCursor: true, pixelPerfect: true })
			.on("pointerdown", () => {
				button1.disableInteractive();
				button2.disableInteractive();
				button3.disableInteractive();

				this.createResult3();
			});
	}

	private createResult1(): void {
		this.anims.create({
			key: this.shepherdSheet,
			frameRate: 2,
			frames: this.anims.generateFrameNumbers(this.shepherdSheet, {
				start: 0,
				end: 1,
			}),
			repeat: -1,
		});

		this.anims.create({
			key: this.characterRun,
			frameRate: 8,
			frames: this.anims.generateFrameNumbers(this.characterRun, {
				start: 0,
				end: 7,
			}),
			repeat: -1,
		});

		this.shepherdEntity.setScale(1).play(this.shepherdSheet);

		this.characterEntity.play(this.characterRun);

		const moveTo = this.components.addComponent(this.characterEntity, MoveTo);

		moveTo.setTarget({
			x: this.characterEntity.x + 1000,
			y: this.characterEntity.y,
		});

		moveTo.velocity = 250;

		this.cameras.main.flash(2000, 200, 0, 0);

		setTimeout(() => {
			this.moveScene();
		}, 5000);
	}

	private createResult2(): void {

		this.anims.create({
			key: this.shepherdSheet,
			frameRate: 2,
			frames: this.anims.generateFrameNumbers(this.shepherdSheet, {
				start: 0,
				end: 1,
			}),
			repeat: -1,
		});

		this.shepherdEntity.setScale(1).play(this.shepherdSheet);

		this.anims.create({
			key: this.characterRun,
			frameRate: 8,
			frames: this.anims.generateFrameNumbers(this.characterRun, {
				start: 0,
				end: 7,
			}),
			repeat: -1,
		});

		this.characterEntity.play(this.characterRun);

		const moveToCharacter = this.components.addComponent(
			this.characterEntity,
			MoveTo
		);

		moveToCharacter.setTarget({
			x: this.characterEntity.x + 1000,
			y: this.characterEntity.y,
		});

		moveToCharacter.velocity = 250;

		this.cameras.main.flash(2000, 200, 0, 0);

		setTimeout(() => {
			this.moveScene();
		}, 5000);
	}

	private createResult3(): void {
		this.characterEntity
			.play({ key: this.characterWalkAnims[0].key, repeat: -1 })
			.setScale(0.7);

		const moveToCharacter = this.components.addComponent(
			this.characterEntity,
			MoveTo
		);

		moveToCharacter.setTarget({
			x: this.characterEntity.x + 1000,
			y: this.characterEntity.y,
		});

		moveToCharacter.velocity = 200;

		this.cameras.main.flash(2000, 0, 200, 0);

		setTimeout(() => {
			this.moveScene();
		}, 5000);
	}

	private moveScene() {
		fadeToBlack(this, () => {
			this.scene.stop(this.scene.key).wake(this.exitSceneKey);
		});
	}
}
