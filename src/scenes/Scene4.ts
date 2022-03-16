import BackgroundImage from "@assets/images/scenario_4/BG.png";
import Car from "@assets/images/scenario_4/car.png";
import CorrectAnswerImage from "@assets/images/scenario_4/option_1.png";
import IncorrectAnswerImage from "@assets/images/scenario_4/option_2.png";
import IncorrectAnswerImage2 from "@assets/images/scenario_4/option_3.png";
import CharacterWalkSheet from "@assets/spritesheets/player/scenario/walk/character_walk.png";
import CharacterWalkData from "@assets/spritesheets/player/scenario/walk/character_walk.json";
import CharacterRunSheet from "@assets/spritesheets/player/scenario/run/character_run.png";
import CharacterRunData from "@assets/spritesheets/player/scenario/run/character_run.json";
import CharacterIdleSheet from "@assets/spritesheets/player/scenario/idle/character_idle.png";
import CharacterIdleData from "@assets/spritesheets/player/scenario/idle/character_idle.json";
import CharacterKnockSheet from "@assets/spritesheets/scenario_4/boy_knock.png";
import CharacterKnockData from "@assets/spritesheets/scenario_4/boy_knock.json";
import CharacterArmSheet from "@assets/spritesheets/scenario_4/boy_arm.png";
import CharacterArmData from "@assets/spritesheets/scenario_4/boy_arm.json";
import DogNeutralImage from "@assets/spritesheets/scenario_4/dog_neutral.png";
import DogNeutralData from "@assets/spritesheets/scenario_4/dog_neutral.json";
import DogBiteImage from "@assets/spritesheets/scenario_4/dog_bite.png";
import DogBiteData from "@assets/spritesheets/scenario_4/dog_bite.json";
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

export default class Scene1 extends Scene implements SceneLifecycle {
	private components!: ComponentService;

	private characterEntity!: Sprite; //embodiement of character, uses walk and idle animations

	private characterWalkAnims!: Phaser.Animations.Animation[]; // push character walk

	private characterWalk!: string; //aseprite of character walking

	private characterRunAnims!: Phaser.Animations.Animation[]; // push character walk

	private characterRun!: string; //aseprite of character walking

	private characterIdle!: string;//aseprite of character idling

	private characterArm!: string;

	private characterArmAnims!: Phaser.Animations.Animation[]; 

	private characterKnock!: string;

	private characterKnockAnims!: Phaser.Animations.Animation[]; // push character walk
	
	private DogEntity!: Sprite; //entity that uses dog animation
	
	private dogIdleAnimation!: string;//aseprite of regular dog in car window

	private dogBiteAnimation!: string;

	private car!: string; //png of car

	private imageIncorrectAnswer1!: string;

	private imageIncorrectAnswer2!: string;

	private imageCorrectAnswer!: string;

	private exitSceneKey!: string;

	constructor(cfg: SettingsConfig = config) {
		super(cfg);
	}

	public init(): void {

		//initializes variables, the string value isn't really bound to anything
		this.car = "car"
		this.imageIncorrectAnswer1 = "scene1IncorrectAnswer14";
		this.imageIncorrectAnswer2 = "scene1IncorrectAnswer24";
		this.imageCorrectAnswer = "scene1CorrectAnswer4";
		this.characterWalk = "characterWalk4";
		this.characterIdle = "characterIdle4";
		this.characterRun = "characterRun4"
		this.characterKnock = "characterKnock4";
		this.characterArm = "characterArm4";
		this.dogIdleAnimation = "dogidleanimation4";
		this.dogBiteAnimation = "dogbiteanimation4"

		if (!WorldSceneConfig.key) {
			throw Error("Exit scene key is undefined");
		}

		this.exitSceneKey = WorldSceneConfig.key;

		this.components = new ComponentService();

		this.characterWalkAnims = [];
		this.characterRunAnims = [];
		this.characterKnockAnims = [];
		this.characterArmAnims = [];
		// The moment the scene renders, a fade from black is started using this function.
		addFadeIn(this);
	}

	// A key has to be unique for the entire project, not just this scene.
	public preload(): void {
		//assigns background to 'background4' string
		this.load.image("background4", BackgroundImage);
		this.load.image(this.car, Car);
		this.load.image(this.imageCorrectAnswer, CorrectAnswerImage);
		this.load.image(this.imageIncorrectAnswer1, IncorrectAnswerImage);
		this.load.image(this.imageIncorrectAnswer2, IncorrectAnswerImage2);
	
		this.load.aseprite(
			this.characterWalk,
			CharacterWalkSheet,
			CharacterWalkData
		);
		this.load.aseprite(
			this.characterRun,
			CharacterRunSheet,
			CharacterRunData
		);
		this.load.aseprite(
			this.characterIdle,
			CharacterIdleSheet,
			CharacterIdleData
		);
		this.load.aseprite(
			this.characterArm,
			CharacterArmSheet,
			CharacterArmData
		)
		this.load.aseprite(
			this.characterKnock,
			CharacterKnockSheet,
			CharacterKnockData
		)
		this.load.aseprite(
			this.dogIdleAnimation,
			DogNeutralImage,
			DogNeutralData
		);
		this.load.aseprite(
			this.dogBiteAnimation,
			DogBiteImage,
			DogBiteData
		);
	}

	public create(): void {
		const centerX = this.scale.displaySize.width * 0.5;
		const centerY = this.scale.displaySize.height * 0.5;
		
		//loads background from 'background4' string. this isn't stored in a local variable because of a bug where the wrong background was loaded in certain scenes.
		const img = this.add.image(centerX, centerY, "background4");
		const car = this.add.image(500, 700, this.car,);
		car.setScale(0.9)
		this.components.addComponent(img, MakeFullscreen);

		this.characterWalkAnims.push(
			...this.anims.createFromAseprite(this.characterWalk)
		);
		this.characterRunAnims.push(
			...this.anims.createFromAseprite(this.characterRun)
		);
		this.characterKnockAnims.push(
			...this.anims.createFromAseprite(this.characterKnock)
		);
		this.characterArmAnims.push(
			...this.anims.createFromAseprite(this.characterArm)
		);
		
		this.createSituation();
	}

	public update(time: number, delta: number): void {
		super.update(time, delta);
	}

	private createSituation(): void {

		//main character idling
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
		this.characterEntity = this.add.sprite(1100,700,this.characterIdle);
		this.characterEntity.play(this.characterIdle).setScale(.8);

		//dog animation
		this.anims.create({
			key: this.dogIdleAnimation,
			frameRate: 1,
			frames: this.anims.generateFrameNumbers(
				this.dogIdleAnimation,
				{
					start: 0,
					end: 1,
				}
			),
		});
		this.DogEntity = this.add.sprite(780,487,this.dogIdleAnimation);
		this.DogEntity.play(this.dogIdleAnimation).setScale(.8);

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

	//knock on car window (wrong)
	private createResult1(): void {
	
		//sets character in walk animation (towards car)
		this.characterEntity		
			.toggleFlipX()//	
			.play({ key: this.characterWalkAnims[0].key, repeat: -1 })
			.setScale(0.8);

		//moveto component
		const moveToCar = this.components.addComponent(this.characterEntity,MoveTo);

		//sets target location for moveto command
		moveToCar.setTarget({
			x: this.characterEntity.x - 200,
			y: this.characterEntity.y,
		});

		//sets velocity of moveto command
		moveToCar.velocity = 100;

		moveToCar.movingDone = () => {
			//knocking after moving is done
			this.characterEntity
			.toggleFlipX()
			.play({ key: this.characterKnockAnims[0].key, repeat: -1,frameRate:1 })
			.setScale(0.8);

			setTimeout(() => {
				//dog animation
				this.anims.create({
					key: this.dogBiteAnimation,
					frameRate: 1,
					frames: this.anims.generateFrameNumbers(
						this.dogBiteAnimation,
						{
							start: 0,
							end: 1,
						}
					),
				});
				this.DogEntity.setFrame(this.dogBiteAnimation);//overwrites old frame
				this.DogEntity.play(this.dogBiteAnimation).setScale(.8);
				//run animation
				this.characterEntity
				.play({ key: this.characterRunAnims[0].key, repeat: -1,frameRate:3 })
				.setScale(0.8);
				const moveToExit = this.components.addComponent(this.characterEntity,MoveTo);
				//sets target location for moveto command
				moveToExit.setTarget({
					x: this.characterEntity.x + 1500,
					y: this.characterEntity.y
				});
				moveToExit.velocity = 300;
			},2000)
		}

		//red flash
		this.cameras.main.flash(2000, 200, 0, 0);

		//fade to black and back to overworld after 5 seconds
		setTimeout(() => {
			this.moveScene();
		}, 6000);
	}

	//put arm trough car window (wrong)
	private createResult2(): void {

		//sets character in walk animation (towards car)
		this.characterEntity		
			.toggleFlipX()//	
			.play({ key: this.characterWalkAnims[0].key, repeat: -1 })
			.setScale(0.8);

		//moveto component
		const moveToCar = this.components.addComponent(this.characterEntity,MoveTo);

		//sets target location for moveto command
		moveToCar.setTarget({
			x: this.characterEntity.x - 180,
			y: this.characterEntity.y - 30,
		});

		//sets velocity of moveto command
		moveToCar.velocity = 100;

		moveToCar.movingDone = () => {
			//put arm trough window (once) after moving is done 
			this.characterEntity
			.toggleFlipX()
			.play({ key: this.characterArmAnims[0].key,frameRate:1 })
			.setScale(0.8);

			setTimeout(() => {
				//dog animation
				this.anims.create({
					key: this.dogBiteAnimation,
					frameRate: 1,
					frames: this.anims.generateFrameNumbers(
						this.dogBiteAnimation,
						{
							start: 0,
							end: 1,
						}
					),
				});
				this.DogEntity.setFrame(this.dogBiteAnimation);//overwrites old frame
				this.DogEntity.play(this.dogBiteAnimation).setScale(.8);
				//run animation
				this.characterEntity
				.play({ key: this.characterRunAnims[0].key, repeat: -1,frameRate:3 })
				.setScale(0.8);
				const moveToExit = this.components.addComponent(this.characterEntity,MoveTo);
				//sets target location for moveto command
				moveToExit.setTarget({
					x: this.characterEntity.x + 1500,
					y: this.characterEntity.y
				});
				moveToExit.velocity = 300;
			},2000)
		}
		//red flash
		this.cameras.main.flash(2000, 200, 0, 0);

		//fade to black and back to overworld after 5 seconds
		setTimeout(() => {
			this.moveScene();
		}, 6000);
	}

	//walk away (correct answer)
	private createResult3(): void {

		//sets character in walk animation
		this.characterEntity
			.play({ key: this.characterWalkAnims[0].key, repeat: -1 })
			.setScale(0.8);

		//moveto component
		const moveToCharacter = this.components.addComponent(this.characterEntity,MoveTo);

		//sets target location for moveto command
		moveToCharacter.setTarget({
			x: this.characterEntity.x + 1000,
			y: this.characterEntity.y,
		});

		//sets velocity of moveto command
		moveToCharacter.velocity = 200;

		//green flash
		this.cameras.main.flash(2000, 0, 200, 0);

		//fade to black and back to overworld after 5 seconds
		setTimeout(() => {
			this.moveScene();
		}, 5000);
	}

	//fade to black and back to overworld
	private moveScene() {
		fadeToBlack(this, () => {
			this.scene.stop(this.scene.key).wake(this.exitSceneKey);
		});
	}
}
