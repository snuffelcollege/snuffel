import BackgroundImage from "@assets/images/scenario_6/BG.png";
import Car from "@assets/images/scenario_6/car.png";
import Option1 from "@assets/images/scenario_6/option_1.png";
import Option2 from "@assets/images/scenario_6/option_2.png";
import Option3 from "@assets/images/scenario_6/option_3.png";
import StartText from "@assets/images/scenario_6/start_text.png";
import EndText from "@assets/images/scenario_6/end_text.png";
import CharacterWalkSheet from "@assets/spritesheets/player/scenario/walk/character_walk.png";
import CharacterWalkData from "@assets/spritesheets/player/scenario/walk/character_walk.json";
import CharacterRunSheet from "@assets/spritesheets/player/scenario/run/character_run.png";
import CharacterRunData from "@assets/spritesheets/player/scenario/run/character_run.json";
import CharacterIdleSheet from "@assets/spritesheets/player/scenario/idle/character_idle.png";
import CharacterIdleData from "@assets/spritesheets/player/scenario/idle/character_idle.json";
import CharacterKnockSheet from "@assets/spritesheets/scenario_6/boy_knock.png";
import CharacterKnockData from "@assets/spritesheets/scenario_6/boy_knock.json";
import CharacterArmSheet from "@assets/spritesheets/scenario_6/boy_arm.png";
import CharacterArmData from "@assets/spritesheets/scenario_6/boy_arm.json";
import DogNeutralImage from "@assets/spritesheets/scenario_6/dog_neutral.png";
import DogNeutralData from "@assets/spritesheets/scenario_6/dog_neutral.json";
import DogBiteImage from "@assets/spritesheets/scenario_6/dog_bite.png";
import DogBiteData from "@assets/spritesheets/scenario_6/dog_bite.json";
import { Scene } from "phaser";
import SceneLifecycle from "../SceneLifecycle";
import { addFadeIn, fadeToBlack } from "../Utilities/Scene/Fader";
import ComponentService from "../Services/ComponentService";
import MakeFullscreen from "../Components/MakeFullscreen";
import WorldScene, { WorldSceneConfig } from "./WorldScene";
import MoveTo from "../Components/MoveTo";
import SettingsConfig = Phaser.Types.Scenes.SettingsConfig;
import Sprite = Phaser.GameObjects.Sprite;
import bark from "@assets/audio/dog/small_bark_1.mp3";
import knock from "@assets/audio/player/knocks_car_window.mp3";
import StartTextAudio from "@assets/audio/scenario_6/start_text.mp3";
import EndTextAudio from "@assets/audio/scenario_6/end_text.mp3";
import Option1Audio from "@assets/audio/scenario_6/option_1.mp3";
import Option2Audio from "@assets/audio/scenario_6/option_2.mp3";
import Option3Audio from "@assets/audio/scenario_6/option_3.mp3";

// Config for the scene defining gravity and debug settings.
export const config: SettingsConfig = {
	active: false,
	key: "scene-6",
	physics: {
		default: "arcade",
		arcade: {
			gravity: { y: 0 },
			debug: process.env.NODE_ENV === "development",
		},
	},
};

export default class Scene1 extends Scene implements SceneLifecycle {
	private components!: ComponentService;

	private characterEntity!: Sprite; //embodiement of character, uses walk and idle animations
	
	private sparkleEntity!: Sprite;

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

	private option1!: string;

	private option2!: string;

	private option3!: string;

	private startText!: string;

	private endText!: string;

	private exitSceneKey!: string;

	constructor(cfg: SettingsConfig = config) {
		super(cfg);
	}

	public init(): void {

		//initializes variables, the string value has to be unique or phaser will reuse it in other scenes
		this.car = "car"
		this.option1 = "option16";
		this.option2 = "option26";
		this.option3 = "option36";
		this.startText = "starttext6";
		this.endText = "endtext6";
		this.characterWalk = "characterWalk6";
		this.characterIdle = "characterIdle6";
		this.characterRun = "characterRun6";
		this.characterKnock = "characterKnock6";
		this.characterArm = "characterArm6";
		this.dogIdleAnimation = "dogidleanimation6";
		this.dogBiteAnimation = "dogbiteanimation6";

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
		this.load.image("background6", BackgroundImage);
		this.load.image(this.car, Car);
		this.load.image(this.option1, Option1);
		this.load.image(this.option2, Option2);
		this.load.image(this.option3, Option3);
		this.load.image(this.startText,StartText);
		this.load.image(this.endText, EndText);
		this.load.audio("bark6", bark);
		this.load.audio("knock6", knock);
		this.load.audio("6starttextaudio",StartTextAudio);
		this.load.audio("6endtextaudio", EndTextAudio);
		this.load.audio("6option1audio", Option1Audio);
		this.load.audio("6option2audio", Option2Audio);
		this.load.audio("6option3audio", Option3Audio);
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
		const img = this.add.image(centerX, centerY, "background6");
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
		const startTextImage = this.add.image(600,200,this.startText).setScale(0.6);
		this.sound.add("6starttextaudio", {volume: 1}).play();
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
			this.game.sound.removeByKey("6starttextaudio");
			this.sound.add("6option1audio", {volume: 1}).play();
			button1.angle = 5;			
		});
		button1.on('pointerout',() => {
			this.game.sound.removeByKey("6option1audio");
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
			this.game.sound.removeByKey("6starttextaudio");
			this.sound.add("6option2audio", {volume: 1}).play();
			button2.angle = 5;			
		});
		button2.on('pointerout',() => {
			this.game.sound.removeByKey("6option2audio");
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
			this.game.sound.removeByKey("6starttextaudio");
			this.sound.add("6option3audio", {volume: 1}).play();
			button3.angle = 5;			
		});
		button3.on('pointerout',() => {
			this.game.sound.removeByKey("6option3audio");
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
				button2.disableInteractive()
				button3.disableInteractive()				
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
				button1.disableInteractive()
				button2.disableInteractive()
				button3.disableInteractive()
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
				button1.disableInteractive()
				button2.disableInteractive()
				button3.disableInteractive()
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
				startTextImage.destroy();
				this.createResult3();
			});
	}

	//knock on car window (maybe)
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
			var knock = this.sound.add("knock6");
			knock.play();
			this.characterEntity
			.toggleFlipX()
			.play({ key: this.characterKnockAnims[0].key, repeat: -1,frameRate:5 })
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
					repeat: -1
				});
				this.DogEntity.setFrame(this.dogBiteAnimation);//overwrites old frame
				this.DogEntity.play(this.dogBiteAnimation).setScale(.8);
				var bark = this.sound.add("bark6");
					bark.play({
						loop: true
					});
				//run animation
				this.characterEntity
				.play({ key: this.characterRunAnims[0].key, repeat: -1})
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

		setTimeout(() => {
			this.add.image(600,130,"mixedemotion").setScale(0.6);
			this.add.image(600,300,this.endText).setScale(0.6);					
			this.sound.removeByKey("bark6");
			this.sound.add("mixedemotionaudio", {volume: 1}).play();	
					
			setTimeout(() => {
				this.sound.add("6endtextaudio", {volume: 1}).play();
				const replaybutton = this.add.image(1090,360,"replaybutton").setScale(0.6).setInteractive({ useHandCursor: true, pixelPerfect: true });
				replaybutton.on("pointerdown", () => {
					this.game.sound.removeByKey("mixedemotionaudio");
					this.game.sound.removeByKey("6endtextaudio");
					this.scene.restart();
				});		
			}, 3000);//good & mixed = 3000
				
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
					repeat: -1
				});
				this.DogEntity.setFrame(this.dogBiteAnimation);//overwrites old frame
				this.DogEntity.play(this.dogBiteAnimation).setScale(.8);
				var bark = this.sound.add("bark6");
					bark.play({
						loop: true
					});
				//run animation
				this.characterEntity
				.play({ key: this.characterRunAnims[0].key, repeat: -1})
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
		setTimeout(() => {
					this.add.image(600,130,"bademotion").setScale(0.6);
					this.add.image(600,300,this.endText).setScale(0.6);					
					
					this.sound.removeByKey("bark6");
					this.sound.add("bademotionaudio", {volume: 1}).play();	
					
					setTimeout(() => {
						this.sound.add("6endtextaudio", {volume: 1}).play();
						const replaybutton = this.add.image(1090,360,"replaybutton").setScale(0.6).setInteractive({ useHandCursor: true, pixelPerfect: true });
						replaybutton.on("pointerdown", () => {
							this.game.sound.removeByKey("bademotionaudio");
							this.game.sound.removeByKey("6endtextaudio");
							this.scene.restart();
						});		
					}, 2500);//good & mixed = 3000
								
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

		setTimeout(() => {
			this.add.image(600,130,"goodemotion").setScale(0.6);
			this.add.image(600,300,this.endText).setScale(0.6);				
			
			
			this.sound.add("goodemotionaudio", {volume: 1}).play();	
					
			setTimeout(() => {
				this.sound.add("6endtextaudio", {volume: 1}).play();
				const continuebutton = this.add.image(1090,360,"continuebutton").setScale(0.6).setInteractive({ useHandCursor: true, pixelPerfect: true });
				continuebutton.on("pointerdown", () => {				
					this.game.sound.removeByKey("goodemotionaudio");
					this.game.sound.removeByKey("6endtextaudio");
					continuebutton.disableInteractive();
					WorldScene.scenario6Fininshed = true;		
					
					const badgeCaseImage = this.add.sprite(960,550, "badgecase").setScale(0.6).setVisible(true).setAlpha(0).setDepth(3);
					const badgeS1Image = this.add.sprite(512,482, "badge1").setScale(0.6).setVisible(WorldScene.scenario1Fininshed).setAlpha(0).setDepth(4);
					const badgeS2Image = this.add.sprite(736,481, "badge2").setScale(0.6).setVisible(WorldScene.scenario2Fininshed).setAlpha(0).setDepth(4);
					const badgeS3Image = this.add.sprite(966,481, "badge3").setScale(0.6).setVisible(WorldScene.scenario3Fininshed).setAlpha(0).setDepth(4);
					const badgeS4Image = this.add.sprite(1200,481, "badge4").setScale(0.6).setVisible(WorldScene.scenario4Fininshed).setAlpha(0).setDepth(4);
					const badgeS5Image = this.add.sprite(1430,481, "badge5").setScale(0.6).setVisible(WorldScene.scenario5Fininshed).setAlpha(0).setDepth(4);
					const badgeS6Image = this.add.sprite(512,690, "badge6").setScale(0.6).setVisible(WorldScene.scenario6Fininshed).setAlpha(0).setDepth(4);
					const badgeS7Image = this.add.sprite(745,690, "badge7").setScale(0.6).setVisible(WorldScene.scenario7Fininshed).setAlpha(0).setDepth(4);
					const badgeS8Image = this.add.sprite(970,690, "badge8").setScale(0.6).setVisible(WorldScene.scenario8Fininshed).setAlpha(0).setDepth(4);
					const badgeS9Image = this.add.sprite(1205,690, "badge9").setScale(0.6).setVisible(WorldScene.scenario9Fininshed).setAlpha(0).setDepth(4);
					const badgeS10Image = this.add.sprite(1430,690, "badge10").setScale(0.6).setVisible(WorldScene.scenario10Fininshed).setAlpha(0).setDepth(4);
					
					//fade in effect
					this.add.tween({
						targets: [badgeCaseImage,badgeS1Image,badgeS2Image,badgeS3Image,badgeS4Image,badgeS5Image,badgeS7Image,badgeS8Image,badgeS9Image,badgeS10Image],
						ease: 'Sine.easeInOut',
						duration: 500,
						delay: 0,
						alpha: {
						  getStart: () => 0,
						  getEnd: () => 1					  
						}					
					  });
					  this.add.tween({
						targets: [badgeS6Image],
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
						512,
						690,
						"sparkles"
					)
					
					this.sparkleEntity.play("sparkles").setScale(0.7).setDepth(6);
					  setTimeout(() => {
							this.moveScene();
					  }, 4000);  
				});				
			}, 3000);//good & mixed = 3000			
		}, 5000);
	}

	//fade to black and back to overworld
	private moveScene() {
		fadeToBlack(this, () => {
			this.scene.stop(this.scene.key).wake(this.exitSceneKey);
			this.scene.start("UIScene");
		});
	}
}
