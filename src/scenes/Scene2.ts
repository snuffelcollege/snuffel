import Background from "@assets/images/scenario_2/BG.png";
import CharacterRunSheet from "@assets/spritesheets/player/scenario/run/character_run.png";
import CharacterRunData from "@assets/spritesheets/player/scenario/run/character_run.json";
import CharacterWalkSheet from "@assets/spritesheets/player/scenario/walk/character_walk.png";
import CharacterWalkData from "@assets/spritesheets/player/scenario/walk/character_walk.json";
import IncorrectAnswerImage from "@assets/images/scenario_2/option_1.png";
import IncorrectAnswerImage2 from "@assets/images/scenario_2/option_2.png";
import CorrectAnswerImage from "@assets/images/scenario_2/option_3.png";
import HuskyIdleLamppostData from "@assets/spritesheets/husky/husky_idle_lamppost.json";
import HuskyIdleLamppostSheet from "@assets/spritesheets/husky/husky_idle_lamppost.png";
import HuskyJumpLamppostData from "@assets/spritesheets/husky/husky_jump_lamppost.json";
import HuskyJumpLamppostSheet from "@assets/spritesheets/husky/husky_jump_lamppost.png";
import AdultNPCTexture from "@assets/spritesheets/scenario_3/npc_1.png";
import AdultNPCConfig from "@assets/spritesheets/scenario_3/npc_1.json";
import Ball from "@assets/images/scenario_2/ball.png";
import { Scene } from "phaser";
import SceneLifecycle from "../SceneLifecycle";
import ComponentService from "../Services/ComponentService";
import MakeFullscreen from "../Components/MakeFullscreen";
import { WorldSceneConfig } from "./WorldScene";
import { addFadeIn, fadeToBlack } from "../Utilities/Scene/Fader";
import MoveTo from "../Components/MoveTo";
import FixedHeightAnimator from "../Components/FixedHeightAnimator";
import { waitFor } from "../Utilities/Scene/SceneUtil";
import SettingsConfig = Phaser.Types.Scenes.SettingsConfig;
import Sprite = Phaser.GameObjects.Sprite;

export const config: SettingsConfig = {
	active: false,
	key: "scene-2",
	physics: {
		default: "arcade",
		arcade: {
			gravity: { y: 0 },
			debug: process.env.NODE_ENV === "development",
		},
	},
};

// Define the different movements for the ball. It is either stationary (not moving), moving to the left or moving to the right.
enum BallMovement {
	Stationary,
	Left,
	Right,
}

export default class Scene2 extends Scene implements SceneLifecycle {
	private components!: ComponentService;

	private adultNPC!: string;

	private characterEntity!: Sprite;

	private characterWalk!: string;

	private characterRun!: string;

	private huskyEntity!: Sprite;

	private huskyIdleLamppost!: string;

	private huskyJumpLamppost!: string;

	private ballEntity!: Sprite;

	private ballMoving!: BallMovement;

	private exitSceneKey!: string;

	private imageCorrectAnswer!: string;

	private imageIncorrectAnswer1!: string;

	private imageIncorrectAnswer2!: string;

	private characterWalkAnims!: Phaser.Animations.Animation[];

	private characterRunAnims!: Phaser.Animations.Animation[];

	private huskyJumpAnims!: Phaser.Animations.Animation[];

	private huskyIdleAnims!: Phaser.Animations.Animation[];

	constructor(cfg: SettingsConfig = config) {
		super(cfg);
	}

	public init(): void {
		this.characterWalk = "characterWalk2";
		this.characterRun = "spriteSheetPlayerCharacterRun2";
		this.huskyIdleLamppost = "huskyIdleLamppost";
		this.huskyJumpLamppost = "huskyJumpLamppost";
		this.adultNPC = "scene3AdultNPC";
		this.imageIncorrectAnswer1 = "scene-2-incorrect-answer-1";
		this.imageIncorrectAnswer2 = "scene-2-incorrect-answer-2";
		this.imageCorrectAnswer = "scene-2-correct-answer";

		this.characterWalkAnims = [];
		this.characterRunAnims = [];
		this.huskyJumpAnims = [];
		this.huskyIdleAnims = [];

		this.ballMoving = BallMovement.Stationary;

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
		this.load.image("background2", Background);
		this.load.image("ball", Ball);
		this.load.image(this.imageCorrectAnswer, CorrectAnswerImage);
		this.load.image(this.imageIncorrectAnswer1, IncorrectAnswerImage);
		this.load.image(this.imageIncorrectAnswer2, IncorrectAnswerImage2);

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
			this.huskyIdleLamppost,
			HuskyIdleLamppostSheet,
			HuskyIdleLamppostData
		);

		this.load.aseprite(
			this.huskyJumpLamppost,
			HuskyJumpLamppostSheet,
			HuskyJumpLamppostData
		);

		this.load.aseprite(this.adultNPC, AdultNPCTexture, AdultNPCConfig);
	}

	public create(): void {
		const centerX = this.scale.displaySize.width * 0.5;
		const centerY = this.scale.displaySize.height * 0.5;

		const img = this.add.image(centerX, centerY, "background2");

		this.components.addComponent(img, MakeFullscreen);

		this.characterWalkAnims = this.anims.createFromAseprite(
			this.characterWalk
		);
		this.characterRunAnims = this.anims.createFromAseprite(
			this.characterRun
		);
		this.huskyJumpAnims = this.anims.createFromAseprite(
			this.huskyJumpLamppost
		);
		this.huskyIdleAnims = this.anims.createFromAseprite(
			this.huskyIdleLamppost
		);

		this.createSituation();
	}

	public update(time: number, delta: number): void {
		super.update(time, delta);

		// Make sure the ball is rolling to the right side. Rotation is in PI, so the given margin is small.
		if (this.ballMoving === BallMovement.Right)
			this.ballEntity.setRotation(this.ballEntity.rotation + 0.1);
		else if (this.ballMoving === BallMovement.Left)
			this.ballEntity.setRotation(this.ballEntity.rotation - 0.15);
	}

	// Creates the opening of the scene.
	private createSituation() {
		let characterDone = false;
		let ballDone = false;

		// Create dog
		this.huskyEntity = this.add.sprite(500, 400, this.huskyIdleLamppost);

		// Play dog's animation
		this.huskyEntity.play({ key: this.huskyIdleAnims[0].key, repeat: -1 });

		// Create character
		this.characterEntity = this.add.sprite(2100, 600, this.characterWalk);

		// Play characters animation
		this.characterEntity.setFlipX(true).play({
			key: this.characterWalkAnims[0].key,
			repeat: -1,
		});

		// Create movement for character
		const moveToCharacter = this.components.addComponent(
			this.characterEntity,
			MoveTo
		);

		moveToCharacter.setTarget({
			x: 1150,
			y: 500,
		});

		moveToCharacter.velocity = 150;

		moveToCharacter.movingDone = () => {
			this.characterEntity.stop();
			characterDone = true;
			if (characterDone && ballDone) this.createChoice();
		};

		this.ballEntity = this.add.sprite(800, 750, "ball");

		this.ballMoving = BallMovement.Right;

		const moveToBall = this.components.addComponent(
			this.ballEntity,
			MoveTo
		);

		moveToBall.setTarget({
			x: 1075,
			y: 750,
		});

		moveToBall.velocity = 100;

		moveToBall.movingDone = () => {
			ballDone = true;
			this.ballMoving = BallMovement.Stationary;
			if (characterDone && ballDone) this.createChoice();
		};
	}

	private createChoice(): void {
		const button1 = this.add.image(400, 925, this.imageIncorrectAnswer1);
		const button2 = this.add.image(900, 925, this.imageIncorrectAnswer2);
		const button3 = this.add.image(1400, 925, this.imageCorrectAnswer);

		button1.setInteractive().on("pointerdown", () => {
			button1.disableInteractive();
			button2.disableInteractive();
			button3.disableInteractive();
			this.createResult1();
		});
		button2.setInteractive().on("pointerdown", () => {
			button1.disableInteractive();
			button2.disableInteractive();
			button3.disableInteractive();
			this.createResult2();
		});
		button3.setInteractive().on("pointerdown", () => {
			button1.disableInteractive();
			button2.disableInteractive();
			button3.disableInteractive();
			this.createResult3();
		});
	}

	private createResult1() {
		this.characterEntity.play({
			key: this.characterWalkAnims[0].key,
			repeat: -1,
		});

		const moveTo = this.components.addComponent(
			this.characterEntity,
			MoveTo
		);

		moveTo.setTarget({
			x: this.characterEntity.x - 300,
			y: this.characterEntity.y,
		});

		moveTo.velocity = 150;

		moveTo.movingDone = () => {
			this.huskyEntity.play({
				key: this.huskyJumpAnims[0].key,
				repeat: -1,
			});

			this.characterEntity.toggleFlipX().play({
				key: this.characterRunAnims[0].key,
				repeat: -1,
			});

			moveTo.setTarget({
				x: this.characterEntity.x + 700,
				y: this.characterEntity.y + 50,
			});

			moveTo.velocity = 300;

			moveTo.movingDone = () => {
				this.characterEntity.stop();
				this.moveScene();
			};
		};

		this.cameras.main.flash(2000, 200, 0, 0);
	}

	private createResult2() {
		this.huskyEntity.play({ key: this.huskyJumpAnims[0].key, repeat: -1 });

		const moveToBall = this.components.addComponent(
			this.ballEntity,
			MoveTo
		);

		const moveToPlayer = this.components.addComponent(
			this.characterEntity,
			MoveTo
		);

		this.ballMoving = BallMovement.Left;

		moveToBall.setTarget({
			x: this.ballEntity.x - 400,
			y: this.ballEntity.y,
		});

		moveToBall.velocity = 200;

		moveToBall.movingDone = () => {
			this.ballMoving = BallMovement.Stationary;
		};

		this.characterEntity.toggleFlipX().play({
			key: this.characterRunAnims[0].key,
			repeat: -1,
		});

		moveToPlayer.setTarget({
			x: this.characterEntity.x + 700,
			y: this.characterEntity.y + 50,
		});

		moveToPlayer.velocity = 300;

		moveToPlayer.movingDone = () => {
			this.characterEntity.stop();
			this.moveScene();
		};

		this.cameras.main.flash(2000, 200, 0, 0);
	}

	private createResult3() {
		this.characterEntity.toggleFlipX();

		const adultNpc = this.add
			.sprite(this.scale.width, 100, this.adultNPC)
			.setOrigin(0, 0)
			.toggleFlipX();

		const adultAnimator = this.components.addComponent(
			adultNpc,
			FixedHeightAnimator
		);

		const adultMover = this.components.addComponent(adultNpc, MoveTo);

		adultAnimator.addAnimations(
			...this.anims.createFromAseprite(this.adultNPC)
		);
		adultAnimator.desiredHeight = this.characterEntity.height + 200;
		adultAnimator.loop(1);

		adultMover.setTarget({
			x: this.characterEntity.x + 240,
			y: adultNpc.y,
		});

		adultMover.movingDone = () => {
			adultAnimator.loop(0);

			waitFor(this, () => this.moveScene(), 1000);
		};

		this.cameras.main.flash(2000, 0, 200, 0);
	}

	private moveScene() {
		fadeToBlack(this, () => {
			this.scene.stop(this.scene.key).wake(this.exitSceneKey);
		});
	}
}
