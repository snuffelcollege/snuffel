import BackgroundImage from "@assets/images/scenario_1/BG.png";
import Option1 from "@assets/images/scenario_1/option_1.png";
import Option2 from "@assets/images/scenario_1/option_2.png";
import Option3 from "@assets/images/scenario_1/option_3.png";
import StartDialog1 from "@assets/images/scenario_1/start_dialog_1.png";
import StartDialog2 from "@assets/images/scenario_1/start_dialog_2.png";
import EndText from "@assets/images/scenario_1/end_text.png";
import EndDialog1 from "@assets/images/scenario_1/end_dialog.png";
import Playground from "@assets/images/scenario_1/playground.png";
import PlayerIdle1Sheet from "@assets/spritesheets/player/scenario/idle/character_idle.png";
import PlayerIdle2Sheet from "@assets/spritesheets/player/scenario/idle/character_idle2.png";
import PlayerIdleData from "@assets/spritesheets/player/scenario/idle/character_idle.json";
import PlayerWalkSheet from "@assets/spritesheets/player//scenario/walk/character_walk.png";
import PlayerWalkData from "@assets/spritesheets/player//scenario/walk/character_walk.json";
import PlayerPointSheet from "@assets/spritesheets/scenario_1/boypoint.png";
import PlayerPointData from "@assets/spritesheets/scenario_1/boypoint.json";
import PlayerShoutSheet from "@assets/spritesheets/scenario_1/boyshout.png";
import PlayerShoutData from "@assets/spritesheets/scenario_1/boyshout.json";
import DogIdleSheet from "@assets/spritesheets/scenario_1/snuffelidle.png";
import DogIdleData from "@assets/spritesheets/scenario_1/snuffelidle.json";
import BullyAndDogSheet from "@assets/spritesheets/scenario_1/Johnny+dog.png";
import BullyAndDogData from "@assets/spritesheets/scenario_1/Johnny+dog.json";
import BullyIdleSheet from "@assets/spritesheets/scenario_1/johnnyidle.png";
import BullyIdleData from "@assets/spritesheets/scenario_1/johnnyidle.json";
import BullyWalkSheet from "@assets/spritesheets/scenario_1/johnnywalk.png";
import BullyWalkData from "@assets/spritesheets/scenario_1/johnnywalk.json";
import { Scene } from "phaser";
import SceneLifecycle from "../SceneLifecycle";
import { addFadeIn, fadeToBlack } from "../Utilities/Scene/Fader";
import ComponentService from "../Services/ComponentService";
import MakeFullscreen from "../Components/MakeFullscreen";
import WorldScene, { WorldSceneConfig } from "./WorldScene";
import MoveTo from "../Components/MoveTo";
import StartDialog1Audio from "@assets/audio/scenario_1/start_dialog_1.mp3";
import StartDialog2Audio from "@assets/audio/scenario_1/start_dialog_2.mp3";
import EndDialog1Audio from "@assets/audio/scenario_1/end_dialog.mp3";
import EndTextAudio from "@assets/audio/scenario_1/end_text.mp3";
import Option1Audio from "@assets/audio/scenario_1/option_1.mp3";
import Option2Audio from "@assets/audio/scenario_1/option_2.mp3";
import Option3Audio from "@assets/audio/scenario_1/option_3.mp3";
import SettingsConfig = Phaser.Types.Scenes.SettingsConfig;
import Sprite = Phaser.GameObjects.Sprite;

// Config for the scene defining gravity and debug settings.
export const config: SettingsConfig = {
	active: false,
	key: "scene-1",
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

    private playerEntity!: Sprite;

    private bullyEntity!: Sprite;

    private dogEntity!: Sprite;

	private sparkleEntity!: Sprite;

	private exitSceneKey!: string;

	constructor(cfg: SettingsConfig = config) {
		super(cfg);
	}

	public init(): void {

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
		
		//image files
		this.load.image("background1", BackgroundImage);
		this.load.image("playground1", Playground);
		this.load.image("option11", Option1);
		this.load.image("option21", Option2);
		this.load.image("option31", Option3);
		this.load.image("startdialog11", StartDialog1);
		this.load.image("startdialog21", StartDialog2);
		this.load.image("endtext1", EndText);
		this.load.image("enddialog11", EndDialog1);		
        
		//aseprite files
		this.load.aseprite("playeridle11", PlayerIdle1Sheet, PlayerIdleData);
		this.load.aseprite("playeridle21", PlayerIdle2Sheet, PlayerIdleData);
		this.load.aseprite("playerWalk1", PlayerWalkSheet, PlayerWalkData);
        this.load.aseprite( "playerpoint1", PlayerPointSheet, PlayerPointData);	
        this.load.aseprite( "playershout1", PlayerShoutSheet, PlayerShoutData);
        this.load.aseprite("dogidle1",DogIdleSheet,DogIdleData);
        this.load.aseprite("bullyanddog1",BullyAndDogSheet,BullyAndDogData);
        this.load.aseprite("bullyidle1",BullyIdleSheet,BullyIdleData);
        this.load.aseprite("bullywalk1",BullyWalkSheet,BullyWalkData);
		
		//audio files
		this.load.audio("1startdialog1audio", StartDialog1Audio);
		this.load.audio("1startdialog2audio", StartDialog2Audio);
		this.load.audio("1enddialog1audio", EndDialog1Audio);
		this.load.audio("1endtextaudio", EndTextAudio);
		this.load.audio("1option1audio", Option1Audio);
		this.load.audio("1option2audio", Option2Audio);
		this.load.audio("1option3audio", Option3Audio);
	}

	public create(): void {
		const centerX = this.scale.displaySize.width * 0.5;
		const centerY = this.scale.displaySize.height * 0.5;
		
		//loads and sets background and playground obstacle
		const img = this.add.image(centerX, centerY, "background1");
		this.components.addComponent(img, MakeFullscreen);
		this.add.image(190, 775, "playground1").setDepth(2).setScale(1);

		this.createSituation();
	}

	public update(time: number, delta: number): void {
		super.update(time, delta);
	}

	private createSituation(): void {

		//player idle animation
        this.anims.create({
			key: "playeridle11",
			frameRate: 2,
			frames: this.anims.generateFrameNumbers(
				"playeridle11",
				{
					start: 0,
					end: 1,
				}
			),
			repeat: -1,
		});
		
		this.playerEntity = this.add.sprite(
			700,
			600,
			"playeridle11"
		);
		this.playerEntity.setDepth(1);
		this.playerEntity
			.play("playeridle11")
			.toggleFlipX()
			.setScale(1);

		//dog idle animation	
		this.anims.create({
			key: "dogidle1",
			frameRate: 2,
			frames: this.anims.generateFrameNumbers(
				"dogidle1",
				{
					start: 0,
					end: 1,
				}
			),
			repeat: -1,
		});	
	
		this.dogEntity = this.add.sprite(
			1200,
			700,
			"dogidle1"
		)
		this.dogEntity
			.play("dogidle1")
			.setScale(1);
		
		//first textbox with continue button
		const startDialogImage1 = this.add.image(700,300,"startdialog11").setScale(0.6);
		this.sound.add("1startdialog1audio", {volume: 1}).play();		
		const continuebutton1 = this.add.image(1200,300,"continuebutton").setScale(0.6).setInteractive({ useHandCursor: true, pixelPerfect: true });
		continuebutton1.on("pointerdown", () => {
			this.game.sound.removeByKey("1startdialog1audio");
			startDialogImage1.destroy();
			continuebutton1.destroy()			
			
			this.anims.create({
				key: "bullywalk1",
				frameRate: 4,
				frames: this.anims.generateFrameNumbers(
					"bullywalk1",
					{
						start: 0,
						end: 1,
					}
				),
				repeat: -1,
			});
	
			this.bullyEntity = this.add.sprite(
				1920,
				600,
				"bullywalk1"
			)
			
			this.bullyEntity.play("bullywalk1").setScale(1);
	
			const bullyMove = this.components.addComponent(
				this.bullyEntity,
				MoveTo
			);
			bullyMove.setTarget({
				x: this.dogEntity.x + 200,
				y: this.dogEntity.y - 150,
			});		
			bullyMove.velocity = 200;
			bullyMove.movingDone = () => {
				this.bullyEntity.setVisible(false);
	
				this.anims.create({
					key: "bullyanddog1",
					frameRate: 2,
					frames: this.anims.generateFrameNumbers(
						"bullyanddog1",
						{
							start: 0,
							end: 1,
						}
					),
					repeat: -1,
				});
				this.dogEntity.setTexture("bullyanddog1");
				this.dogEntity.setX(1300).setY(600);
				this.dogEntity.play("bullyanddog1");
				this.sound.add("1startdialog2audio", {volume: 1}).play();	
				this.createChoice();
			};				
		});		
	}

	private createChoice(): void {	
		//second textbox containing scenario	
		const startDialogImage2 = this.add.image(700,300,"startdialog21").setScale(0.6);	
		
		//player entity to idle 2
        this.anims.create({
			key: "playeridle21",
			frameRate: 2,
			frames: this.anims.generateFrameNumbers(
				"playeridle21",
				{
					start: 0,
					end: 1,
				}
			),
			repeat: -1,
		});
		
		this.playerEntity.setTexture(
			"playeridle21"
		);
		this.playerEntity.setDepth(1);
		this.playerEntity
			.play("playeridle21")
			.setScale(1);			
		
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
		const button1 = this.add.image(500, 1200, "option11");
		button1.on("pointerover", () => {
			this.game.sound.removeByKey("1startdialog2audio");	
			this.sound.add("1option1audio", {volume: 1}).play();	
			button1.angle = 5;			
		});
		button1.on('pointerout',() => {
			this.game.sound.removeByKey("1option1audio");	
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
		const button2 = this.add.image(1000, 1200, "option21");
		button2.on("pointerover", () => {
			button2.angle = 5;	
			this.game.sound.removeByKey("1startdialog2audio");	
			this.sound.add("1option2audio", {volume: 1}).play();		
		});
		button2.on('pointerout',() => {
			this.game.sound.removeByKey("1option2audio");	
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
		const button3 = this.add.image(1500, 1200, "option31");
		button3.on("pointerover", () => {
			this.game.sound.removeByKey("1startdialog2audio");	
			this.sound.add("1option3audio", {volume: 1}).play();	
			button3.angle = 5;						
		});
		button3.on('pointerout',() => {
			this.game.sound.removeByKey("1option3audio");	
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
				startDialogImage2.destroy();
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
				startDialogImage2.destroy();
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
				startDialogImage2.destroy();
				this.createResult3();
			});
	}

	//tell him to stop (correct)
	private createResult1(): void {	
		this.anims.create({
			key:  "playerpoint1",
			frameRate: 2,
			frames: this.anims.generateFrameNumbers(
				 "playerpoint1",
				{
					start: 0,
					end: 1,
				}
			),
			repeat: -1,
		});

		this.playerEntity.setTexture(
			 "playerpoint1"
		);
		this.playerEntity
			.play( "playerpoint1")
			.toggleFlipX()
			.setScale(1);

		setTimeout(() => {
			//set bully idle animation
			this.anims.create({
				key: "bullyidle1",
				frameRate: 2,
				frames: this.anims.generateFrameNumbers(
					"bullyidle1",
					{
						start: 1,
						end: 0,
					}
				),
				repeat: -1,
			});
			this.bullyEntity.setVisible(true);
			this.bullyEntity.x = 1500
			this.bullyEntity.setTexture(
				"bullyidle1"
			);
			this.bullyEntity
				.play("bullyidle1")
				.setScale(1);

			//set dog idle animation
			this.anims.create({
				key: "dogidle1",
				frameRate: 2,
				frames: this.anims.generateFrameNumbers(
					"dogidle1",
					{
						start: 0,
						end: 1,
					}
				),
				repeat: -1,
			});
	
			this.dogEntity.setTexture("dogidle1");
			this.dogEntity
				.setX(1200)
				.setY(700)
				.play("dogidle1")
				.setScale(1);		
		}, 1000);
		
		setTimeout(() => {
			this.add.image(700,350,"enddialog11").setScale(0.6);			
			this.sound.add("1enddialog1audio", {volume: 1}).play();	
			const continuebutton = this.add.image(1200,350,"continuebutton").setScale(0.6).setInteractive({ useHandCursor: true, pixelPerfect: true });
			continuebutton.on("pointerdown", () => {	
				continuebutton.disableInteractive();
				this.game.sound.removeByKey("1enddialog1audio");	
				
				//used for keeping badge progress
				WorldScene.scenario1Fininshed = true;
				
				//show new badge, variables are initialized in UI class
				const badgeCaseImage = this.add.sprite(1000,550, "badgecase").setScale(0.4).setVisible(true).setAlpha(0).setDepth(5);
				const badgeS1Image = this.add.sprite(680,450, "badge1").setScale(0.4).setVisible(WorldScene.scenario1Fininshed).setAlpha(0).setDepth(5);
				const badgeS2Image = this.add.sprite(1010,445, "badge2").setScale(0.4).setVisible(WorldScene.scenario2Fininshed).setAlpha(0).setDepth(5);
				const badgeS3Image = this.add.sprite(1320,455, "badge3").setScale(0.4).setVisible(WorldScene.scenario3Fininshed).setAlpha(0).setDepth(5);
				const badgeS4Image = this.add.sprite(690,755, "badge4").setScale(0.4).setVisible(WorldScene.scenario4Fininshed).setAlpha(0).setDepth(5);
				const badgeS5Image = this.add.sprite(1010,765, "badge5").setScale(0.4).setVisible(WorldScene.scenario5Fininshed).setAlpha(0).setDepth(5);
				const badgeS6Image = this.add.sprite(1310,750, "badge6").setScale(0.4).setVisible(WorldScene.scenario6Fininshed).setAlpha(0).setDepth(5);
				
				//fade in effect
				this.add.tween({
					targets: [badgeCaseImage,badgeS2Image,badgeS3Image,badgeS4Image,badgeS5Image,badgeS6Image],
					ease: 'Sine.easeInOut',
					duration: 500,
					delay: 0,
					alpha: {
					  getStart: () => 0,
					  getEnd: () => 1					  
					}					
				  });
				  this.add.tween({
					targets: [badgeS1Image],
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
		}, 2000);
	}

	//walk away (wrong)
	private createResult2(): void {
		this.anims.create({
			key: "playerWalk1",
			frameRate:4,
			frames: this.anims.generateFrameNumbers(
				"playerWalk1",
				{
					start: 0,
					end: 3,
				}
			),
			repeat: -1,
		});

		this.playerEntity.setTexture(
			"playerWalk1"
		);
		this.playerEntity
			.play("playerWalk1")
			.setScale(1);
		
		const playerMove = this.components.addComponent(
			this.playerEntity,
			MoveTo
		);
		playerMove.setTarget({
			x: this.playerEntity.x - 300,
			y: this.playerEntity.y - 75,
		});		
		playerMove.velocity = 200;
		playerMove.movingDone = () => {
			playerMove.setTarget({
				x: this.playerEntity.x - 550,
				y: this.playerEntity.y,
			});		
			playerMove.movingDone = () => {
					this.add.image(600,130,"bademotion").setScale(0.6);
					this.add.image(600,300,"endtext1").setScale(0.6);					
					this.sound.add("bademotionaudio", {volume: 1}).play();	
					
					setTimeout(() => {
						this.sound.add("1endtextaudio", {volume: 1}).play();
					}, 2500);
					const replaybutton = this.add.image(1090,380,"replaybutton").setScale(0.6).setInteractive({ useHandCursor: true, pixelPerfect: true });
					replaybutton.on("pointerdown", () => {
						this.game.sound.removeByKey("bademotionaudio");
						this.game.sound.removeByKey("1endtextaudio");						
						this.scene.restart();
					})					
			}
		}
	}

	//call for teacher (maybe)
	private createResult3(): void {
        this.anims.create({
			key:  "playershout1",
			frameRate: 2,
			frames: this.anims.generateFrameNumbers(
				 "playershout1",
				{
					start: 0,
					end: 1,
				}
			),
			repeat: -1,
		});

		this.playerEntity.setTexture(
			 "playershout1"
		);
		this.playerEntity
			.play( "playershout1")
			.toggleFlipX()
			.setScale(1);
		
			setTimeout(() => {
				this.add.image(600,130,"mixedemotion").setScale(0.6);
				this.add.image(600,300,"endtext1").setScale(0.6);									
				this.sound.add("mixedemotionaudio", {volume: 1}).play();	
				setTimeout(() => {
					this.sound.add("1endtextaudio", {volume: 1}).play();
				}, 3000);
				const replaybutton = this.add.image(1090,360,"replaybutton").setScale(0.6).setInteractive({ useHandCursor: true, pixelPerfect: true });
				replaybutton.on("pointerdown", () => {
					this.game.sound.removeByKey("mixedemotionaudio");
					this.game.sound.removeByKey("1endtextaudio");
					this.scene.restart();
				})
				
		}, 3000);
	}

	//fade to black and back to overworld
	private moveScene() {
		fadeToBlack(this, () => {
			this.scene.stop(this.scene.key).wake(this.exitSceneKey);
			this.scene.start("UIScene");
		});
	}
}
