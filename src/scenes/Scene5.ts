import BackgroundImage from "@assets/images/scenario_5/BG.png";
import RayIdle from "@assets/spritesheets/scenario_5/dogidle.png";
import RayData from "@assets/spritesheets/scenario_5/dogidle.json";
import RayWag from "@assets/spritesheets/scenario_5/dogwag.png";
import RayWagData from "@assets/spritesheets/scenario_5/dogwag.json";
import AbyIdle from "@assets/spritesheets/scenario_5/abyidle.png";
import AbyData from "@assets/spritesheets/scenario_5/abyidle.json";
import AbyAngry from "@assets/spritesheets/scenario_5/abyangry.png";
import AbyAngryData from "@assets/spritesheets/scenario_5/abyangry.json";
import BoyBark from "@assets/spritesheets/scenario_5/boybark.png";
import BoyBarkData from "@assets/spritesheets/scenario_5/boybark.json";
import BoyPet from "@assets/spritesheets/scenario_5/boypet.png";
import BoyPetData from "@assets/spritesheets/scenario_5/boypet.json";
import Option1 from "@assets/images/scenario_5/option_1.png";
import Option2 from "@assets/images/scenario_5/option_2.png";
import Option3 from "@assets/images/scenario_5/option_3.png";
import OptionStick from "@assets/images/world/option_stick.png";
import BadgeCase from "@assets/images/UI/badges/badge_case.png";
import BadgeS1 from "@assets/images/UI/badges/badge_s1.png";
import BadgeS2 from "@assets/images/UI/badges/badge_s2.png";
import BadgeS3 from "@assets/images/UI/badges/badge_s3.png";
import BadgeS4 from "@assets/images/UI/badges/badge_s4.png";
import BadgeS5 from "@assets/images/UI/badges/badge_s5.png";
import BadgeS6 from "@assets/images/UI/badges/badge_s6.png";
import StartText from "@assets/images/scenario_5/start_text.png";
import EndText from "@assets/images/scenario_5/end_text.png";
import GoodEmotion from "@assets/images/world/correct_option.png";
import MixedEmotion from "@assets/images/world/almost_option.png";
import BadEmotion from "@assets/images/world/incorrect_option.png";
import ContinueButton from "@assets/images/UI/continue_button.png";
import ReplayButton from "@assets/images/UI/replay_button.png";
import CharacterWalkSheet from "@assets/spritesheets/player/scenario/walk/character_walk.png";
import CharacterWalkData from "@assets/spritesheets/player/scenario/walk/character_walk.json";
import CharacterRunSheet from "@assets/spritesheets/player/scenario/run/character_run.png";
import CharacterRunData from "@assets/spritesheets/player/scenario/run/character_run.json";
import CharacterIdleSheet from "@assets/spritesheets/player/scenario/idle/character_idle.png";
import CharacterIdleData from "@assets/spritesheets/player/scenario/idle/character_idle.json";
import SparkleSheet from "@assets/spritesheets/UI/Sparkles.png";
import SparkleData from "@assets/spritesheets/UI/Sparkles.json";
import CatSheet from "@assets/spritesheets/scenario_5/collin.png";
import CatData from "@assets/spritesheets/scenario_5/collin.json";
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
import squeal from "@assets/audio/dog/squeal_1.mp3";
import meow from "@assets/audio/cat/cat_meow_1.mp3";
import BadgeBling from "@assets/audio/UI/badge_bling.mp3";

// Config for the scene defining gravity and debug settings.
export const config: SettingsConfig = {
	active: false,
	key: "scene-5",
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

	private sparkleEntity!: Sprite;

	private sparkles!: string;

	private characterWalkAnims!: Phaser.Animations.Animation[]; // push character walk

	private characterWalk!: string; //aseprite of character walking

	private characterRunAnims!: Phaser.Animations.Animation[]; // push character walk

	private characterRun!: string; //aseprite of character walking

	private characterIdle!: string;//aseprite of character idling

	private rayIdle!: string;

	private rayWag!: string;

	private abyIdle!: string;
	
	private abyAngry!: string;

	private boyBark!: string;

	private boyPet!: string;

	private DogEntity!: Sprite; //entity that uses dog animation

	private AbyEntity!: Sprite;

	private CatEntity!: Sprite;

	private catMeow!: string;

	private option1!: string;

	private option2!: string;

	private option3!: string;

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

	private exitSceneKey!: string;


	constructor(cfg: SettingsConfig = config) {
		super(cfg);
	}

	public init(): void {

		//initializes variables, the string value has to be unique or phaser will reuse it in other scenes
		this.option1 = "option15";
		this.option2 = "option25";
		this.option3 = "option35";
		this.optionStick = "stick5";
		this.badgeCase = "badgecase5";
        this.badgeS1 = "badges15";
        this.badgeS2 = "badges25";
        this.badgeS3 = "badges35";
        this.badgeS4 = "badges45";
        this.badgeS5 = "badges55";
        this.badgeS6 = "badges65";
		this.startText = "starttext5";
		this.endText = "endtext5";
		this.goodEmotion = "goodemotion5";
		this.mixedEmotion = "mixedemotion5";
		this.badEmotion = "bademotion5";
		this.continueButton = "continuebutton5";
		this.replayButton = "replaybutton5";
		this.characterWalk = "characterWalk5";
		this.characterIdle = "characterIdle5";
		this.characterRun = "characterRun5";
		this.rayIdle = "rayIdle";
		this.abyIdle = "abyIdle";
		this.boyBark = "boyBark";
		this.boyPet = "boyPet";
		this.rayWag = "rayWag";
		this.abyAngry = "abyAngry";
		this.catMeow = "catMeow";
		this.sparkles = "sparkles5";

		if (!WorldSceneConfig.key) {
			throw Error("Exit scene key is undefined");
		}

		this.exitSceneKey = WorldSceneConfig.key;

		this.components = new ComponentService();

		this.characterWalkAnims = [];
		this.characterRunAnims = [];
		// The moment the scene renders, a fade from black is started using this function.
		addFadeIn(this);
	}

	// A key has to be unique for the entire project, not just this scene.
	public preload(): void {
		//assigns background to 'background4' string
		this.load.image("background5", BackgroundImage);
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
		this.load.audio("squeal5", squeal);
		this.load.audio("meow", meow);
		this.load.audio("badgeBling", BadgeBling);
		this.load.aseprite(
			this.sparkles,
			 SparkleSheet,
			 SparkleData
		);
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
			this.rayIdle,
			RayIdle,
			RayData
		);
		this.load.aseprite(
			this.rayWag,
			RayWag,
			RayWagData
		);
		this.load.aseprite(
			this.abyIdle,
			AbyIdle,
			AbyData
		);
		this.load.aseprite(
			this.abyAngry,
			AbyAngry,
			AbyAngryData
		);
		this.load.aseprite(
			this.boyBark,
			BoyBark,
			BoyBarkData
		);
		this.load.aseprite(
			this.boyPet,
			BoyPet,
			BoyPetData
		);
		this.load.aseprite(
			this.catMeow,
			CatSheet,
			CatData
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
		
		//loads background from 'background5' string. this isn't stored in a local variable because of a bug where the wrong background was loaded in certain scenes.
		const img = this.add.image(centerX, centerY, "background5");
		this.components.addComponent(img, MakeFullscreen);

		this.characterWalkAnims.push(
			...this.anims.createFromAseprite(this.characterWalk)
		);
		this.characterRunAnims.push(
			...this.anims.createFromAseprite(this.characterRun)
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
		this.characterEntity = this.add.sprite(650,700,this.characterIdle).toggleFlipX();
		this.characterEntity.play(this.characterIdle).setScale(1);

		//dog animation
		this.anims.create({
			key: this.rayIdle,
			frameRate: 2,
			frames: this.anims.generateFrameNumbers(
				this.rayIdle,
				{
					start: 1,
					end: 0,
				}
			),
			repeat: -1,
		});
		this.DogEntity = this.add.sprite(1200,750,this.rayIdle);
		this.DogEntity.play(this.rayIdle).setScale(1);

		this.anims.create({
			key: this.abyIdle,
			frameRate: 2,
			frames: this.anims.generateFrameNumbers(
				this.abyIdle,
				{
					start: 0,
					end: 1,
				}
			),
			repeat: -1,
		});
		this.AbyEntity = this.add.sprite(1050,580,this.abyIdle);
		this.AbyEntity.play(this.abyIdle).setScale(1);

		this.anims.create({
			key: this.catMeow,
			frameRate: 2,
			frames: this.anims.generateFrameNumbers(
				this.catMeow,
				{
					start: 0,
					end: 1,
				}
			),
			repeat: 1,
		});
		this.CatEntity = this.add.sprite(125,725,this.catMeow).setInteractive();
		this.CatEntity.on('pointerdown',  () => {
			this.CatEntity.play(this.catMeow);
				var meow = this.sound.add("meow");
				meow.play({
					loop: false
				});
		}, this);

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
		const button1 = this.add.image(500, 1200, this.option1).setScale(0.5);
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
		const button2 = this.add.image(1000, 1200, this.option2).setScale(0.5);
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
		const button3 = this.add.image(1500, 1200, this.option3).setScale(0.5);
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

	private createResult1(): void {
		this.anims.create({
			key: this.boyBark,
			frameRate: 2,
			frames: this.anims.generateFrameNumbers(
				this.boyBark,
				{
					start: 1,
					end: 0,
				}
			),
			repeat: -1,
		});
		this.characterEntity.play(this.boyBark).setScale(1).toggleFlipX();

		this.anims.create({
			key: this.abyAngry,
			frameRate: 2,
			frames: this.anims.generateFrameNumbers(
				this.abyAngry,
				{
					start: 1,
					end: 0,
				}
			),
			repeat: -1,
		});
		this.AbyEntity.play(this.abyAngry).setScale(1);		
	
		//fade to black and back to overworld after 5 seconds
		setTimeout(() => {
			this.add.image(600,130,this.mixedEmotion).setScale(0.6);
			this.add.image(600,300,this.endText).setScale(0.6);					
			const replaybutton = this.add.image(900,370,this.replayButton).setScale(0.6).setInteractive({ useHandCursor: true, pixelPerfect: true });
					replaybutton.on("pointerdown", () => {
						this.scene.restart();
					});
		}, 4000);
	}

	//walk away (correct)
	private createResult2(): void {
		this.anims.create({
			key: this.characterWalk,
			frameRate: 2,
			frames: this.anims.generateFrameNumbers(
				this.characterWalk,
				{
					start: 1,
					end: 0,
				}
			),
			repeat: -1,
		});

		this.characterEntity.play(this.characterWalk).setScale(1).setDepth(1);

		const movePast = this.components.addComponent(
			this.characterEntity,
			MoveTo
		);

		movePast.setTarget({
			x: -100,
			y: 750
		});

		movePast.velocity = 200;
		movePast.movingDone = () => {
			this.characterEntity.destroy();
			this.add.image(600,130,this.goodEmotion).setScale(0.6);
			this.add.image(600,300,this.endText).setScale(0.6);
			const continuebutton = this.add.image(900,370,this.continueButton).setScale(0.6).setInteractive({ useHandCursor: true, pixelPerfect: true });
			continuebutton.on("pointerdown", () => {
				continuebutton.disableInteractive();
				WorldScene.scenario5Fininshed = true;		
				const badgeCaseImage = this.add.sprite(1000,550, this.badgeCase).setScale(0.4).setVisible(true).setAlpha(0).setDepth(5);
				const badgeS1Image = this.add.sprite(680,450, this.badgeS1).setScale(0.4).setVisible(WorldScene.scenario1Fininshed).setAlpha(0).setDepth(5);
				const badgeS2Image = this.add.sprite(1010,445, this.badgeS2).setScale(0.4).setVisible(WorldScene.scenario2Fininshed).setAlpha(0).setDepth(5);
				const badgeS3Image = this.add.sprite(1320,455, this.badgeS3).setScale(0.4).setVisible(WorldScene.scenario3Fininshed).setAlpha(0).setDepth(5);
				const badgeS4Image = this.add.sprite(690,755, this.badgeS4).setScale(0.4).setVisible(WorldScene.scenario4Fininshed).setAlpha(0).setDepth(5);
				const badgeS5Image = this.add.sprite(1010,765, this.badgeS5).setScale(0.4).setVisible(WorldScene.scenario5Fininshed).setAlpha(0).setDepth(5);
				const badgeS6Image = this.add.sprite(1310,750, this.badgeS6).setScale(0.4).setVisible(WorldScene.scenario6Fininshed).setAlpha(0).setDepth(5);
				//fade in effect
				this.add.tween({
					targets: [badgeCaseImage,badgeS1Image,badgeS2Image,badgeS3Image,badgeS4Image,badgeS6Image],
					ease: 'Sine.easeInOut',
					duration: 500,
					delay: 0,
					alpha: {
					  getStart: () => 0,
					  getEnd: () => 1					  
					}					
				  });
				  this.add.tween({
					targets: [badgeS5Image],
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
					1020,
					740,
					this.sparkles
				)
				
				this.sparkleEntity.play(this.sparkles).setScale(0.7).setDepth(6);
			  	    
				  setTimeout(() => {
						this.moveScene();
				  }, 4000);  
			});
		}
	}

	//pet (maybe)
	private createResult3(): void {
		this.anims.create({
			key: this.characterWalk,
			frameRate: 2,
			frames: this.anims.generateFrameNumbers(
				this.characterWalk,
				{
					start: 1,
					end: 0,
				}
			),
			repeat: -1,
		});

		this.characterEntity.play(this.characterWalk).setScale(1).toggleFlipX().setDepth(1);
		
		const movetoRay = this.components.addComponent(
			this.characterEntity,
			MoveTo
		);

		movetoRay.setTarget({
			x: 1100,
			y: 750
		});

		movetoRay.velocity = 250;

		movetoRay.movingDone = () => {
			this.anims.create({
				key: this.boyPet,
				frameRate: 2,
				frames: this.anims.generateFrameNumbers(
					this.boyPet,
					{
						start: 1,
						end: 0,
					}
				),
				repeat: -1,
			});
			this.characterEntity.play(this.boyPet).setScale(1).setDepth(0);
	
	
			this.anims.create({
				key: this.abyAngry,
				frameRate: 2,
				frames: this.anims.generateFrameNumbers(
					this.abyAngry,
					{
						start: 1,
						end: 0,
					}
				),
				repeat: -1,
			});
			this.AbyEntity.play(this.abyAngry).setScale(1).setDepth(0);

			
			this.anims.create({
				key: this.rayWag,
				frameRate: 2,
				frames: this.anims.generateFrameNumbers(
					this.rayWag,
					{
						start: 1,
						end: 0,
					}
				),
				repeat: -1,
			});
			this.DogEntity.play(this.rayWag).setScale(1);
			this.sound.add("squeal5").play();
			
			//fade to black and back to overworld after 5 seconds
			setTimeout(() => {
				this.add.image(600,130,this.badEmotion).setScale(0.6);
					this.add.image(600,300,this.endText).setScale(0.6);					
					const replaybutton = this.add.image(900,370,this.replayButton).setScale(0.6).setInteractive({ useHandCursor: true, pixelPerfect: true });
					replaybutton.on("pointerdown", () => {
						this.scene.restart();
					});
			}, 3000);
		}		
	}

	//fade to black and back to overworld
	private moveScene() {
		fadeToBlack(this, () => {
			this.scene.stop(this.scene.key).wake(this.exitSceneKey);
			this.scene.start("UIScene");
		});
		this.game.sound.removeByKey("sceneSong");
		this.game.sound.removeByKey("squeal5");
		this.game.sound.removeByKey("meow");
		this.game.sound.resumeAll();
	}
}
