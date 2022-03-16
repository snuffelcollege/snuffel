import BackgroundImage from "@assets/images/scenario_5/BG.png";
import CorrectAnswerImage from "@assets/images/scenario_5/option_1.png";
import IncorrectAnswerImage from "@assets/images/scenario_5/option_2.png";
import IncorrectAnswerImage2 from "@assets/images/scenario_5/option_3.png";
import CharacterRunSheet from "@assets/spritesheets/player/scenario/run/character_run_.png";
import CharacterWalkSheet from "@assets/spritesheets/player/scenario/walk/character_walk.png";
import CharacterWalkData from "@assets/spritesheets/player/scenario/walk/character_walk.json";
import CharacterIdleSheet from "@assets/spritesheets/player/scenario/idle/character_idle.png";
import CharacterIdleData from "@assets/spritesheets/player/scenario/idle/character_idle.json";
import shepherdSheet from "@assets/spritesheets/scenario_5/dog.png";
import shepherdData from "@assets/spritesheets/scenario_5/dog.json";
import PokingSheet from "@assets/spritesheets/scenario_5/boystick.png";
import PokingData from "@assets/spritesheets/scenario_5/boystick.json";
import BarkingSheet from "@assets/spritesheets/scenario_5/boybark.png";
import BarkingData from "@assets/spritesheets/scenario_5/boybark.json";
import shepherdImage from "@assets/images/scenario_5/dog1.png";
import stickImage from "@assets/images/scenario_5/stick.png";
import { GameObjects, Scene } from "phaser";
import SceneLifecycle from "../SceneLifecycle";
import { addFadeIn, fadeToBlack } from "../Utilities/Scene/Fader";
import ComponentService from "../Services/ComponentService";
import MakeFullscreen from "../Components/MakeFullscreen";
import { WorldSceneConfig } from "./WorldScene";
import MoveTo from "../Components/MoveTo";
import SettingsConfig = Phaser.Types.Scenes.SettingsConfig;
import Sprite = Phaser.GameObjects.Sprite;
import sceneSong from "@assets/audio/scene.mp3";

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

	private characterRun!: string;

	private exitSceneKey!: string;

	private characterWalk!: string;

	private characterIdle!: string;

	private shepherdImage!: string;

	private shepherdSheet!: string;

	private barkingSheet!: string;

	private shepherdEntity!: Sprite;

	private stickImage!: string;

	private stickEntity!: Sprite;

	private pokingSheet!: string;

	private dogWalkAnims!: Phaser.Animations.Animation[];

	private characterWalkAnims!: Phaser.Animations.Animation[];

	constructor(cfg: SettingsConfig = config) {
		super(cfg);
	}

	public init(): void {
		this.imageIncorrectAnswer1 = "scene1IncorrectAnswer15";
		this.imageIncorrectAnswer2 = "scene1IncorrectAnswer25";
		this.imageCorrectAnswer = "scene1CorrectAnswer5";
		this.shepherdImage = "shepherdImage";
		this.shepherdSheet = "shepherdSheet";
		this.barkingSheet = "barkingSheet";
		this.stickImage = "stickImage";
		this.pokingSheet = "pokingSheet";
		this.characterRun = "CharacterRun5";
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
			this.characterRun,
			CharacterRunSheet,
			CharacterRunData
		);
		this.load.aseprite(
			this.pokingSheet,
			PokingSheet,
			PokingData
		);
		this.load.aseprite(
			this.barkingSheet,
			BarkingSheet,
			BarkingData
		)

		this.load.audio("sceneSong", sceneSong);
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
		this.game.sound.pauseAll();
		var song = this.sound.add("sceneSong");
		song.play({
			loop: true
		});
		
		// Add child.
		this.anims.create({
			key: this.characterIdle,
			frameRate: 2,
			frames: this.anims.generateFrameNumbers(
				this.characterIdle,
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
			this.characterIdle
		);
		this.characterEntity
			.play(this.characterIdle)
			.setScale(1);
		
		this.shepherdEntity = this.add.sprite(
			1000,
			350,
			this.shepherdSheet
		);

		this.stickEntity = this.add.sprite(1100, 940, this.stickImage)

		this.createChoice();
	}

	private createChoice(): void {
		const button1 = this.add.image(500, 940, this.imageCorrectAnswer);
		const button2 = this.add.image(1000, 940, this.imageIncorrectAnswer1);
		const button3 = this.add.image(1500, 940, this.imageIncorrectAnswer2);

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
			key: this.pokingSheet,
			frameRate: 8,
			frames: this.anims.generateFrameNumbers(this.pokingSheet, {
				start: 0,
				end: 7,
			}),
			repeat: -1,
		});

		this.stickEntity.destroy();
		this.characterEntity.play(this.pokingSheet).setScale(1);

		setTimeout(() => {
			this.characterEntity.stop();
			this.anims.create({
				key: this.characterRun,
				frameRate: 8,
				frames: this.anims.generateFrameNumbers(this.characterRun, {
					start: 0,
					end: 7,
				}),
				repeat: -1,
			});

			this.cameras.main.flash(2000, 200, 0, 0);
			this.shepherdEntity.play(this.shepherdSheet);
			this.characterEntity.play(this.characterRun).setScale(2);

			const moveTo = this.components.addComponent(this.characterEntity, MoveTo);

			moveTo.setTarget({
				x: this.characterEntity.x + 1000,
				y: this.characterEntity.y,
			});

			moveTo.velocity = 250;

			setTimeout(() => {
					this.moveScene();
			}, 3000);
		}, 2000);

		
	}

	private createResult2(): void {
		this.anims.create({
			key: this.characterWalk,
			frameRate: 8,
			frames: this.anims.generateFrameNumbers(this.characterWalk, {
				start: 0,
				end: 7,
			}),
			repeat: -1,
		});

		this.characterEntity.setScale(1).play(this.characterWalk);

		const moveToCharacter = this.components.addComponent(
			this.characterEntity,
			MoveTo
		);

		moveToCharacter.setTarget({
			x: this.characterEntity.x + 1000,
			y: this.characterEntity.y,
		});

		moveToCharacter.velocity = 250;

		this.cameras.main.flash(2000, 0, 200, 0);

		setTimeout(() => {
			this.moveScene();
		}, 5000);
	}

	private createResult3(): void {
		this.anims.create({
			key: this.barkingSheet,
			frameRate: 2,
			frames: this.anims.generateFrameNumbers(this.barkingSheet, {
				start: 0,
				end: 1,
			}),
			repeat: -1,
		});
		
		this.characterEntity.play(this.barkingSheet).setScale(1).toggleFlipX();

		this.anims.create({
			key: this.shepherdSheet,
			frameRate: 2,
			frames: this.anims.generateFrameNumbers(this.shepherdSheet, {
				start: 1,
				end: 0,
			}),
			repeat: -1,
		});

		this.shepherdEntity.play(this.shepherdSheet).setScale(1);

		this.cameras.main.flash(2000, 200, 0, 0);

		setTimeout(() => {
			this.moveScene();
		}, 5000);
	}

	private moveScene() {
		fadeToBlack(this, () => {
			this.scene.stop(this.scene.key).wake(this.exitSceneKey);
		});
		this.game.sound.removeByKey("sceneSong");
		this.game.sound.resumeAll();
	}
}
