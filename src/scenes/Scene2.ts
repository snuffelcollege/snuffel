import BackgroundImage from "@assets/images/scenario_2/BG.png";
import Option1 from "@assets/images/scenario_2/option_1.png";
import Option2 from "@assets/images/scenario_2/option_2.png";
import Option3 from "@assets/images/scenario_2/option_3.png";
import StartText from "@assets/images/scenario_2/start_text.png";
import EndText from "@assets/images/scenario_2/end_text.png";
import CharacterRunSheet from "@assets/spritesheets/player/scenario/run/character_run_.png";
import CharacterWalkSheet from "@assets/spritesheets/player/scenario/walk/character_walk.png";
import CharacterWalkData from "@assets/spritesheets/player/scenario/walk/character_walk.json";
import CharacterIdleSheet from "@assets/spritesheets/player/scenario/idle/character_idle.png";
import CharacterIdleData from "@assets/spritesheets/player/scenario/idle/character_idle.json";
import ShepherdSheet from "@assets/spritesheets/scenario_2/dog.png";
import ShepherdData from "@assets/spritesheets/scenario_2/dog.json";
import PokingSheet from "@assets/spritesheets/scenario_2/boystick.png";
import PokingData from "@assets/spritesheets/scenario_2/boystick.json";
import BarkingSheet from "@assets/spritesheets/scenario_2/boybark.png";
import BarkingData from "@assets/spritesheets/scenario_2/boybark.json";
import stickImage from "@assets/images/scenario_2/stick.png";
import { Scene } from "phaser";
import SceneLifecycle from "../SceneLifecycle";
import { addFadeIn, fadeToBlack } from "../Utilities/Scene/Fader";
import ComponentService from "../Services/ComponentService";
import MakeFullscreen from "../Components/MakeFullscreen";
import WorldScene, { WorldSceneConfig } from "./WorldScene";
import MoveTo from "../Components/MoveTo";
import SettingsConfig = Phaser.Types.Scenes.SettingsConfig;
import Sprite = Phaser.GameObjects.Sprite;
import bark from "@assets/audio/dog/regular_bark_1.mp3";
import stickAudio from "@assets/audio/objects/fallen_stick.mp3";
import StartTextAudio from "@assets/audio/scenario_2/start_text.mp3";
import EndTextAudio from "@assets/audio/scenario_2/end_text.mp3";
import Option1Audio from "@assets/audio/scenario_2/option_1.mp3";
import Option2Audio from "@assets/audio/scenario_2/option_2.mp3";
import Option3Audio from "@assets/audio/scenario_2/option_3.mp3";

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

export const CharacterRunData = {
	frameHeight: 256,
	frameWidth: 256,
};

export default class Scene5 extends Scene implements SceneLifecycle {
	private components!: ComponentService;

	private characterEntity!: Sprite;

	private sparkleEntity!: Sprite;

	private option1!: string;

	private option2!: string;

	private option3!: string;

	private startText!: string;

	private endText!: string;

	private characterRun!: string;

	private exitSceneKey!: string;

	private characterWalk!: string;

	private characterIdle!: string;

	private shepherdSheet!: string;

	private barkingSheet!: string;

	private shepherdEntity!: Sprite;

	private stickImage!: string;

	private stickEntity!: Sprite;

	private pokingSheet!: string;

	constructor(cfg: SettingsConfig = config) {
		super(cfg);
	}

	public init(): void {
		this.option1 = "option12";
		this.option2 = "option22";
		this.option3 = "option32";
		this.startText = "starttext2";
		this.endText = "endtext2";
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

		// The moment the scene renders, a fade from black is started using this function.
		addFadeIn(this);
	}

	// A key has to be unique for the entire project, not just this scene.
	public preload(): void {
		this.load.image("background2", BackgroundImage);
		this.load.image(this.stickImage, stickImage);
		this.load.image(this.option1, Option1);
		this.load.image(this.option2, Option2);
		this.load.image(this.option3, Option3);
		this.load.image(this.startText,StartText);
		this.load.image(this.endText, EndText);
		
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
			ShepherdSheet,
			ShepherdData
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

		this.load.audio("bark2", bark);
		this.load.audio("2fallenStick",stickAudio);
		this.load.audio("2startTextAudio",StartTextAudio);
		this.load.audio("2endTextAudio", EndTextAudio);
		this.load.audio("2option1Audio", Option1Audio);
		this.load.audio("2option2Audio", Option2Audio);
		this.load.audio("2option3Audio", Option3Audio);
	}

	public create(): void {
		const centerX = this.scale.displaySize.width * 0.5;
		const centerY = this.scale.displaySize.height * 0.5;

		const img = this.add.image(centerX, centerY, "background2");

		this.components.addComponent(img, MakeFullscreen);
		this.createSituation();
	}

	private createSituation(): void {
		
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
			
			.toggleFlipX()
			.setDepth(1);
		
		this.shepherdEntity = this.add.sprite(
			1555,
			350,
			this.shepherdSheet
		).setDepth(0);

		this.stickEntity = this.add.sprite(1125, 1025, this.stickImage)
		this.sound.add("2startTextAudio", {volume: 1}).play();
		this.createChoice();
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
			this.game.sound.removeByKey("2startTextAudio");
			this.sound.add("2option1Audio", {volume: 1}).play();
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
		const stick2 = this.add.image(1000,1280, "stick").setDepth(2);
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
			this.sound.add("2option2Audio", {volume: 1}).play();
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
		const stick3 = this.add.image(1500,1280, "stick").setDepth(2);
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
			this.sound.add("2option3Audio", {volume: 1}).play();
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
		this.characterEntity.play(this.pokingSheet);

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
			var bark = this.sound.add("bark2");
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
					this.add.image(600,130,"bademotion").setScale(0.6);
					this.add.image(600,300,this.endText).setScale(0.6);							
					this.sound.removeByKey("bark2");
					this.sound.removeByKey("2fallenStick");
					this.sound.add("bademotionaudio", {volume: 1}).play();						
					setTimeout(() => {
						this.sound.add("2endTextAudio", {volume: 1}).play();
						const replaybutton = this.add.image(1090,360,"replaybutton").setScale(0.6).setInteractive({ useHandCursor: true, pixelPerfect: true });
						replaybutton.on("pointerdown", () => {
							this.game.sound.removeByKey("bademotionaudio");
							this.game.sound.removeByKey("2endTextAudio");	
							this.scene.restart();
						});
					}, 2500);
					
					
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

		this.characterEntity.play(this.characterWalk).toggleFlipX();

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
			this.add.image(600,130,"goodemotion").setScale(0.6);
			this.add.image(600,300,this.endText).setScale(0.6);
			
			this.sound.add("goodemotionaudio", {volume: 1}).play();	
					
			setTimeout(() => {
				this.sound.add("2endTextAudio", {volume: 1}).play();
				const continuebutton = this.add.image(1090,360,"continuebutton").setScale(0.6).setInteractive({ useHandCursor: true, pixelPerfect: true });
				continuebutton.on("pointerdown", () => {
					continuebutton.disableInteractive();
					this.game.sound.removeByKey("goodemotionaudio");
					this.game.sound.removeByKey("2endTextAudio");	
					WorldScene.scenario2Fininshed = true;		
					
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
						targets: [badgeCaseImage,badgeS1Image,badgeS3Image,badgeS4Image,badgeS5Image,badgeS6Image,badgeS7Image,badgeS8Image,badgeS9Image,badgeS10Image],
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
						736,
						481,
						"sparkles"
					)
					
					this.sparkleEntity.play("sparkles").setScale(0.7).setDepth(6);
						  
					  setTimeout(() => {
							this.moveScene();
					  }, 4000);  
				});
			}, 3000);
			
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
		
		this.characterEntity.play(this.barkingSheet).toggleFlipX();

		this.anims.create({
			key: this.shepherdSheet,
			frameRate: 2,
			frames: this.anims.generateFrameNumbers(this.shepherdSheet, {
				start: 1,
				end: 0,
			}),
			repeat: -1,
		});

		this.shepherdEntity.play(this.shepherdSheet);

		var bark = this.sound.add("bark2");
		bark.play({
			loop: true
		});

		setTimeout(() => {
			this.add.image(600,130,"mixedemotion").setScale(0.6);
			this.add.image(600,300,this.endText).setScale(0.6);					
			this.sound.removeByKey("bark2");
			this.sound.add("mixedemotionaudio", {volume: 1}).play();	
					
			setTimeout(() => {
				this.sound.add("2endTextAudio", {volume: 1}).play();
				const replaybutton = this.add.image(1090,360,"replaybutton").setScale(0.6).setInteractive({ useHandCursor: true, pixelPerfect: true });
				replaybutton.on("pointerdown", () => {
					this.game.sound.removeByKey("mixedemotionaudio");
					this.game.sound.removeByKey("2endTextAudio");	
					this.scene.restart();
				})
			}, 3000);			
		}, 3000);
	}

	private moveScene() {
		fadeToBlack(this, () => {
			this.scene.stop(this.scene.key).wake(this.exitSceneKey);
			this.scene.start("UIScene");
		});
	}
}
