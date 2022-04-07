import BackgroundImage from "@assets/images/scenario_2/BG.png";
import Option1 from "@assets/images/scenario_2/option_1.png";
import Option2 from "@assets/images/scenario_2/option_2.png";
import Option3 from "@assets/images/scenario_2/option_3.png";
import OptionStick from "@assets/images/world/option_stick.png";
import BadgeCase from "@assets/images/UI/badges/badge_case.png";
import BadgeS1 from "@assets/images/UI/badges/badge_s1.png";
import BadgeS2 from "@assets/images/UI/badges/badge_s2.png";
import BadgeS3 from "@assets/images/UI/badges/badge_s3.png";
import BadgeS4 from "@assets/images/UI/badges/badge_s4.png";
import BadgeS5 from "@assets/images/UI/badges/badge_s5.png";
import BadgeS6 from "@assets/images/UI/badges/badge_s6.png";
import StartText from "@assets/images/scenario_2/start_text.png";
import EndText from "@assets/images/scenario_2/end_text.png";
import GoodEmotion from "@assets/images/world/correct_option.png";
import MixedEmotion from "@assets/images/world/almost_option.png";
import BadEmotion from "@assets/images/world/incorrect_option.png";
import ContinueButton from "@assets/images/UI/continue_button.png";
import ReplayButton from "@assets/images/UI/replay_button.png";
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
import WorldScene, { WorldSceneConfig } from "./WorldScene";
import MoveTo from "../Components/MoveTo";
import SettingsConfig = Phaser.Types.Scenes.SettingsConfig;
import Sprite = Phaser.GameObjects.Sprite;
import sceneSong from "@assets/audio/scene.mp3";
import BadgeBling from "@assets/audio/UI/badge_bling.mp3";
import bark from "@assets/audio/dog/regular_bark_1.mp3";
import stickAudio from "@assets/audio/objects/fallen_stick.mp3";
import StartTextAudio from "@assets/audio/scenario_2/start_text.mp3";
import EndTextAudio from "@assets/audio/scenario_2/end_text.mp3";
import Option1Audio from "@assets/audio/scenario_2/option_1.mp3";
import Option2Audio from "@assets/audio/scenario_2/option_2.mp3";
import Option3Audio from "@assets/audio/scenario_2/option_3.mp3";
import GoodEmotionAudio from "@assets/audio/correct.mp3";
import MixedEmotionAudio from "@assets/audio/almost.mp3";
import BadEmotionAudio from "@assets/audio/incorrect.mp3";

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

	private badgeCase!: string;

    private badgeS1!: string;
    
	private badgeS2!: string;
    
	private badgeS3!: string;
    
	private badgeS4!: string;
    
	private badgeS5!: string;
    
	private badgeS6!: string;

	private startText!: string;

	private endText!: string;

	private goodEmotion!: string;

	private mixedEmotion!: string;

	private badEmotion!: string;

	private continueButton!: string;

	private replayButton!: string;

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
		this.optionStick = "stick2";
		this.badgeCase = "badgecase2";
        this.badgeS1 = "badges12";
        this.badgeS2 = "badges22";
        this.badgeS3 = "badges32";
        this.badgeS4 = "badges42";
        this.badgeS5 = "badges52";
        this.badgeS6 = "badges62";
		this.startText = "starttext2";
		this.endText = "endtext2";
		this.goodEmotion = "goodemotion2";
		this.mixedEmotion = "mixedemotion2";
		this.badEmotion = "bademotion2";
		this.continueButton = "continuebutton2";
		this.replayButton = "replaybutton2";
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
		this.load.image(this.optionStick, OptionStick);
		this.load.image(this.badgeCase, BadgeCase);
        this.load.image(this.badgeS1,BadgeS1);
        this.load.image(this.badgeS2,BadgeS2);
        this.load.image(this.badgeS3,BadgeS3);
        this.load.image(this.badgeS4,BadgeS4);
        this.load.image(this.badgeS5,BadgeS5);
        this.load.image(this.badgeS6,BadgeS6);
		this.load.image(this.continueButton,ContinueButton);
		this.load.image(this.replayButton,ReplayButton);
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
		this.load.audio("bark", bark);
		this.load.audio("badgeBling", BadgeBling);
		this.load.audio("2fallenStick",stickAudio);
		this.load.audio("2startTextAudio",StartTextAudio);
		this.load.audio("2endTextAudio", EndTextAudio);
		this.load.audio("2option1Audio", Option1Audio);
		this.load.audio("2option2Audio", Option2Audio);
		this.load.audio("2option3Audio", Option3Audio);
		this.load.audio("2goodEmotionAudio", GoodEmotionAudio);
		this.load.audio("2mixedEmotionAudio", MixedEmotionAudio);
		this.load.audio("2badEmotionAudio", BadEmotionAudio);
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
		var song = this.sound.add("sceneSong", {volume: 0.1});
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
		this.sound.add("2startTextAudio", {volume: 1.5}).play();
		this.createChoice();
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
			this.game.sound.removeByKey("2startTextAudio");
			this.sound.add("2option1Audio", {volume: 1.5}).play();
			button1.angle = 5;			
		});
		button1.on('pointerout',() => {
			this.game.sound.removeByKey("2option1Audio");
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
			this.game.sound.removeByKey("2startTextAudio");
			this.sound.add("2option2Audio", {volume: 1.5}).play();
			button2.angle = 5;			
		});
		button2.on('pointerout',() => {
			this.game.sound.removeByKey("2option2Audio");
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
			this.game.sound.removeByKey("2startTextAudio");
			this.sound.add("2option3Audio", {volume: 1.5}).play();
			button3.angle = 5;			
		});
		button3.on('pointerout',() => {
			this.game.sound.removeByKey("2option3Audio");
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

	//poke stick to fence(wrong)
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

			this.shepherdEntity.play(this.shepherdSheet);
			var bark = this.sound.add("bark");
			bark.play({
				loop: true
			});
			this.sound.add("2fallenStick", {volume: 0.5}).play();	
			this.characterEntity.play(this.characterRun).setScale(2).toggleFlipX();

			const moveTo = this.components.addComponent(this.characterEntity, MoveTo);

			moveTo.setTarget({
				x: this.characterEntity.x + 1000,
				y: this.characterEntity.y,
			});

			moveTo.velocity = 250;

			setTimeout(() => {
					this.add.image(600,130,this.badEmotion).setScale(0.6);
					this.add.image(600,300,this.endText).setScale(0.6);					
					const replaybutton = this.add.image(1090,420,this.replayButton).setScale(0.6).setInteractive({ useHandCursor: true, pixelPerfect: true });
					this.sound.removeByKey("bark");
					this.sound.removeByKey("2fallenStick");
					this.sound.add("2badEmotionAudio", {volume: 1.5}).play();	
					
					setTimeout(() => {
						this.sound.add("2endTextAudio", {volume: 1.5}).play();
					}, 2500);
					replaybutton.on("pointerdown", () => {
						this.game.sound.removeByKey("2badEmotionAudio");
						this.game.sound.removeByKey("2endTextAudio");	
						this.scene.restart();
					});
					
			}, 3000);
		}, 2000);

		
	}

	//walk away (correct)
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

		setTimeout(() => {
			this.add.image(600,130,this.goodEmotion).setScale(0.6);
			this.add.image(600,300,this.endText).setScale(0.6);
			const continuebutton = this.add.image(1090,420,this.continueButton).setScale(0.6).setInteractive({ useHandCursor: true, pixelPerfect: true });
			this.sound.add("2goodEmotionAudio", {volume: 1.5}).play();	
					
			setTimeout(() => {
				this.sound.add("2endTextAudio", {volume: 1.5}).play();
			}, 3000);
			continuebutton.on("pointerdown", () => {
				this.game.sound.removeByKey("2goodEmotionAudio");
				this.game.sound.removeByKey("2endTextAudio");	
				WorldScene.scenario2Fininshed = true;		
				const badgeCaseImage = this.add.sprite(1000,550, this.badgeCase).setScale(0.4).setVisible(true).setAlpha(0).setDepth(5);
				const badgeS1Image = this.add.sprite(680,450, this.badgeS1).setScale(0.4).setVisible(WorldScene.scenario1Fininshed).setAlpha(0).setDepth(5);
				const badgeS2Image = this.add.sprite(1010,445, this.badgeS2).setScale(0.4).setVisible(WorldScene.scenario2Fininshed).setAlpha(0).setDepth(5);
				const badgeS3Image = this.add.sprite(1320,455, this.badgeS3).setScale(0.4).setVisible(WorldScene.scenario3Fininshed).setAlpha(0).setDepth(5);
				const badgeS4Image = this.add.sprite(690,755, this.badgeS4).setScale(0.4).setVisible(WorldScene.scenario4Fininshed).setAlpha(0).setDepth(5);
				const badgeS5Image = this.add.sprite(1010,765, this.badgeS5).setScale(0.4).setVisible(WorldScene.scenario5Fininshed).setAlpha(0).setDepth(5);
				const badgeS6Image = this.add.sprite(1310,750, this.badgeS6).setScale(0.4).setVisible(WorldScene.scenario6Fininshed).setAlpha(0).setDepth(5);
				//fade in effect
				this.add.tween({
					targets: [badgeCaseImage,badgeS1Image,badgeS3Image,badgeS4Image,badgeS5Image,badgeS6Image],
					ease: 'Sine.easeInOut',
					duration: 500,
					delay: 0,
					alpha: {
					  getStart: () => 0,
					  getEnd: () => 1					  
					}					
				  });
				  this.add.tween({
					targets: [badgeS2Image],
					ease: 'Sine.easeInOut',
					duration: 500,
					delay: 0,
					alpha: {
						getStart: () => 0,
						getEnd: () => 1					  
					  },
					scale: {
					  getStart: () => 3,
					  getEnd: () => 0.4					  
					}		
				  });
				  this.sound.add("badgeBling", {volume: 0.5}).play();
			  	    
				  setTimeout(() => {
						this.moveScene();
				  }, 4000);  
			});
		}, 3000);
	}

	//bark against dog (maybe)
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

		var bark = this.sound.add("bark");
		bark.play({
			loop: true
		});

		setTimeout(() => {
			this.add.image(600,130,this.mixedEmotion).setScale(0.6);
			this.add.image(600,300,this.endText).setScale(0.6);			
			const replaybutton = this.add.image(1090,420,this.replayButton).setScale(0.6).setInteractive({ useHandCursor: true, pixelPerfect: true });
			this.sound.removeByKey("bark");
			this.sound.add("2mixedEmotionAudio", {volume: 1.5}).play();	
					
			setTimeout(() => {
				this.sound.add("2endTextAudio", {volume: 1.5}).play();
			}, 3000);
			replaybutton.on("pointerdown", () => {
				this.game.sound.removeByKey("2mixedEmotionAudio");
						this.game.sound.removeByKey("2endTextAudio");	
				this.scene.restart();
			})
		}, 3000);
	}

	private moveScene() {
		fadeToBlack(this, () => {
			this.scene.stop(this.scene.key).wake(this.exitSceneKey);
			this.scene.start("UIScene");
		});
		this.game.sound.removeByKey("sceneSong");
		this.game.sound.removeByKey("bark");
		this.game.sound.resumeAll();
	}
}
