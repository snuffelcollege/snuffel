import BackgroundImage from "@assets/images/scenario_4/Scene4_BG.png";
import Car from "@assets/images/scenario_4/Scene4_car.png";
import CorrectAnswerImage from "@assets/images/scenario_1/scenario_option_1.png";
import IncorrectAnswerImage from "@assets/images/scenario_1/scenario_option_2.png";
import IncorrectAnswerImage2 from "@assets/images/scenario_1/scenario_option_3.png";
import PlayerCharacterSheet from "@assets/spritesheets/player/scenario/icecreamidle/icecream_idle.png";
import CharacterRunSheet from "@assets/spritesheets/player/scenario/run/character_run_.png";
import CharacterWalkSheet from "@assets/spritesheets/player/scenario/walk/character_walk.png";
import CharacterWalkData from "@assets/spritesheets/player/scenario/walk/character_walk.json";
import CharacterIdleSheet from "@assets/spritesheets/player/scenario/idle/character_idle.png";
import CharacterIdleData from "@assets/spritesheets/player/scenario/idle/character_idle.json";
import DogJson from "@assets/spritesheets/Scene4_Dog/Scene4_Dog.json";
import DogSheet from "@assets/spritesheets/Scene4_Dog/Scene4_Dog.png";
import { GameObjects, Scene } from "phaser";
import SceneLifecycle from "../SceneLifecycle";
import { addFadeIn, fadeToBlack } from "../Utilities/Scene/Fader";
import ComponentService from "../Services/ComponentService";
import MakeFullscreen from "../Components/MakeFullscreen";
import { WorldSceneConfig } from "./WorldScene";
import MoveTo from "../Components/MoveTo";
import SettingsConfig = Phaser.Types.Scenes.SettingsConfig;
import Sprite = Phaser.GameObjects.Sprite;

// Config for the scene defining gravity and debug settings.
export const config: SettingsConfig = {
	active: false,
	key: "scene-4",
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

// Frame size for a character who is running.
export const CharacterRunData = {
	frameHeight: 256,
	frameWidth: 256,
};

export default class Scene1 extends Scene implements SceneLifecycle {
	private components!: ComponentService;

	private characterEntity!: Sprite;

	private DogEntity!: Sprite;

	private dog!: string;

	private car!: string;

	private imageIncorrectAnswer1!: string;

	private imageIncorrectAnswer2!: string;

	private imageCorrectAnswer!: string;

	private spriteSheetPlayerCharacter!: string;

	private spriteSheetDog!: string;

	private characterRun!: string;

	private backgroundImage!: string;

	private exitSceneKey!: string;

	private characterWalk!: string;

	private characterIdle!: string;

	private dogWalkAnims!: Phaser.Animations.Animation[];

	private characterWalkAnims!: Phaser.Animations.Animation[];

	constructor(cfg: SettingsConfig = config) {
		super(cfg);
	}

	public init(): void {
		this.dog = "dog";
		this.car = "car"
		this.imageIncorrectAnswer1 = "scene1IncorrectAnswer1";
		this.imageIncorrectAnswer2 = "scene1IncorrectAnswer2";
		this.imageCorrectAnswer = "scene1CorrectAnswer";
		this.spriteSheetPlayerCharacter = "spriteSheetPlayerCharacter";
		this.spriteSheetDog = "spriteSheetDog"
		this.characterRun = "spriteSheetPlayerCharacterRun";
		this.backgroundImage = "backgroundImage";
		this.characterWalk = "characterWalk";
		this.characterIdle = "characterIdle";

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
		this.load.image(this.backgroundImage, BackgroundImage);
		this.load.image(this.car, Car);
		this.load.image(this.imageCorrectAnswer, CorrectAnswerImage);
		this.load.image(this.imageIncorrectAnswer1, IncorrectAnswerImage);
		this.load.image(this.imageIncorrectAnswer2, IncorrectAnswerImage2);
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

		this.load.aseprite(this.dog, DogSheet, DogJson);
	}

	public create(): void {
		const centerX = this.scale.displaySize.width * 0.5;
		const centerY = this.scale.displaySize.height * 0.5;

		const img = this.add.image(centerX, centerY, this.backgroundImage);
		const car = this.add.image(500, 700, this.car,);
		car.setScale(0.9)
		this.components.addComponent(img, MakeFullscreen);

		// todo; make into a component
		this.dogWalkAnims.push(...this.anims.createFromAseprite(this.dog));
		this.characterWalkAnims.push(
			...this.anims.createFromAseprite(this.characterWalk)
		);

		this.createSituation();
	}

	public update(time: number, delta: number): void {
		super.update(time, delta);
	}

	private createSituation(): void {
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
		this.anims.create({
			key: this.dogWalkAnims[0].key,
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
			700,
			this.characterIdle
		);
		this.characterEntity
			.play(this.characterIdle)
			.setScale(.8);

		this.DogEntity = this.add.sprite(750,490,
			this.dog
		);
		this.DogEntity
			.setScale(0.7)
			// .setVelocityX(150)
			//.play({ key: this.dogWalkAnims[0].key, repeat: -1 });

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
			key: this.characterIdle,
			frameRate: 2,
			frames: this.anims.generateFrameNumbers(this.characterIdle, {
				start: 0,
				end: 1,
			}),
			repeat: -1,
		});

		this.characterEntity.setScale(0.74).play(this.characterIdle);

		this.cameras.main.flash(2000, 200, 0, 0);

		setTimeout(() => {
			this.moveScene();
		}, 5000);
	}

	private createResult2(): void {
		this.anims.create({
			key: this.characterIdle,
			frameRate: 2,
			frames: this.anims.generateFrameNumbers(this.characterIdle, {
				start: 0,
				end: 1,
			}),
			repeat: -1,
		});

		this.characterEntity.setScale(0.74).play(this.characterIdle);

		this.cameras.main.flash(2000, 200, 0, 0);

		setTimeout(() => {
			this.moveScene();
		}, 5000);
	}

	private createResult3(): void {
		this.characterEntity
			.play({ key: this.characterWalkAnims[0].key, repeat: -1 })
			.setScale(0.8);

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
