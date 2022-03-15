import BackgroundImage from "@assets/background.png";
import CorrectAnswerImage from "@assets/images/scenario_1/scenario_option_1.png";
import IncorrectAnswerImage from "@assets/images/scenario_1/scenario_option_2.png";
import IncorrectAnswerImage2 from "@assets/images/scenario_1/scenario_option_3.png";
import PlayerCharacterSheet from "@assets/spritesheets/player/scenario/icecreamidle/icecream_idle.png";
import CharacterRunSheet from "@assets/spritesheets/player/scenario/run/character_run.png";
import CharacterRunData from "@assets/spritesheets/player/scenario/run/character_run.json";
import CharacterWalkSheet from "@assets/spritesheets/player/scenario/walk/character_walk.png";
import CharacterWalkData from "@assets/spritesheets/player/scenario/walk/character_walk.json";
import CharacterIdleSheet from "@assets/spritesheets/player/scenario/idle/character_idle.png";
import CharacterIdleData from "@assets/spritesheets/player/scenario/idle/character_idle.json";
import IceCreamConeImage from "@assets/images/scenario_1/icecream_cone.png";
import FallenIceCreamConeImage from "@assets/images/scenario_1/Fallenicecream.png";
import HuskyJson from "@assets/spritesheets/husky/husky.json";
import HuskySheet from "@assets/spritesheets/husky/husky.png";
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
	key: "scene-1",
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
export const IceCreamIdleData = {
	frameHeight: 256,
	frameWidth: 256,
};
export default class Scene1 extends Scene implements SceneLifecycle {
	private components!: ComponentService;

	private characterEntity!: Sprite;

	private huskyEntity!: Sprite;

	private husky!: string;

	private imageIncorrectAnswer1!: string;

	private imageIncorrectAnswer2!: string;

	private imageCorrectAnswer!: string;

	private imageIceCreamCone!: string;

	private fallenIceCreamConeImage!: string;

	private spriteSheetPlayerCharacter!: string;

	private characterRun!: string;

	private exitSceneKey!: string;

	private characterWalk!: string;

	private characterIdle!: string;

	private moveIcecreamConeAway!: boolean;

	private icecreamCone!: GameObjects.Image;

	private dogWalkAnims!: Phaser.Animations.Animation[];

	private characterWalkAnims!: Phaser.Animations.Animation[];

	constructor(cfg: SettingsConfig = config) {
		super(cfg);
	}

	public init(): void {
		this.husky = "husky";
		this.imageIncorrectAnswer1 = "scene1IncorrectAnswer1";
		this.imageIncorrectAnswer2 = "scene1IncorrectAnswer2";
		this.imageCorrectAnswer = "scene1CorrectAnswer";
		this.imageIceCreamCone = "imageIceCreamCone";
		this.fallenIceCreamConeImage = "fallenIceCreamCone"
		this.spriteSheetPlayerCharacter = "spriteSheetPlayerCharacter1";
		this.characterRun = "spriteSheetPlayerCharacterRun1";
		this.characterWalk = "characterWalk1";
		this.characterIdle = "characterIdle1";

		if (!WorldSceneConfig.key) {
			throw Error("Exit scene key is undefined");
		}

		this.exitSceneKey = WorldSceneConfig.key;

		this.components = new ComponentService();

		this.characterWalkAnims = [];
		this.dogWalkAnims = [];

		this.moveIcecreamConeAway = false;

		// The moment the scene renders, a fade from black is started using this function.
		addFadeIn(this);
	}

	// A key has to be unique for the entire project, not just this scene.
	public preload(): void {
		this.load.image("background1", BackgroundImage);
		this.load.image(this.imageCorrectAnswer, CorrectAnswerImage);
		this.load.image(this.imageIncorrectAnswer1, IncorrectAnswerImage);
		this.load.image(this.imageIncorrectAnswer2, IncorrectAnswerImage2);
		this.load.image(this.imageIceCreamCone, IceCreamConeImage);
		this.load.image(this.fallenIceCreamConeImage, FallenIceCreamConeImage);
		this.load.spritesheet(
			this.spriteSheetPlayerCharacter,
			PlayerCharacterSheet,
			IceCreamIdleData
		);
		this.load.aseprite(
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

		this.load.aseprite(this.husky, HuskySheet, HuskyJson);
	}

	public create(): void {
		const centerX = this.scale.displaySize.width * 0.5;
		const centerY = this.scale.displaySize.height * 0.5;

		const img = this.add.image(centerX, centerY, "background1");

		this.components.addComponent(img, MakeFullscreen);

		// todo; make into a component
		this.dogWalkAnims.push(...this.anims.createFromAseprite(this.husky));
		this.characterWalkAnims.push(
			...this.anims.createFromAseprite(this.characterWalk)
		);

		this.createSituation();
	}

	public update(time: number, delta: number): void {
		super.update(time, delta);

		if (this.moveIcecreamConeAway){	
			this.icecreamCone
				.setRotation(this.icecreamCone.rotation - 0.075)
				.setPosition(this.icecreamCone.x - 0.8, this.icecreamCone.y + 4);
			setTimeout(() => {
				this.moveIcecreamConeAway = false;
				this.icecreamCone.destroy();
				this.add.image(1100, 900, this.fallenIceCreamConeImage).setScale(0.8);
			}, 750);
		}
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
			700,
			this.spriteSheetPlayerCharacter
		);
		
		this.characterEntity
			.play(this.spriteSheetPlayerCharacter)
			.setScale(1.5);

		this.huskyEntity = this.add.sprite(
			0,
			this.characterEntity.y + 40,
			this.husky
		);
		this.huskyEntity
			.setScale(0.6)
			.play({ key: this.dogWalkAnims[0].key, repeat: -1 });

		const moveTo = this.components.addComponent(this.huskyEntity, MoveTo);

		moveTo.setTarget({
			x: this.characterEntity.x - 300,
			y: this.huskyEntity.y,
		});

		moveTo.velocity = 200;

		moveTo.movingDone = () => {
			this.huskyEntity.play({
				key: this.dogWalkAnims[1].key,
				repeat: -1,
			});

			this.createChoice();
		};
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
				this.icecreamCone = this.add
				.image(1105, 710, this.imageIceCreamCone)
				.setScale(0.65, 0.55)
				.setDepth(100);
				this.createResult1();
			});
		button2
			.setInteractive({ useHandCursor: true, pixelPerfect: true })
			.on("pointerdown", () => {
				button1.disableInteractive();
				button2.disableInteractive();
				button3.disableInteractive();
				this.icecreamCone = this.add
				.image(1105, 710, this.imageIceCreamCone)
				.setScale(0.65, 0.55)
				.setDepth(100);
				this.createResult2();
			});
		button3
			.setInteractive({ useHandCursor: true, pixelPerfect: true })
			.on("pointerdown", () => {
				button1.disableInteractive();
				button2.disableInteractive();
				button3.disableInteractive();
				this.icecreamCone = this.add
				.image(1105, 710, this.imageIceCreamCone)
				.setScale(0.65, 0.55)
				.setDepth(100);
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

		this.huskyEntity.setFlipX(true).play({ key: "husky_walk", repeat: -1 });

		const moveTo = this.components.addComponent(this.huskyEntity, MoveTo);

		moveTo.setTarget({
			x: this.huskyEntity.x - 1200,
			y: this.huskyEntity.y,
		});

		moveTo.velocity = 100;

		this.cameras.main.flash(2000, 0, 200, 0);

		this.moveIcecreamConeAway = true;

		setTimeout(() => {
			this.moveScene();
		}, 5000);
	}

	private createResult2(): void {
		this.huskyEntity.play({ key: "husky_walk", repeat: -1 });

		const moveToHusky = this.components.addComponent(
			this.huskyEntity,
			MoveTo
		);

		moveToHusky.setTarget({
			x: this.huskyEntity.x + 1300,
			y: this.huskyEntity.y,
		});

		moveToHusky.velocity = 280;

		this.anims.create({
			key: this.characterRun,
			frameRate: 8,
			frames: this.anims.generateFrameNumbers(this.characterRun, {
				start: 0,
				end: 7,
			}),
			repeat: -1,
		});
		this.characterEntity.setScale(0.7);
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

		this.moveIcecreamConeAway = true;

		setTimeout(() => {
			this.moveScene();
		}, 5000);
	}

	private createResult3(): void {
		this.huskyEntity.play({ key: "husky_walk", repeat: -1 });

		const moveToHusky = this.components.addComponent(
			this.huskyEntity,
			MoveTo
		);

		moveToHusky.setTarget({
			x: this.huskyEntity.x + 1200,
			y: this.huskyEntity.y,
		});

		moveToHusky.velocity = 200;

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

		this.cameras.main.flash(2000, 200, 0, 0);

		this.moveIcecreamConeAway = true;

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
