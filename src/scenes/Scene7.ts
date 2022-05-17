import BackgroundImage from "@assets/images/scenario_7/BG.png";
import Option1 from "@assets/images/scenario_7/option_1.png";
import Option2 from "@assets/images/scenario_7/option_2.png";
import Option3 from "@assets/images/scenario_7/option_3.png";
import StartText from "@assets/images/scenario_7/start_text.png";
import EndText from "@assets/images/scenario_7/end_text.png";
import CharacterWalkSheet from "@assets/spritesheets/player/scenario/walk/character_walk.png";
import CharacterWalkData from "@assets/spritesheets/player/scenario/walk/character_walk.json";
import CharacterRunSheet from "@assets/spritesheets/player/scenario/run/character_run.png";
import CharacterRunData from "@assets/spritesheets/player/scenario/run/character_run.json";
import CharacterIdleSheet from "@assets/spritesheets/player/scenario/idle/character_idle.png";
import CharacterIdleData from "@assets/spritesheets/player/scenario/idle/character_idle.json";
import BoyHugSheet from "@assets/spritesheets/scenario_7/boyhug.png";
import BoyHugData from "@assets/spritesheets/scenario_7/boyhug.json";
import BoyPetSheet from "@assets/spritesheets/scenario_7/boypet.png";
import BoyPetData from "@assets/spritesheets/scenario_7/boypet.json";
import BoyHandSheet from "@assets/spritesheets/scenario_7/boyhand.png";
import BoyHandData from "@assets/spritesheets/scenario_7/boyhand.json";
import VinceIdleSheet from "@assets/spritesheets/scenario_7/vinceidle.png";
import VinceIdleData from "@assets/spritesheets/scenario_7/vinceidle.json";
import DogIdleSheet from "@assets/spritesheets/scenario_7/dogidle.png";
import DogIdleData from "@assets/spritesheets/scenario_7/dogidle.json";
import DogSniffSheet from "@assets/spritesheets/scenario_7/dogsniff.png";
import DogSniffData from "@assets/spritesheets/scenario_7/dogsniff.json";
import DogPullSheet from "@assets/spritesheets/scenario_7/dogpull.png";
import DogPullData from "@assets/spritesheets/scenario_7/dogpull.json";
import { Scene } from "phaser";
import SceneLifecycle from "../SceneLifecycle";
import { addFadeIn, fadeToBlack } from "../Utilities/Scene/Fader";
import ComponentService from "../Services/ComponentService";
import MakeFullscreen from "../Components/MakeFullscreen";
import WorldScene, { WorldSceneConfig } from "./WorldScene";
import MoveTo from "../Components/MoveTo";
import SettingsConfig = Phaser.Types.Scenes.SettingsConfig;
import Sprite = Phaser.GameObjects.Sprite;

//TODO change to scenario 7 when available
import StartTextAudio from "@assets/audio/scenario_6/start_text.mp3";
import EndTextAudio from "@assets/audio/scenario_6/end_text.mp3";
import Option1Audio from "@assets/audio/scenario_6/option_1.mp3";
import Option2Audio from "@assets/audio/scenario_6/option_2.mp3";
import Option3Audio from "@assets/audio/scenario_6/option_3.mp3";

// Config for the scene defining gravity and debug settings.
export const config: SettingsConfig = {
	active: false,
	key: "scene-7",
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

	private vinceEntity!: Sprite;

	private dogEntity!: Sprite;

	private sparkleEntity!: Sprite;

	private characterWalk!: string; //aseprite of character walking

	private characterRun!: string; //aseprite of character walking

	private characterIdle!: string;//aseprite of character idling

	private vinceIdle!: string;

	private dogIdle!: string;

	private boyHug!: string;

	private boyPet!: string;

	private boyHand!: string;

	private dogSniff!: string;

	private dogPull!: string;

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
		this.option1 = "option17";
		this.option2 = "option27";
		this.option3 = "option37";
		this.startText = "starttext7";
		this.endText = "endtext7";
		this.characterWalk = "characterWalk7";
		this.characterIdle = "characterIdle7";
		this.characterRun = "characterRun7";
		this.vinceIdle = "vinceIdle7";
		this.dogIdle = "dogIdle7";
		this.dogSniff = "dogSniff7";
		this.dogPull = "dogPull7";
		this.boyHand = "boyHand7";
		this.boyPet = "boyPet7";
		this.boyHug = "boyHug7";

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
		//assigns background to 'background4' string
		this.load.image("background7", BackgroundImage);
		this.load.image(this.option1, Option1);
		this.load.image(this.option2, Option2);
		this.load.image(this.option3, Option3);
		this.load.image(this.startText,StartText);
		this.load.image(this.endText, EndText);
		this.load.audio("7starttextaudio",StartTextAudio);
		this.load.audio("7endtextaudio", EndTextAudio);
		this.load.audio("7option1audio", Option1Audio);
		this.load.audio("7option2audio", Option2Audio);
		this.load.audio("7option3audio", Option3Audio);
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
			this.boyHand,
			BoyHandSheet,
			BoyHandData
		);
		this.load.aseprite(
			this.boyPet,
			BoyPetSheet,
			BoyPetData
		);
		this.load.aseprite(
			this.boyHug,
			BoyHugSheet,
			BoyHugData
		);
		this.load.aseprite(
			this.vinceIdle,
			VinceIdleSheet,
			VinceIdleData
		);
		this.load.aseprite(
			this.dogIdle,			
			DogIdleSheet,
			DogIdleData
		);
		this.load.aseprite(
			this.dogSniff,			
			DogSniffSheet,
			DogSniffData
		);
		this.load.aseprite(
			this.dogPull,			
			DogPullSheet,
			DogPullData
		);
	}

	public create(): void {
		const centerX = this.scale.displaySize.width * 0.5;
		const centerY = this.scale.displaySize.height * 0.5;
		
		//loads background from 'background4' string. this isn't stored in a local variable because of a bug where the wrong background was loaded in certain scenes.
		const img = this.add.image(centerX, centerY, "background7");
		this.components.addComponent(img, MakeFullscreen);
		
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
		this.characterEntity = this.add.sprite(450,600,this.characterIdle);
		this.characterEntity.toggleFlipX().play(this.characterIdle).setScale(.8).setDepth(1);

		this.anims.create({
			key: this.vinceIdle,
			frameRate: 1,
			frames: this.anims.generateFrameNumbers(
				this.vinceIdle,
				{
					start: 0,
					end: 1,
				}
			),
			repeat: -1,
		});
		this.vinceEntity = this.add.sprite(1230,540,this.vinceIdle);
		this.vinceEntity.play(this.vinceIdle);

		this.anims.create({
			key: this.dogIdle,
			frameRate: 1,
			frames: this.anims.generateFrameNumbers(
				this.dogIdle,
				{
					start: 0,
					end: 1,
				}
			),
			repeat: -1,
		});
		this.dogEntity = this.add.sprite(850,780,this.dogIdle).setDepth(0);
		this.dogEntity.play(this.dogIdle);
		

		this.createChoice();		
	}

	private createChoice(): void {
		const startTextImage = this.add.image(600,200,this.startText).setScale(0.6);
		this.sound.add("7starttextaudio", {volume: 1}).play();
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
		const button1 = this.add.image(500, 1200, this.option1).setDepth(3);
		button1.on("pointerover", () => {
			this.game.sound.removeByKey("7starttextaudio");
			this.sound.add("7option1audio", {volume: 1}).play();
			button1.angle = 5;			
		});
		button1.on('pointerout',() => {
			this.game.sound.removeByKey("7option1audio");
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
		const button2 = this.add.image(1000, 1200, this.option2).setDepth(3);
		button2.on("pointerover", () => {
			this.game.sound.removeByKey("7starttextaudio");
			this.sound.add("7option2audio", {volume: 1}).play();
			button2.angle = 5;			
		});
		button2.on('pointerout',() => {
			this.game.sound.removeByKey("7option2audio");
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
		const button3 = this.add.image(1500, 1200, this.option3).setDepth(3);
		button3.on("pointerover", () => {
			this.game.sound.removeByKey("7starttextaudio");
			this.sound.add("7option3audio", {volume: 1}).play();
			button3.angle = 5;			
		});
		button3.on('pointerout',() => {
			this.game.sound.removeByKey("7option3audio");
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

	//hug (wrong)
	private createResult1(): void {
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

		this.characterEntity.play(this.characterWalk).toggleFlipX();
		
		const movetoSpencer = this.components.addComponent(
			this.characterEntity,
			MoveTo
		);

		movetoSpencer.setTarget({
			x: 620,
			y: 750
		});
		movetoSpencer.velocity = 150;
		movetoSpencer.movingDone = () => {
			this.anims.create({
				key: this.boyHug,
				frameRate: 2,
				frames: this.anims.generateFrameNumbers(
					this.boyHug,
					{
						start: 1,
						end: 0,
					}
				),
				repeat: -1,
			});	
			
			this.characterEntity.setTexture(this.boyHug)
			this.characterEntity.play(this.boyHug);

			this.anims.create({
				key: this.dogPull,
				frameRate: 2,
				frames: this.anims.generateFrameNumbers(
					this.dogPull,
					{
						start: 1,
						end: 0,
					}
				),
				repeat: -1,
			});	
			
			this.dogEntity.setTexture(this.dogPull)
			this.dogEntity.play(this.dogPull);

			setTimeout(() => {
				this.add.image(550,130,"bademotion").setScale(0.6);
				this.add.image(550,300,this.endText).setScale(0.6);					
				const replaybutton = this.add.image(1040,360,"replaybutton").setScale(0.6).setInteractive({ useHandCursor: true, pixelPerfect: true });
				this.sound.add("bademotionaudio", {volume: 1}).play();	
				
				setTimeout(() => {
					this.sound.add("7endtextaudio", {volume: 1}).play();
				}, 2500);//good & mixed = 3000
				replaybutton.on("pointerdown", () => {
					this.game.sound.removeByKey("bademotionaudio");
					this.game.sound.removeByKey("7endtextaudio");
					this.scene.restart();
				});					
			}, 3000);
		}
	}

	//sniff (correct)
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

		this.characterEntity.play(this.characterWalk).toggleFlipX();
		
		const movetoSpencer = this.components.addComponent(
			this.characterEntity,
			MoveTo
		);

		movetoSpencer.setTarget({
			x: 550,
			y: 700
		});
		movetoSpencer.velocity = 150;
		movetoSpencer.movingDone = () => {
			this.anims.create({
				key: this.boyHand,
				frameRate: 2,
				frames: this.anims.generateFrameNumbers(
					this.boyHand,
					{
						start: 1,
						end: 0,
					}
				),
				repeat: -1,
			});	
			
			this.characterEntity.setTexture(this.boyHand)
			this.characterEntity.play(this.boyHand).setScale(.9);

			this.anims.create({
				key: this.dogSniff,
				frameRate: 2,
				frames: this.anims.generateFrameNumbers(
					this.dogSniff,
					{
						start: 1,
						end: 0,
					}
				),
				repeat: -1,
			});	
			
			this.dogEntity.setTexture(this.dogSniff)
			this.dogEntity.play(this.dogSniff);
			setTimeout(() => {
				this.add.image(600,130,"goodemotion").setScale(0.6);
				this.add.image(600,300,this.endText).setScale(0.6);	
				const continuebutton = this.add.image(1090,360,"continuebutton").setScale(0.6).setInteractive({ useHandCursor: true, pixelPerfect: true });
				continuebutton.on("pointerdown", () => {
					continuebutton.disableInteractive();
					WorldScene.scenario7Fininshed = true;
					
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
						targets: [badgeCaseImage,badgeS1Image,badgeS2Image,badgeS3Image,badgeS4Image,badgeS5Image,badgeS6Image,badgeS7Image,badgeS9Image,badgeS10Image],
						ease: 'Sine.easeInOut',
						duration: 500,
						delay: 0,
						alpha: {
						  getStart: () => 0,
						  getEnd: () => 1					  
						}					
					  });
					  this.add.tween({
						targets: [badgeS8Image],
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
						450,
						"sparkles"
					)
					
					this.sparkleEntity.play("sparkles").setScale(0.7).setDepth(6);
						  
					  setTimeout(() => {
							this.moveScene();
					  }, 4000);
				});
			}, 5000);
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

		this.characterEntity.play(this.characterWalk).toggleFlipX();
		
		const movetoSpencer = this.components.addComponent(
			this.characterEntity,
			MoveTo
		);

		movetoSpencer.setTarget({
			x: 575,
			y: 700
		});
		movetoSpencer.velocity = 150;
		movetoSpencer.movingDone = () => {
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
			
			this.characterEntity.setTexture(this.boyPet)
			this.characterEntity.play(this.boyPet);

			setTimeout(() => {
				this.add.image(550,130,"mixedemotion").setScale(0.6);
				this.add.image(550,300,this.endText).setScale(0.6);					
				const replaybutton = this.add.image(1040,360,"replaybutton").setScale(0.6).setInteractive({ useHandCursor: true, pixelPerfect: true });
				this.sound.add("mixedemotionaudio", {volume: 1}).play();	
				
				setTimeout(() => {
					this.sound.add("7endtextaudio", {volume: 1}).play();
				}, 2500);//good & mixed = 3000
				replaybutton.on("pointerdown", () => {
					this.game.sound.removeByKey("mixedemotionaudio");
					this.game.sound.removeByKey("7endtextaudio");
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
	}
}
