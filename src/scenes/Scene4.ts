import Background from "@assets/images/scenario_4/BG.png";
import CharacterRunSheet from "@assets/spritesheets/player/scenario/run/character_run.png";
import CharacterRunData from "@assets/spritesheets/player/scenario/run/character_run.json";
import CharacterWalkSheet from "@assets/spritesheets/player/scenario/walk/character_walk.png";
import CharacterWalkData from "@assets/spritesheets/player/scenario/walk/character_walk.json";
import Option1 from "@assets/images/scenario_4/option_1.png";
import Option2 from "@assets/images/scenario_4/option_2.png";
import Option3 from "@assets/images/scenario_4/option_3.png";
import OptionStick from "@assets/images/world/option_stick.png";
import BadgeCase from "@assets/images/UI/badges/badge_case.png";
import BadgeS1 from "@assets/images/UI/badges/badge_s1.png";
import BadgeS2 from "@assets/images/UI/badges/badge_s2.png";
import BadgeS3 from "@assets/images/UI/badges/badge_s3.png";
import BadgeS4 from "@assets/images/UI/badges/badge_s4.png";
import BadgeS5 from "@assets/images/UI/badges/badge_s5.png";
import BadgeS6 from "@assets/images/UI/badges/badge_s6.png";
import StartText from "@assets/images/scenario_4/start_text.png";
import EndText from "@assets/images/scenario_4/end_text.png";
import GoodEmotion from "@assets/images/world/correct_option.png";
import MixedEmotion from "@assets/images/world/almost_option.png";
import BadEmotion from "@assets/images/world/incorrect_option.png";
import ContinueButton from "@assets/images/UI/continue_button.png";
import ReplayButton from "@assets/images/UI/replay_button.png";
import Shrubbery from  "@assets/images/scenario_4/shrubbery.png";
import HuskyIdleLamppostData from "@assets/spritesheets/husky/husky_idle_lamppost.json";
import HuskyIdleLamppostSheet from "@assets/spritesheets/husky/husky_idle_lamppost.png";
import HuskyJumpLamppostData from "@assets/spritesheets/husky/husky_jump_lamppost.json";
import HuskyJumpLamppostSheet from "@assets/spritesheets/husky/husky_jump_lamppost.png";
import SparkleSheet from "@assets/spritesheets/UI/Sparkles.png";
import SparkleData from "@assets/spritesheets/UI/Sparkles.json";
import Ball from "@assets/images/scenario_4/ball.png";
import { Scene } from "phaser";
import SceneLifecycle from "../SceneLifecycle";
import ComponentService from "../Services/ComponentService";
import MakeFullscreen from "../Components/MakeFullscreen";
import WorldScene, { WorldSceneConfig } from "./WorldScene";
import { addFadeIn, fadeToBlack } from "../Utilities/Scene/Fader";
import MoveTo from "../Components/MoveTo";
import FixedHeightAnimator from "../Components/FixedHeightAnimator";
import { waitFor } from "../Utilities/Scene/SceneUtil";
import SettingsConfig = Phaser.Types.Scenes.SettingsConfig;
import Sprite = Phaser.GameObjects.Sprite;
import sceneSong from "@assets/audio/scene.mp3";
import bark from "@assets/audio/dog/regular_bark_4.mp3";
import BadgeBling from "@assets/audio/UI/badge_bling.mp3";

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

// Define the different movements for the ball. It is either stationary (not moving), moving to the left or moving to the right.
enum BallMovement {
	Stationary,
	Left,
	Right,
}

export default class Scene2 extends Scene implements SceneLifecycle {
	private components!: ComponentService;

	private characterEntity!: Sprite;

	private sparkleEntity!: Sprite;

	private sparkles!: string;

	private optionStick!: string;

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

	private characterWalk!: string;

	private characterRun!: string;

	private huskyEntity!: Sprite;

	private huskyIdleLamppost!: string;

	private huskyJumpLamppost!: string;

	private ballEntity!: Sprite;

	private ballMoving!: BallMovement;

	private exitSceneKey!: string;

	private option1!: string;

	private option2!: string;

	private option3!: string;

	private shrubbery!: string; 

	private characterWalkAnims!: Phaser.Animations.Animation[];

	private characterRunAnims!: Phaser.Animations.Animation[];

	private huskyJumpAnims!: Phaser.Animations.Animation[];

	private huskyIdleAnims!: Phaser.Animations.Animation[];

	constructor(cfg: SettingsConfig = config) {
		super(cfg);
	}

	public init(): void {
		this.characterWalk = "characterWalk4";
		this.characterRun = "spriteSheetPlayerCharacterRun4";
		this.huskyIdleLamppost = "huskyIdleLamppost";
		this.huskyJumpLamppost = "huskyJumpLamppost";
		this.option1 = "option14";
		this.option2 = "option24";
		this.option3 = "option34";
		this.optionStick = "stick4";
		this.badgeCase = "badgecase4";
        this.badgeS1 = "badges14";
        this.badgeS2 = "badges24";
        this.badgeS3 = "badges34";
        this.badgeS4 = "badges44";
        this.badgeS5 = "badges54";
        this.badgeS6 = "badges64";
		this.startText = "starttext4";
		this.endText = "endtext4";
		this.goodEmotion = "goodemotion4";
		this.mixedEmotion = "mixedemotion4";
		this.badEmotion = "bademotion4";
		this.continueButton = "continuebutton4";
		this.replayButton = "replaybutton4";
		this.shrubbery = "shrubbery"
		this.sparkles = "sparkles4";

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
		this.load.image("background4", Background);
		this.load.image("ball", Ball);
		this.load.image(this.shrubbery, Shrubbery);
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
		this.load.audio("sceneSong", sceneSong);
		this.load.audio("bark4", bark);
		this.load.audio("badgeBling", BadgeBling);
		this.load.aseprite(
			this.sparkles,
			 SparkleSheet,
			 SparkleData
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
			this.huskyIdleLamppost,
			HuskyIdleLamppostSheet,
			HuskyIdleLamppostData
		);

		this.load.aseprite(
			this.huskyJumpLamppost,
			HuskyJumpLamppostSheet,
			HuskyJumpLamppostData
		);
	}

	public create(): void {
		this.game.sound.pauseAll();
		var song = this.sound.add("sceneSong", {volume: 0.1});
		song.play({
			loop: true
		});
		const centerX = this.scale.displaySize.width * 0.5;
		const centerY = this.scale.displaySize.height * 0.5;

		const img = this.add.image(centerX, centerY, "background4");
		this.add.image(300, 885, this.shrubbery).setDepth(3).setScale(1.2);
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
		this.characterEntity = this.add.sprite(2100, 600, this.characterWalk).setDepth(2);

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

		this.ballEntity.setDepth(1)

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
		const startTextImage = this.add.image(600,200,this.startText).setScale(0.6);
		//create stick 1 and sign 1, add movecomponents
		const stick1 = this.add.image(500,1280, this.optionStick).setDepth(3);
		const stick1move = this.components.addComponent(
			stick1,
			MoveTo
		);
		stick1move.setTarget({
			x: stick1.x,
			y: stick1.y - 300,
		});		
		stick1move.velocity = 280;
		const button1 = this.add.image(500, 1200, this.option1).setDepth(3);
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
		const stick2 = this.add.image(1000,1280, this.optionStick).setDepth(3);
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
		const button2 = this.add.image(1000, 1200, this.option2).setDepth(3);
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
			var bark = this.sound.add("bark4", {volume: 0.8});
			bark.play({
				loop: true
			});

			this.characterEntity.toggleFlipX().play({
				key: this.characterRunAnims[0].key,
				repeat: -1,
			});

			moveTo.setTarget({
				x: this.characterEntity.x + 1250,
				y: this.characterEntity.y + 50,
			});

			moveTo.velocity = 300;

			moveTo.movingDone = () => {
				this.characterEntity.stop();
				this.add.image(600,130,this.badEmotion).setScale(0.6);
				this.add.image(600,300,this.endText).setScale(0.6);					
				const replaybutton = this.add.image(1090,420,this.replayButton).setScale(0.6).setInteractive({ useHandCursor: true, pixelPerfect: true });
				replaybutton.on("pointerdown", () => {
					this.scene.restart();
				});		
			};
		};
	}

	private createResult2() {
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
			y: this.characterEntity.y + 250,
		});

		moveTo.velocity = 150;

		moveTo.movingDone = () => {
			this.characterEntity.play({
				key: this.characterWalkAnims[0].key,
				repeat: -1,
			});
	
			const moveTo = this.components.addComponent(
				this.characterEntity,
				MoveTo
			);
	
			moveTo.setTarget({
				x: this.characterEntity.x - 1000,
				y: this.characterEntity.y,
			});
	
			moveTo.velocity = 150;
			moveTo.movingDone = () => {
			this.add.image(600,130,this.goodEmotion).setScale(0.6);
			this.add.image(600,300,this.endText).setScale(0.6);				
			const continuebutton = this.add.image(1090,420,this.continueButton).setScale(0.6).setInteractive({ useHandCursor: true, pixelPerfect: true });
			continuebutton.on("pointerdown", () => {
				continuebutton.disableInteractive();
				WorldScene.scenario4Fininshed = true;		
				const badgeCaseImage = this.add.sprite(1000,550, this.badgeCase).setScale(0.4).setVisible(true).setAlpha(0).setDepth(5);
				const badgeS1Image = this.add.sprite(680,450, this.badgeS1).setScale(0.4).setVisible(WorldScene.scenario1Fininshed).setAlpha(0).setDepth(5);
				const badgeS2Image = this.add.sprite(1010,445, this.badgeS2).setScale(0.4).setVisible(WorldScene.scenario2Fininshed).setAlpha(0).setDepth(5);
				const badgeS3Image = this.add.sprite(1320,455, this.badgeS3).setScale(0.4).setVisible(WorldScene.scenario3Fininshed).setAlpha(0).setDepth(5);
				const badgeS4Image = this.add.sprite(690,755, this.badgeS4).setScale(0.4).setVisible(WorldScene.scenario4Fininshed).setAlpha(0).setDepth(5);
				const badgeS5Image = this.add.sprite(1010,765, this.badgeS5).setScale(0.4).setVisible(WorldScene.scenario5Fininshed).setAlpha(0).setDepth(5);
				const badgeS6Image = this.add.sprite(1310,750, this.badgeS6).setScale(0.4).setVisible(WorldScene.scenario6Fininshed).setAlpha(0).setDepth(5);
				//fade in effect
				this.add.tween({
					targets: [badgeCaseImage,badgeS1Image,badgeS2Image,badgeS3Image,badgeS5Image,badgeS6Image],
					ease: 'Sine.easeInOut',
					duration: 500,
					delay: 0,
					alpha: {
					  getStart: () => 0,
					  getEnd: () => 1					  
					}					
				  });
				  this.add.tween({
					targets: [badgeS4Image],
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
				  this.anims.create({
					key: this.sparkles,
					frameRate: 4,
					frames: this.anims.generateFrameNumbers(
						this.sparkles,
						{
							start: 0,
							end: 1,
						}
					),
					repeat: -1,
				});
				this.sparkleEntity = this.add.sprite(
					670,
					770,
					this.sparkles
				)
				
				this.sparkleEntity.play(this.sparkles).setScale(0.7).setDepth(6);
			  	    
				  setTimeout(() => {
						this.moveScene();
				  }, 4000);  
			});
			}
		}
	}

	private createResult3() {
		this.huskyEntity.play({ key: this.huskyJumpAnims[0].key, repeat: -1 });
		var bark = this.sound.add("bark4", {volume: 0.8});
		bark.play({
			loop: true
		});

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
			x: this.characterEntity.x + 900,
			y: this.characterEntity.y + 50,
		});

		moveToPlayer.velocity = 300;

		moveToPlayer.movingDone = () => {
			this.characterEntity.stop();
			this.add.image(600,130,this.mixedEmotion).setScale(0.6);
			this.add.image(600,300,this.endText).setScale(0.6);					
			const replaybutton = this.add.image(1090,420,this.replayButton).setScale(0.6).setInteractive({ useHandCursor: true, pixelPerfect: true });
			replaybutton.on("pointerdown", () => {
				this.scene.restart();
			});
		};
	}

	

	private moveScene() {
		fadeToBlack(this, () => {
			this.scene.stop(this.scene.key).wake(this.exitSceneKey);
			this.scene.start("UIScene");
		});
		this.game.sound.removeByKey("sceneSong");
		this.game.sound.removeByKey("bark4");
		this.game.sound.resumeAll();
	}
}
