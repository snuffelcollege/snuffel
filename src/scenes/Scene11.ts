import BackgroundImage from "@assets/images/scenario_11/BG.png";
import Dog from "@assets/spritesheets/scenario_11/dog.png";
import DogData from "@assets/spritesheets/scenario_11/dog.json";
import DogAndBoy from "@assets/spritesheets/scenario_11/boy+dog.png";
import DogAndBoyData from "@assets/spritesheets/scenario_11/boy+dog.json";
import ContinueHug from "@assets/spritesheets/scenario_11/boy+dogheadtilt.png";
import ContinueHugData from "@assets/spritesheets/scenario_11/boy+dogheadtilt.json";
import PetDog from "@assets/spritesheets/scenario_11/boy+dogpet.png";
import PetDogData from "@assets/spritesheets/scenario_11/boy+dogpet.json";
import CorrectAnswerImage from "@assets/images/scenario_11/option_1.png";
import IncorrectAnswerImage from "@assets/images/scenario_11/option_2.png";
import IncorrectAnswerImage2 from "@assets/images/scenario_11/option_3.png";
import CharacterRunSheet from "@assets/spritesheets/player/scenario/run/character_run_.png";
import CharacterWalkSheet from "@assets/spritesheets/player/scenario/walk/character_walk.png";
import CharacterWalkData from "@assets/spritesheets/player/scenario/walk/character_walk.json";
import CharacterIdleSheet from "@assets/spritesheets/player/scenario/idle/character_idle.png";
import CharacterIdleData from "@assets/spritesheets/player/scenario/idle/character_idle.json";
import { GameObjects, Scene, Time } from "phaser";
import SceneLifecycle from "../SceneLifecycle";
import { addFadeIn, fadeToBlack } from "../Utilities/Scene/Fader";
import ComponentService from "../Services/ComponentService";
import MakeFullscreen from "../Components/MakeFullscreen";
import { WorldSceneConfig } from "./WorldScene";
import MoveTo from "../Components/MoveTo";
import SettingsConfig = Phaser.Types.Scenes.SettingsConfig;
import Sprite = Phaser.GameObjects.Sprite;
import SceneSong from "@assets/audio/scene.mp3";

// Config for the scene defining gravity and debug settings.
export const config: SettingsConfig = {
	active: false,
	key: "scene-11",
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

	private dogEntity!: Sprite;

	private dogAndBoyEntity!: Sprite;

	private imageIncorrectAnswer1!: string;

	private imageIncorrectAnswer2!: string;

	private imageCorrectAnswer!: string;

	private characterRun!: string;

	private exitSceneKey!: string;

	private characterWalk!: string;

	private characterIdle!: string;

	private dog!: string;

	private dogAndBoy!: string

	private continueHug!: string

	private petDog!: string

	private characterWalkAnims!: Phaser.Animations.Animation[];

	constructor(cfg: SettingsConfig = config) {
		super(cfg);
	}

	public init(): void {
		this.imageIncorrectAnswer1 = "scene1IncorrectAnswer16";
		this.imageIncorrectAnswer2 = "scene1IncorrectAnswer26";
		this.imageCorrectAnswer = "scene1CorrectAnswer6";
		this.characterRun = "spriteSheetPlayerCharacterRun6";
		this.characterWalk = "characterWalk6";
		this.characterIdle = "characterIdle6";
		this.dog = "dog6";
		this.dogAndBoy = "dogAndBoy6";
		this.continueHug = "continueHug6";
		this.petDog = "petDog6";
		

		if (!WorldSceneConfig.key) {
			throw Error("Exit scene key is undefined");
		}

		this.exitSceneKey = WorldSceneConfig.key;

		this.components = new ComponentService();

		this.characterWalkAnims = [];

		// The moment the scene renders, a fade from black is started using this function.
		addFadeIn(this);
	}

	// A key has to be unique for the entire project, not just this scene.
	public preload(): void {
		this.load.image("background6", BackgroundImage);
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
		this.load.spritesheet(
			this.characterRun,
			CharacterRunSheet,
			CharacterRunData
		);
		this.load.aseprite(
			this.dog,
			Dog,
			DogData
		);
		this.load.aseprite(
			this.dogAndBoy,
			DogAndBoy,
			DogAndBoyData
		);
		this.load.aseprite(
			this.continueHug,
			ContinueHug,
			ContinueHugData
		);
		this.load.aseprite(
			this.petDog,
			PetDog,
			PetDogData
		);

		this.load.audio("sceneSong", SceneSong);
	}

	public create(): void {
		const centerX = this.scale.displaySize.width * 0.5;
		const centerY = this.scale.displaySize.height * 0.5;

		const img = this.add.image(centerX, centerY, "background6");

		this.components.addComponent(img, MakeFullscreen);

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
			100,
			720,
			this.characterIdle
		);
		this.characterEntity
			.play({ key: this.characterWalkAnims[0].key, repeat: -1 })
			.setScale(1);

		const moveToCharacter = this.components.addComponent(
			this.characterEntity,
			MoveTo
		);

		moveToCharacter.setTarget({
			x: this.characterEntity.x + 680,
			y: this.characterEntity.y,
		});

		moveToCharacter.velocity = 200;


		this.anims.create({
			key: this.dog,
			frameRate: 2,
			frames: this.anims.generateFrameNumbers(
				this.dog,
				{
					start: 0,
					end: 2,
				}
			),
			repeat: -1,
		});
		this.dogEntity = this.add.sprite(
			1100,
			720,
			this.dog
		);
		this.dogEntity
			.play(this.dog)
			.setScale(1);		


		setTimeout(() => {
			this.cameras.main.flash(2000, 0, 0, 0);
			this.characterEntity.setVisible(false);
			this.dogEntity.setVisible(false);
			this.anims.create({
				key: this.dogAndBoy,
				frameRate: 2,
				frames: this.anims.generateFrameNumbers(
					this.dogAndBoy,
					{
						start: 0,
						end: 2,
					}
				),
				repeat: -1,
			});
			this.dogAndBoyEntity = this.add.sprite(
				1100,
				720,
				this.dogAndBoy
			);
			this.dogAndBoyEntity
				.play(this.dogAndBoy);

			this.createChoice();
		}, 3500);		
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
		this.dogAndBoyEntity.destroy();
		this.anims.create({
			key: this.characterWalk,
			frameRate: 2,
			frames: this.anims.generateFrameNumbers(this.characterWalk, {
				start: 0,
				end: 1,
			}),
			repeat: -1,
		});

		this.anims.create({
			key: this.dog,
			frameRate: 8,
			frames: this.anims.generateFrameNumbers(this.dog, {
				start: 0,
				end: 7,
			}),
			repeat: -1,
		});

		this.cameras.main.flash(2000, 0, 200, 0);
		this.characterEntity.setVisible(true).play(this.characterWalk).toggleFlipX();
		this.dogEntity.setVisible(true).play(this.dog);

		const moveTo = this.components.addComponent(this.characterEntity, MoveTo);

		moveTo.setTarget({
			x: this.characterEntity.x - 1000,
			y: this.characterEntity.y,
		});

		moveTo.velocity = 250;

		setTimeout(() => {
			this.moveScene();
		}, 5000);
	}

	private createResult2(): void {
		this.anims.create({
			key: this.continueHug,
			frameRate: 2,
			frames: this.anims.generateFrameNumbers(this.continueHug, {
				start: 0,
				end: 1,
			}),
			repeat: -1,
		});

		this.dogAndBoyEntity.setScale(1).play(this.continueHug);

		this.cameras.main.flash(2000, 200, 0, 0);

		setTimeout(() => {
			this.moveScene();
		}, 5000);
	}

	private createResult3(): void {
		this.anims.create({
			key: this.petDog,
			frameRate: 2,
			frames: this.anims.generateFrameNumbers(this.petDog, {
				start: 0,
				end: 1,
			}),
			repeat: -1,
		});

		this.dogAndBoyEntity.play(this.petDog);
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