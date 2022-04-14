import BackgroundImage from "@assets/images/scenario_11/BG.png";
import Dog from "@assets/spritesheets/scenario_11/dog.png";
import DogData from "@assets/spritesheets/scenario_11/dog.json";
import DogAndBoy from "@assets/spritesheets/scenario_11/boy+dog.png";
import DogAndBoyData from "@assets/spritesheets/scenario_11/boy+dog.json";
import ContinueHug from "@assets/spritesheets/scenario_11/boy+dogheadtilt.png";
import ContinueHugData from "@assets/spritesheets/scenario_11/boy+dogheadtilt.json";
import PetDog from "@assets/spritesheets/scenario_11/boy+dogpet.png";
import PetDogData from "@assets/spritesheets/scenario_11/boy+dogpet.json";
import Option1 from "@assets/images/scenario_11/option_1.png";
import Option2 from "@assets/images/scenario_11/option_2.png";
import Option3 from "@assets/images/scenario_11/option_3.png";
import OptionStick from "@assets/images/world/option_stick.png";
import StartText from "@assets/images/scenario_11/start_text.png";
import EndText from "@assets/images/scenario_11/end_text.png";
import CharacterRunSheet from "@assets/spritesheets/player/scenario/run/character_run_.png";
import CharacterWalkSheet from "@assets/spritesheets/player/scenario/walk/character_walk.png";
import CharacterWalkData from "@assets/spritesheets/player/scenario/walk/character_walk.json";
import CharacterIdleSheet from "@assets/spritesheets/player/scenario/idle/character_idle.png";
import CharacterIdleData from "@assets/spritesheets/player/scenario/idle/character_idle.json";
import { Scene } from "phaser";
import SceneLifecycle from "../SceneLifecycle";
import { addFadeIn, fadeToBlack } from "../Utilities/Scene/Fader";
import ComponentService from "../Services/ComponentService";
import MakeFullscreen from "../Components/MakeFullscreen";
import { WorldSceneConfig } from "./WorldScene";
import MoveTo from "../Components/MoveTo";
import SettingsConfig = Phaser.Types.Scenes.SettingsConfig;
import Sprite = Phaser.GameObjects.Sprite;
import squeal from "@assets/audio/dog/squeal_1.mp3";

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

	private option1!: string;

	private option2!: string;

	private option3!: string;

	private optionStick!: string;

	private startText!: string;

	private endText!: string;

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
		this.option1 = "option111";
		this.option2 = "option211";
		this.option3 = "option311";
		this.optionStick = "stick11"
		this.startText = "starttext11";
		this.endText = "endtext11";
		this.characterRun = "spriteSheetPlayerCharacterRun11";
		this.characterWalk = "characterWalk11";
		this.characterIdle = "characterIdle11";
		this.dog = "dog11";
		this.dogAndBoy = "dogAndBoy11";
		this.continueHug = "continueHug11";
		this.petDog = "petDog11";
		

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
		this.load.image("background11", BackgroundImage);
		this.load.image(this.option1, Option1);
		this.load.image(this.option2, Option2);
		this.load.image(this.option3, Option3);
		this.load.image(this.optionStick, OptionStick);
		this.load.image(this.startText,StartText);
		this.load.image(this.endText, EndText);
		this.load.audio("squeal", squeal);
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
	}

	public create(): void {
		const centerX = this.scale.displaySize.width * 0.5;
		const centerY = this.scale.displaySize.height * 0.5;

		const img = this.add.image(centerX, centerY, "background11");

		this.components.addComponent(img, MakeFullscreen);

		this.characterWalkAnims.push(
			...this.anims.createFromAseprite(this.characterWalk)
		);

		this.createSituation();
	}

	private createSituation(): void {
		this.game.sound.pauseAll();
		var song = this.sound.add("scenesong", {volume: 0.1});
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
					end: 1,
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
						end: 1,
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
		const startTextImage = this.add.image(600,200,this.startText).setScale(0.6);
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
		const stick2 = this.add.image(1000,1280, this.optionStick);
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
		const button2 = this.add.image(1000, 1200, this.option2);
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
		const stick3 = this.add.image(1500,1280, this.optionStick);
		const stick3move = this.components.addComponent(
			stick3,
			MoveTo
		);
		stick3move.setTarget({
			x: stick3.x,
			y: stick3.y - 300,
		});		
		stick3move.velocity = 280;
		const button3 = this.add.image(1500, 1200, this.option3);
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
				startTextImage.destroy();
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
				startTextImage.destroy();
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
				startTextImage.destroy();
				this.createResult3();
			});	
	}

	//walk away (correct)
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
				end: 1,
			}),
			repeat: -1,
		});

		this.characterEntity.setVisible(true).play(this.characterWalk).toggleFlipX();
		this.dogEntity.setVisible(true).play(this.dog);

		const moveTo = this.components.addComponent(this.characterEntity, MoveTo);

		moveTo.setTarget({
			x: this.characterEntity.x - 1000,
			y: this.characterEntity.y,
		});

		moveTo.velocity = 250;

		setTimeout(() => {
			this.add.image(600,130,"goodemotion").setScale(0.6);
			this.add.image(600,300,this.endText).setScale(0.6);								
			const continuebutton = this.add.image(1090,360,"continuebutton").setScale(0.6).setInteractive({ useHandCursor: true, pixelPerfect: true });
			continuebutton.on("pointerdown", () => {
				continuebutton.disableInteractive();
				this.moveScene();
			});			
		}, 5000);
	}

	//continue hug (wrong)
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
		var squeal = this.sound.add("squeal");
		squeal.play({
			loop: true
		});	

		setTimeout(() => {
			this.add.image(600,130,"bademotion").setScale(0.6);
			this.add.image(600,300,this.endText).setScale(0.6);					
			const replaybutton = this.add.image(1090,360,"replaybutton").setScale(0.6).setInteractive({ useHandCursor: true, pixelPerfect: true });
			replaybutton.on("pointerdown", () => {
				this.scene.restart();
			});			
		}, 5000);
	}
	
	//pet dog (maybe)
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

		setTimeout(() => {
			this.add.image(600,130,"mixedemotion").setScale(0.6);
			this.add.image(600,300,this.endText).setScale(0.6);					
			const replaybutton = this.add.image(1090,360,"replaybutton").setScale(0.6).setInteractive({ useHandCursor: true, pixelPerfect: true });
			replaybutton.on("pointerdown", () => {
				this.scene.restart();
			});
		}, 4000);
	}

	private moveScene() {
		fadeToBlack(this, () => {
			this.scene.stop(this.scene.key).wake(this.exitSceneKey);
			this.scene.start("UIScene");
		});
		this.game.sound.removeByKey("scenesong");
		this.game.sound.removeByKey("squeal");
		this.game.sound.resumeAll();
	}
}
