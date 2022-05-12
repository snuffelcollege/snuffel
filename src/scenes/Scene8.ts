import BackgroundImage from "@assets/images/scenario_8/BG.png";
import Option1 from "@assets/images/scenario_8/option_1.png";
import Option2 from "@assets/images/scenario_8/option_2.png";
import Option3 from "@assets/images/scenario_8/option_3.png";
import StartText from "@assets/images/scenario_8/start_text.png";
import EndText from "@assets/images/scenario_8/end_text.png";
import PlayerCharacterSheet from "@assets/spritesheets/player/scenario/icecreamidle/icecream_idle.png";
import CharacterRunSheet from "@assets/spritesheets/player/scenario/run/character_run.png";
import CharacterRunData from "@assets/spritesheets/player/scenario/run/character_run.json";
import CharacterWalkSheet from "@assets/spritesheets/player/scenario/walk/character_walk.png";
import CharacterWalkData from "@assets/spritesheets/player/scenario/walk/character_walk.json";
import CharacterIdleSheet from "@assets/spritesheets/player/scenario/idle/character_idle.png";
import CharacterIdleData from "@assets/spritesheets/player/scenario/idle/character_idle.json";
import IceCreamConeImage from "@assets/images/scenario_8/icecream_cone.png";
import FallenIceCreamConeImage from "@assets/images/scenario_8/Fallenicecream.png";
import HuskyRunJson from "@assets/spritesheets/scenario_8/dogrun.json";
import HuskyRunSheet from "@assets/spritesheets/scenario_8/dogrun.png";
import HuskyIdleJson from "@assets/spritesheets/scenario_8/dogidle.json";
import HuskyIdleSheet from "@assets/spritesheets/scenario_8/dogidle.png";
import HuskyLickJson from "@assets/spritesheets/scenario_8/doglick.json";
import HuskyLickSheet from "@assets/spritesheets/scenario_8/doglick.png";
import { GameObjects, Scene } from "phaser";
import SceneLifecycle from "../SceneLifecycle";
import { addFadeIn, fadeToBlack } from "../Utilities/Scene/Fader";
import ComponentService from "../Services/ComponentService";
import MakeFullscreen from "../Components/MakeFullscreen";
import WorldScene, { WorldSceneConfig } from "./WorldScene";
import MoveTo from "../Components/MoveTo";
import SettingsConfig = Phaser.Types.Scenes.SettingsConfig;
import Sprite = Phaser.GameObjects.Sprite;
import splash from "@assets/audio/objects/fallen_icecream.mp3";
import DepthLayers from "../DepthLayers";

// Config for the scene defining gravity and debug settings.
export const config: SettingsConfig = {
	active: false,
	key: "scene-8",
	physics: {
		default: "arcade",
		arcade: {
			gravity: { y: 0 },
			debug: process.env.NODE_ENV === "development",
		},
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

	private huskyRun!: string;
	private huskyIdle!: string;
	private huskyLick!: string;

	private option1!: string;

	private option2!: string;

	private option3!: string;
	
	private startText!: string;

	private endText!: string;

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
	private dogIdleAnims!: Phaser.Animations.Animation[];
	private dogLickAnims!: Phaser.Animations.Animation[];

	private characterWalkAnims!: Phaser.Animations.Animation[];

	constructor(cfg: SettingsConfig = config) {
		super(cfg);
	}

	public init(): void {
		this.huskyRun = "huskyRun8";
		this.huskyIdle = "huskyIdle8";
		this.huskyLick = "huskyLick8";
		this.option1 = "option18";
		this.option2 = "option28";
		this.option3 = "option38";
		this.startText = "starttext8";
		this.endText = "endtext8";
		this.imageIceCreamCone = "imageIceCreamCone";
		this.fallenIceCreamConeImage = "fallenIceCreamCone"
		this.spriteSheetPlayerCharacter = "spriteSheetPlayerCharacter8";
		this.characterRun = "spriteSheetPlayerCharacterRun8";
		this.characterWalk = "characterWalk8";
		this.characterIdle = "characterIdle8";

		if (!WorldSceneConfig.key) {
			throw Error("Exit scene key is undefined");
		}

		this.exitSceneKey = WorldSceneConfig.key;

		this.components = new ComponentService();

		this.characterWalkAnims = [];
		this.dogWalkAnims = [];
		this.dogIdleAnims = [];
		this.dogLickAnims = [];

		this.moveIcecreamConeAway = false;

		// The moment the scene renders, a fade from black is started using this function.
		addFadeIn(this);
	}

	// A key has to be unique for the entire project, not just this scene.
	public preload(): void {
		this.load.image("background8", BackgroundImage);
		this.load.image(this.option1, Option1);
		this.load.image(this.option2, Option2);
		this.load.image(this.option3, Option3);
		this.load.image(this.startText,StartText);
		this.load.image(this.endText, EndText);
		this.load.image(this.imageIceCreamCone, IceCreamConeImage);
		this.load.image(this.fallenIceCreamConeImage, FallenIceCreamConeImage);
		this.load.audio("splash", splash);
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

		this.load.aseprite(this.huskyRun, HuskyRunSheet, HuskyRunJson);
		this.load.aseprite(this.huskyIdle, HuskyIdleSheet, HuskyIdleJson);
		this.load.aseprite(this.huskyLick, HuskyLickSheet, HuskyLickJson);
	}

	public create(): void {
		const centerX = this.scale.displaySize.width * 0.5;
		const centerY = this.scale.displaySize.height * 0.5;

		const img = this.add.image(centerX, centerY, "background8");

		this.components.addComponent(img, MakeFullscreen);

		// todo; make into a component
		this.dogWalkAnims.push(...this.anims.createFromAseprite(this.huskyRun));
		this.dogIdleAnims.push(...this.anims.createFromAseprite(this.huskyIdle));
		this.dogLickAnims.push(...this.anims.createFromAseprite(this.huskyLick));
		this.characterWalkAnims.push(...this.anims.createFromAseprite(this.characterWalk));

		this.createSituation();
	}

	public update(time: number, delta: number): void {
		super.update(time, delta);

		if (this.moveIcecreamConeAway){	
			var splash = this.sound.add("splash");
			this.icecreamCone
				.setRotation(this.icecreamCone.rotation - 0.075)
				.setPosition(this.icecreamCone.x - 0.8, this.icecreamCone.y + 3);
				splash.play({
					loop: false
				});
			setTimeout(() => {
				this.moveIcecreamConeAway = false;
				this.icecreamCone.destroy();
				this.add.image(1100, 870, this.fallenIceCreamConeImage).setScale(0.8);
			}, 400);
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
			this.characterEntity.y + 100,
			this.huskyRun
		);
		this.huskyEntity
			
			.play({ key: this.dogWalkAnims[0].key, repeat: -1 });

		const moveTo = this.components.addComponent(this.huskyEntity, MoveTo);

		moveTo.setTarget({
			x: this.characterEntity.x - 300,
			y: this.huskyEntity.y-100,
		});

		moveTo.velocity = 200;

		moveTo.movingDone = () => {
			this.huskyEntity.play({
				key: this.dogIdleAnims[0].key,
				repeat: -1,
				frameRate: 2
			});

			this.createChoice();
		};
	}

	private createChoice(): void {
		const startTextImage = this.add.image(600,200,this.startText).setScale(0.6);
		//create stick 1 and sign 1, add movecomponents
		const stick1 = this.add.image(500,1280, "stick");
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
		const stick2 = this.add.image(1000,1280, "stick");
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
		const stick3 = this.add.image(1500,1280, "stick");
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
				this.icecreamCone = this.add
				.image(1105, 710, this.imageIceCreamCone)
				.setScale(0.65, 0.55)
				.setDepth(100);
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
				this.icecreamCone = this.add
				.image(1105, 710, this.imageIceCreamCone)
				.setScale(0.65, 0.55)
				.setDepth(100);
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
				this.icecreamCone = this.add
				.image(1105, 710, this.imageIceCreamCone)
				.setScale(0.65, 0.55)
				.setDepth(100);
				startTextImage.destroy();
				this.createResult3();
			});		
	}

	//stand still (correct)
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

		this.huskyEntity.play({ key: this.dogWalkAnims[0].key, repeat: -1 }).setDepth(DepthLayers.PLAYER);

		const moveTo = this.components.addComponent(this.huskyEntity, MoveTo);

		moveTo.setTarget({
			x: this.characterEntity.x-175,
			y: this.characterEntity.y+175,
		});

		moveTo.velocity = 150;

		this.moveIcecreamConeAway = true;

		moveTo.movingDone = () => {
			this.huskyEntity.play({key: this.dogLickAnims[0].key, frameRate: 2, repeat: -1});
		}

		setTimeout(() => {
			this.add.image(600,130,"goodemotion").setScale(0.6);
			this.add.image(600,300,this.endText).setScale(0.6);	
			const continuebutton = this.add.image(1090,360,"continuebutton").setScale(0.6).setInteractive({ useHandCursor: true, pixelPerfect: true });
			continuebutton.on("pointerdown", () => {
				continuebutton.disableInteractive();
				WorldScene.scenario8Fininshed = true;
				this.moveScene();
			});
			
		}, 5000);
	}
	
	//walk away (maybe)
	private createResult2(): void {
		this.huskyEntity.play({ key: this.dogWalkAnims[0].key, repeat: -1 });

		const moveToHusky = this.components.addComponent(
			this.huskyEntity,
			MoveTo
		);

		moveToHusky.setTarget({
			x: 2300,
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
			x: 2100,
			y: this.characterEntity.y,
		});

		moveToCharacter.velocity = 200;

		this.moveIcecreamConeAway = true;

		setTimeout(() => {
			this.add.image(600,130,"mixedemotion").setScale(0.6);
			this.add.image(600,300,this.endText).setScale(0.6);					
			const replaybutton = this.add.image(1090,360,"replaybutton").setScale(0.6).setInteractive({ useHandCursor: true, pixelPerfect: true });
			replaybutton.on("pointerdown", () => {
				this.scene.restart();
			})
			
		}, 5000);
	}

	//run away (wrong)
	private createResult3(): void {
		this.huskyEntity.play({ key: this.dogWalkAnims[0].key, repeat: -1 });

		const moveToHusky = this.components.addComponent(
			this.huskyEntity,
			MoveTo
		);

		moveToHusky.setTarget({
			x: 2300,
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
			x: 2100,
			y: this.characterEntity.y,
		});

		moveToCharacter.velocity = 250;

		this.moveIcecreamConeAway = true;
		setTimeout(() => {
			this.add.image(600,130,"bademotion").setScale(0.6);
			this.add.image(600,300,this.endText).setScale(0.6);					
			const replaybutton = this.add.image(1090,360,"replaybutton").setScale(0.6).setInteractive({ useHandCursor: true, pixelPerfect: true });
			replaybutton.on("pointerdown", () => {
				this.scene.restart();
			})			
		}, 5000);
	}

	

	private moveScene() {
		fadeToBlack(this, () => {
			this.scene.stop(this.scene.key).wake(this.exitSceneKey);
			this.scene.start("UIScene");
		});
	}
}
