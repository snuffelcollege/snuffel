import BackgroundImage from "@assets/images/scenario_2/BG.png";
import Option1 from "@assets/images/scenario_2/option_1.png";
import Option2 from "@assets/images/scenario_2/option_2.png";
import Option3 from "@assets/images/scenario_2/option_3.png";
import OptionStick from "@assets/images/world/option_stick.png";
import StartText from "@assets/images/scenario_2/start_text.png";
import EndText from "@assets/images/scenario_2/end_text.png";
import GoodEmotion from "@assets/images/world/correct_option.png"
import MixedEmotion from "@assets/images/world/almost_option.png"
import BadEmotion from "@assets/images/world/incorrect_option.png"
import CharacterRunSheet from "@assets/spritesheets/player/scenario/run/character_run_.png";
import CharacterWalkSheet from "@assets/spritesheets/player/scenario/walk/character_walk.png";
import CharacterWalkData from "@assets/spritesheets/player/scenario/walk/character_walk.json";
import CharacterIdleSheet from "@assets/spritesheets/player/scenario/idle/character_idle.png";
import CharacterIdleData from "@assets/spritesheets/player/scenario/idle/character_idle.json";
import shepherdSheet from "@assets/spritesheets/scenario_2/dog.png";
import shepherdData from "@assets/spritesheets/scenario_2/dog.json";
import PokingSheet from "@assets/spritesheets/scenario_2/boystick.png";
import PokingData from "@assets/spritesheets/scenario_2/boystick.json";
import BarkingSheet from "@assets/spritesheets/scenario_2/boybark.png";
import BarkingData from "@assets/spritesheets/scenario_2/boybark.json";
import shepherdImage from "@assets/images/scenario_2/dog1.png";
import stickImage from "@assets/images/scenario_2/stick.png";
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
	key: "scene-2",
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

	private option1!: string;

	private option2!: string;

	private option3!: string;

	private startText!: string;

	private endText!: string;

	private goodEmotion!: string;

	private mixedEmotion!: string;

	private badEmotion!: string;

	private optionStick!: string;

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
		this.option1 = "option12";
		this.option2 = "option22";
		this.option3 = "option32";
		this.optionStick = "stick2"
		this.startText = "starttext2";
		this.endText = "endtext2";
		this.goodEmotion = "goodemotion2";
		this.mixedEmotion = "mixedemotion2"
		this.badEmotion = "bademotion2";
		this.shepherdImage = "shepherdImage2";
		this.shepherdSheet = "shepherdSheet2";
		this.barkingSheet = "barkingSheet2";
		this.stickImage = "stickImage2";
		this.pokingSheet = "pokingSheet2";
		this.characterRun = "CharacterRun2";
		this.characterWalk = "characterWalk2";
		this.characterIdle = "characterIdle2";

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
		this.load.image("background2", BackgroundImage);
		this.load.image(this.shepherdImage, shepherdImage);
		this.load.image(this.stickImage, stickImage);
		this.load.image(this.option1, Option1);
		this.load.image(this.option2, Option2);
		this.load.image(this.option3, Option3);
		this.load.image(this.optionStick, OptionStick)
		this.load.image(this.startText,StartText);
		this.load.image(this.endText, EndText);
		this.load.image(this.goodEmotion,GoodEmotion);
		this.load.image(this.mixedEmotion,MixedEmotion);
		this.load.image(this.badEmotion,BadEmotion);
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

		const img = this.add.image(centerX, centerY, "background2");

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
			.setScale(1)
			.toggleFlipX()
			.setDepth(1);
		
		this.shepherdEntity = this.add.sprite(
			1555,
			350,
			this.shepherdSheet
		).setDepth(0);

		this.stickEntity = this.add.sprite(1125, 1025, this.stickImage)
		
		this.createChoice();
	}

	private createChoice(): void {
		const startTextImage = this.add.image(650,100,this.startText).setScale(0.7);
		//create stick 1 and sign 1, add movecomponents
		const stick1 = this.add.image(500,1280, this.optionStick);
		const stick1move = this.components.addComponent(
			stick1,
			MoveTo
		);
		stick1move.setTarget({
			x: stick1.x,
			y: stick1.y - 300,
		});		
		stick1move.velocity = 280;
		const button1 = this.add.image(500, 1200, this.option1);
		button1.on("pointerover", () => {
			button1.angle = 5;			
		});
		button1.on('pointerout',() => {
			button1.angle = 0;
		})
		const button1move = this.components.addComponent(
			button1,
			MoveTo
		);
		button1move.setTarget({
			x: button1.x,
			y: button1.y - 300,
		});		
		button1move.velocity = 280;
		const stick2 = this.add.image(1000,1280, this.optionStick).setDepth(2);
		const stick2move = this.components.addComponent(
			stick2,
			MoveTo
		);
		
		//create stick 2 and sign 2, add movecomponents
		stick2move.setTarget({
			x: stick2.x,
			y: stick2.y - 300,
		});		
		stick2move.velocity = 280;
		const button2 = this.add.image(1000, 1200, this.option2).setDepth(2);
		button2.on("pointerover", () => {
			button2.angle = 5;			
		});
		button2.on('pointerout',() => {
			button2.angle = 0;
		})
		const button2move = this.components.addComponent(
			button2,
			MoveTo
		);
		button2move.setTarget({
			x: button2.x,
			y: button2.y - 300,
		});		
		button2move.velocity = 280;
		
		//create stick 3 and sign 3, add movecomponents
		const stick3 = this.add.image(1500,1280, this.optionStick).setDepth(2);
		const stick3move = this.components.addComponent(
			stick3,
			MoveTo
		);
		stick3move.setTarget({
			x: stick3.x,
			y: stick3.y - 300,
		});		
		stick3move.velocity = 280;
		const button3 = this.add.image(1500, 1200, this.option3).setDepth(2);
		button3.on("pointerover", () => {
			button3.angle = 5;			
		});
		button3.on('pointerout',() => {
			button3.angle = 0;
		})
		const button3move = this.components.addComponent(
			button3,
			MoveTo
		);
		button3move.setTarget({
			x: button3.x,
			y: button3.y - 300,
		});		
		button3move.velocity = 280;

		button1
			.setInteractive({ useHandCursor: true, pixelPerfect: true })
			.on("pointerdown", () => {
				//disables sign 1, moves signs and sticks of option 2 and 3 offscreen
				button1.disableInteractive()				
				button2move.setTarget({
					x: button2.x,
					y: button2.y + 300,
				});		
				button2move.velocity = 280;
				stick2move.setTarget({
					x: stick2.x,
					y: stick2.y + 300,
				});		
				stick2move.velocity = 280;
				button3move.setTarget({
					x: button3.x,
					y: button3.y + 300,
				});		
				button3move.velocity = 280;
				stick3move.setTarget({
					x: stick3.x,
					y: stick3.y + 300,
				});		
				stick3move.velocity = 280;
				this.createResult1();
			});
		button2
			.setInteractive({ useHandCursor: true, pixelPerfect: true })
			.on("pointerdown", () => {
				//disables sign 2, moves signs and sticks of option 1 and 3 offscreen
				stick1move.setTarget({
					x: stick1.x,
					y: stick1.y + 300,
				});		
				stick1move.velocity = 280;
				button1move.setTarget({
					x: button1.x,
					y: button1.y + 300,
				});		
				button1move.velocity = 280;
				button2.disableInteractive()				
				button3move.setTarget({
					x: button3.x,
					y: button3.y + 300,
				});		
				button3move.velocity = 280;
				stick3move.setTarget({
					x: stick3.x,
					y: stick3.y + 300,
				});		
				stick3move.velocity = 280;
				this.createResult2();
			});
		button3
			.setInteractive({ useHandCursor: true, pixelPerfect: true })
			//disables sign 3, moves signs and sticks of option 1 and 2 offscreen
			.on("pointerdown", () => {
				stick1move.setTarget({
					x: stick1.x,
					y: stick1.y + 300,
				});		
				stick1move.velocity = 280;
				button1move.setTarget({
					x: button1.x,
					y: button1.y + 300,
				});		
				button1move.velocity = 280;
				stick2move.setTarget({
					x: stick2.x,
					y: stick2.y + 300,
				});		
				stick2move.velocity = 280;
				button2move.setTarget({
					x: button2.x,
					y: button2.y + 300,
				});		
				button2move.velocity = 280;
				button3.disableInteractive();
				this.createResult3();
			});	
	}

	private createResult1(): void {
		this.anims.create({
			key: this.shepherdSheet,
			frameRate: 2,
			frames: this.anims.generateFrameNumbers(this.shepherdSheet, {
				start: 1,
				end: 0,
			}),
			repeat: -1,
		});

		this.anims.create({
			key: this.pokingSheet,
			frameRate: 8,
			frames: this.anims.generateFrameNumbers(this.pokingSheet, {
				start: 0,
				end: 3,
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

			//this.cameras.main.flash(2000, 200, 0, 0);
			this.shepherdEntity.play(this.shepherdSheet);
			this.characterEntity.play(this.characterRun).setScale(2).toggleFlipX();

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
				end: 3,
			}),
			repeat: -1,
		});

		this.characterEntity.setScale(1).play(this.characterWalk).toggleFlipX();

		const moveToCharacter = this.components.addComponent(
			this.characterEntity,
			MoveTo
		);

		moveToCharacter.setTarget({
			x: this.characterEntity.x + 1000,
			y: this.characterEntity.y,
		});

		moveToCharacter.velocity = 250;

		//this.cameras.main.flash(2000, 0, 200, 0);

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

		//this.cameras.main.flash(2000, 200, 0, 0);

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
