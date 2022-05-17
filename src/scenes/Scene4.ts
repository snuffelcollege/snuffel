import Background from "@assets/images/scenario_4/BG.png";
import CharacterRunSheet from "@assets/spritesheets/player/scenario/run/character_run.png";
import CharacterRunData from "@assets/spritesheets/player/scenario/run/character_run.json";
import CharacterWalkSheet from "@assets/spritesheets/player/scenario/walk/character_walk.png";
import CharacterWalkData from "@assets/spritesheets/player/scenario/walk/character_walk.json";
import Option1 from "@assets/images/scenario_4/option_1.png";
import Option2 from "@assets/images/scenario_4/option_2.png";
import Option3 from "@assets/images/scenario_4/option_3.png";
import StartText from "@assets/images/scenario_4/start_text.png";
import EndText from "@assets/images/scenario_4/end_text.png";
import Shrubbery from  "@assets/images/scenario_4/shrubbery.png";
import HuskyIdleLamppostData from "@assets/spritesheets/husky/husky_idle_lamppost.json";
import HuskyIdleLamppostSheet from "@assets/spritesheets/husky/husky_idle_lamppost.png";
import HuskyJumpLamppostData from "@assets/spritesheets/husky/husky_jump_lamppost.json";
import HuskyJumpLamppostSheet from "@assets/spritesheets/husky/husky_jump_lamppost.png";
import Ball from "@assets/images/scenario_4/ball.png";
import { Scene } from "phaser";
import SceneLifecycle from "../SceneLifecycle";
import ComponentService from "../Services/ComponentService";
import MakeFullscreen from "../Components/MakeFullscreen";
import WorldScene, { WorldSceneConfig } from "./WorldScene";
import { addFadeIn, fadeToBlack } from "../Utilities/Scene/Fader";
import MoveTo from "../Components/MoveTo";
import SettingsConfig = Phaser.Types.Scenes.SettingsConfig;
import Sprite = Phaser.GameObjects.Sprite;
import bark from "@assets/audio/dog/regular_bark_4.mp3"
import StartTextAudio from "@assets/audio/scenario_4/start_text.mp3";
import EndTextAudio from "@assets/audio/scenario_4/end_text.mp3";
import Option1Audio from "@assets/audio/scenario_4/option_1.mp3";
import Option2Audio from "@assets/audio/scenario_4/option_2.mp3";
import Option3Audio from "@assets/audio/scenario_4/option_3.mp3";

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

	private startText!: string;

	private endText!: string;

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
		this.startText = "starttext4";
		this.endText = "endtext4";
		this.shrubbery = "shrubbery";

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
		this.load.image(this.startText,StartText);
		this.load.image(this.endText, EndText);	
		this.load.audio("bark4", bark);
		this.load.audio("4starttextaudio",StartTextAudio);
		this.load.audio("4endtextaudio", EndTextAudio);
		this.load.audio("4option1audio", Option1Audio);
		this.load.audio("4option2audio", Option2Audio);
		this.load.audio("4option3audio", Option3Audio);
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
		this.sound.add("4starttextaudio", {volume: 1}).play();
		//create stick 1 and sign 1, add movecomponents
		const stick1 = this.add.image(500,1280, "stick").setDepth(3);
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
			this.game.sound.removeByKey("4starttextaudio");
			this.sound.add("4option1audio", {volume: 1}).play();
			button1.angle = 5;			
		});
		button1.on('pointerout',() => {
			this.game.sound.removeByKey("4option1audio");
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
		const stick2 = this.add.image(1000,1280, "stick").setDepth(3);
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
			this.game.sound.removeByKey("4starttextaudio");
			this.sound.add("4option2audio", {volume: 1}).play();
			button2.angle = 5;			
		});
		button2.on('pointerout',() => {
			this.game.sound.removeByKey("4option2audio");
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
			this.game.sound.removeByKey("4starttextaudio");
			this.sound.add("4option3audio", {volume: 1}).play();
			button3.angle = 5;			
		});
		button3.on('pointerout',() => {
			this.game.sound.removeByKey("4option3audio");
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
				this.add.image(600,130,"bademotion").setScale(0.6);
				this.add.image(600,300,this.endText).setScale(0.6);					
				const replaybutton = this.add.image(1090,360,"replaybutton").setScale(0.6).setInteractive({ useHandCursor: true, pixelPerfect: true });
				this.game.sound.removeByKey("bark4");
				this.sound.add("bademotionaudio", {volume: 1}).play();	
					
					setTimeout(() => {
						this.sound.add("4endtextaudio", {volume: 1}).play();
					}, 2500);
				replaybutton.on("pointerdown", () => {
					this.game.sound.removeByKey("bademotionaudio");
					this.game.sound.removeByKey("4endtextaudio");	
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
			this.add.image(600,130,"goodemotion").setScale(0.6);
			this.add.image(600,300,this.endText).setScale(0.6);				
			const continuebutton = this.add.image(1090,360,"continuebutton").setScale(0.6).setInteractive({ useHandCursor: true, pixelPerfect: true });
			this.sound.add("goodemotionaudio", {volume: 1}).play();	
					
					setTimeout(() => {
						this.sound.add("4endtextaudio", {volume: 1}).play();
					}, 3000);//good & mixed = 3000
			continuebutton.on("pointerdown", () => {
				this.game.sound.removeByKey("goodemotionaudio");
				this.game.sound.removeByKey("4endtextaudio");	
				continuebutton.disableInteractive();
				WorldScene.scenario4Fininshed = true;		
				
				const badgeCaseImage = this.add.sprite(960,550, "badgecase").setScale(0.6).setVisible(true).setAlpha(0).setDepth(5);
				const badgeS1Image = this.add.sprite(512,482, "badge1").setScale(0.6).setVisible(WorldScene.scenario1Fininshed).setAlpha(0).setDepth(5);
				const badgeS2Image = this.add.sprite(736,481, "badge2").setScale(0.6).setVisible(WorldScene.scenario2Fininshed).setAlpha(0).setDepth(5);
				const badgeS3Image = this.add.sprite(966,481, "badge3").setScale(0.6).setVisible(WorldScene.scenario3Fininshed).setAlpha(0).setDepth(5);
				const badgeS4Image = this.add.sprite(1200,481, "badge4").setScale(0.6).setVisible(WorldScene.scenario4Fininshed).setAlpha(0).setDepth(5);
				const badgeS5Image = this.add.sprite(1430,481, "badge5").setScale(0.6).setVisible(WorldScene.scenario5Fininshed).setAlpha(0).setDepth(5);
				const badgeS6Image = this.add.sprite(512,690, "badge6").setScale(0.6).setVisible(WorldScene.scenario6Fininshed).setAlpha(0).setDepth(5);
				const badgeS7Image = this.add.sprite(745,690, "badge7").setScale(0.6).setVisible(WorldScene.scenario7Fininshed).setAlpha(0).setDepth(5);
				const badgeS8Image = this.add.sprite(970,690, "badge8").setScale(0.6).setVisible(WorldScene.scenario8Fininshed).setAlpha(0).setDepth(5);
				const badgeS9Image = this.add.sprite(1205,690, "badge9").setScale(0.6).setVisible(WorldScene.scenario9Fininshed).setAlpha(0).setDepth(5);
				const badgeS10Image = this.add.sprite(1430,690, "badge10").setScale(0.6).setVisible(WorldScene.scenario11Fininshed).setAlpha(0).setDepth(5);
				
				//fade in effect
				this.add.tween({
					targets: [badgeCaseImage,badgeS1Image,badgeS2Image,badgeS3Image,badgeS5Image,badgeS6Image,badgeS7Image,badgeS8Image,badgeS9Image,badgeS10Image],
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
					  getEnd: () => 0.6				  
					}		
				  });
				  this.sound.add("badgebling", {volume: 0.5}).play();
				  this.anims.create({
					key: "sparkles",
					frameRate: 4,
					frames: this.anims.generateFrameNumbers(
						"sparkles",
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
					"sparkles"
				)
				
				this.sparkleEntity.play("sparkles").setScale(0.7).setDepth(6);
			  	    
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
			this.add.image(600,130,"mixedemotion").setScale(0.6);
			this.add.image(600,300,this.endText).setScale(0.6);					
			const replaybutton = this.add.image(1090,360,"replaybutton").setScale(0.6).setInteractive({ useHandCursor: true, pixelPerfect: true });
			this.game.sound.removeByKey("bark4");
			this.sound.add("mixedemotionaudio", {volume: 1}).play();						
			setTimeout(() => {
				this.sound.add("4endtextaudio", {volume: 1}).play();
			}, 3000);
			replaybutton.on("pointerdown", () => {
				this.game.sound.removeByKey("mixedemotionaudio");
				this.game.sound.removeByKey("4endtextaudio");	
				this.scene.restart();
			});
		};
	}

	

	private moveScene() {
		fadeToBlack(this, () => {
			this.scene.stop(this.scene.key).wake(this.exitSceneKey);
			this.scene.start("UIScene");
		});
	}
}
