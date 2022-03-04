import BackgroundImage from "@assets/images/scenario_4/Scene4_BG.png";
import Car from "@assets/images/scenario_4/Scene4_car.png";
import CorrectAnswerImage from "@assets/images/scenario_1/scenario_option_1.png";
import IncorrectAnswerImage from "@assets/images/scenario_1/scenario_option_2.png";
import IncorrectAnswerImage2 from "@assets/images/scenario_1/scenario_option_3.png";
import CharacterWalkSheet from "@assets/spritesheets/player/scenario/walk/character_walk.png";
import CharacterWalkData from "@assets/spritesheets/player/scenario/walk/character_walk.json";
import CharacterIdleSheet from "@assets/spritesheets/player/scenario/idle/character_idle.png";
import CharacterIdleData from "@assets/spritesheets/player/scenario/idle/character_idle.json";
import CharacterKnock1 from "@assets/images/Scenario_4/Scenario4_BoyKnock1.png";
import CharacterKnock2 from "@assets/images/Scenario_4/Scenario4_BoyKnock2.png";
import CharacterArm1 from "@assets/images/Scenario_4/Scenario4_BoyArm1.png";
import CharacterArm2 from "@assets/images/Scenario_4/Scenario4_BoyArm2.png";
import DogImage from "@assets/spritesheets/Scenario4_Dog/Scene4_dog.png";
import DogData from "@assets/spritesheets/Scenario4_Dog/Scene4_dog.json";
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

	private characterIdle!: string;//aseprite of character idling

	private DogEntity!: Sprite; //entity that uses dog animation
	
	private dogAnimation!: string;//aseprite of regular dog in car window

	private car!: string; //png of car

	private imageIncorrectAnswer1!: string;

	private imageIncorrectAnswer2!: string;

	private imageCorrectAnswer!: string;

	private exitSceneKey!: string;

	private characterKnock1!: string;

	private characterKnock2!: string;

	private characterArm1!: string;

	private characterArm2!: string;

	constructor(cfg: SettingsConfig = config) {
		super(cfg);
	}

	public init(): void {

		//initializes variables, the string value isn't really bound to anything
		this.car = "car"
		this.imageIncorrectAnswer1 = "scene1IncorrectAnswer1";
		this.imageIncorrectAnswer2 = "scene1IncorrectAnswer2";
		this.imageCorrectAnswer = "scene1CorrectAnswer";
		this.characterWalk = "characterWalk4";
		this.characterIdle = "characterIdle4";
		this.characterKnock1 = "characterKnock1";
		this.characterKnock2 = "characterKnock2";
		this.characterArm1 = "characterArm1";
		this.characterArm2 = "characterArm2";
		this.dogAnimation = "doganimation";

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
		//assigns background to 'background4' string
		this.load.image("background4", BackgroundImage);
		this.load.image(this.car, Car);
		this.load.image(this.imageCorrectAnswer, CorrectAnswerImage);
		this.load.image(this.imageIncorrectAnswer1, IncorrectAnswerImage);
		this.load.image(this.imageIncorrectAnswer2, IncorrectAnswerImage2);
		this.load.image(this.characterKnock1, CharacterKnock1);
		this.load.image(this.characterKnock2, CharacterKnock2);
		this.load.image(this.characterArm1, CharacterArm1);
		this.load.image(this.characterArm2, CharacterArm2);
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
			this.dogAnimation,
			DogImage,
			DogData
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
			key: this.dogAnimation,
			frameRate: 1,
			frames: this.anims.generateFrameNumbers(
				this.dogAnimation,
				{
					start: 0,
					end: 1,
				}
			),
		});
		this.DogEntity = this.add.sprite(780,487,this.dogAnimation);
		this.DogEntity.play(this.dogAnimation).setScale(.8);

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

	//knock on car window (wrong)
	private createResult1(): void {
		//hides entity from scene
		this.characterEntity.setVisible(false);

		//adds knock image
		const knock = this.add.image(900, 700, this.characterKnock1,);
		knock.setScale(0.9)
		setTimeout(() => {
			knock.destroy();
			const knock2 = this.add.image(900, 700, this.characterKnock2,);
			knock2.setScale(0.9)
		}, 1000);
		
		

		//red flash
		this.cameras.main.flash(2000, 200, 0, 0);

		//fade to black and back to overworld after 5 seconds
		setTimeout(() => {
			this.moveScene();
		}, 10000);
	}

	//put arm trough car window (wrong)
	private createResult2(): void {
		
		//adds arm image
		const knock = this.add.image(900, 680, this.characterArm1,);
		knock.setScale(0.9)
		setTimeout(() => {
			knock.destroy();
			const knock2 = this.add.image(900, 680, this.characterArm2,);
			knock2.setScale(0.9);
		}, 1000);

		//red flash
		this.cameras.main.flash(2000, 200, 0, 0);

		//fade to black and back to overworld after 5 seconds
		setTimeout(() => {
			this.moveScene();
		}, 5000);
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
