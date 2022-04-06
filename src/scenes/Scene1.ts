import BackgroundImage from "@assets/images/scenario_1/BG.png";
import Option1 from "@assets/images/scenario_1/option_1.png";
import Option2 from "@assets/images/scenario_1/option_2.png";
import Option3 from "@assets/images/scenario_1/option_3.png";
import OptionStick from "@assets/images/world/option_stick.png";
import BadgeCase from "@assets/images/UI/badges/badge_case.png";
import BadgeS1 from "@assets/images/UI/badges/badge_s1.png";
import BadgeS2 from "@assets/images/UI/badges/badge_s2.png";
import BadgeS3 from "@assets/images/UI/badges/badge_s3.png";
import BadgeS4 from "@assets/images/UI/badges/badge_s4.png";
import BadgeS5 from "@assets/images/UI/badges/badge_s5.png";
import BadgeS6 from "@assets/images/UI/badges/badge_s6.png";
import StartDialog1 from "@assets/images/scenario_1/start_dialog_1.png";
import StartDialog2 from "@assets/images/scenario_1/start_dialog_2.png";
import EndText from "@assets/images/scenario_1/end_text.png";
import EndDialog1 from "@assets/images/scenario_1/end_dialog_1.png";
import GoodEmotion from "@assets/images/world/correct_option.png";
import MixedEmotion from "@assets/images/world/almost_option.png";
import BadEmotion from "@assets/images/world/incorrect_option.png";
import ContinueButton from "@assets/images/UI/continue_button.png";
import ReplayButton from "@assets/images/UI/replay_button.png";
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
import { GameObjects, Scene } from "phaser";
import SceneLifecycle from "../SceneLifecycle";
import { addFadeIn, fadeToBlack } from "../Utilities/Scene/Fader";
import ComponentService from "../Services/ComponentService";
import MakeFullscreen from "../Components/MakeFullscreen";
import WorldScene, { WorldSceneConfig } from "./WorldScene";
import MoveTo from "../Components/MoveTo";
import sceneSong from "@assets/audio/scene.mp3";
import BadgeBling from "@assets/audio/UI/badge_bling.mp3";
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

    private playerEntity!: Sprite;

    private bullyEntity!: Sprite;

    private dogEntity!: Sprite;

	private playerIdle1!: string;

    private playerIdle2!: string;

	private playerWalk!: string;

    private playerPoint!: string;

    private playerShout!: string;

    private dogIdle!: string;

    private bullyAndDog!: string;

    private bullyIdle!: string;
    
	private bullyWalk!: string;

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

	private startDialog1!: string;

	private startDialog2!: string;

	private endText!: string;

	private endDialog1!: string;

	private goodEmotion!: string;

	private mixedEmotion!: string;

	private badEmotion!: string;

	private continueButton!: string;

	private replayButton!: string;

	private playground!: string;

	private exitSceneKey!: string;

	constructor(cfg: SettingsConfig = config) {
		super(cfg);
	}

	public init(): void {

		//initializes variables, the string value has to be unique or phaser will reuse it in other scenes
        this.playerIdle1 = "playeridle11";
		this.playerIdle2 = "playeridle21";
		this.playerWalk = "playerwalk1";
        this.playerPoint = "playerpoint1";
        this.playerShout = "playershout1";
        this.dogIdle = "dogidle1";
        this.bullyAndDog = "bullyanddog1";
        this.bullyIdle = "bullyidle1";        
        this.bullyWalk = "bullywalk1";        
		this.option1 = "option11";
		this.option2 = "option21";
		this.option3 = "option31";
		this.optionStick = "stick1";
		this.badgeCase = "badgecase1";
        this.badgeS1 = "badges11";
        this.badgeS2 = "badges21";
        this.badgeS3 = "badges31";
        this.badgeS4 = "badges41";
        this.badgeS5 = "badges51";
        this.badgeS6 = "badges61";
		this.startDialog1 = "startdialog11";
		this.startDialog2 = "startdialog21";
		this.endText = "endtext1";
		this.endDialog1 = "enddialog11";
		this.goodEmotion = "goodemotion1";
		this.mixedEmotion = "mixedemotion1"
		this.badEmotion = "bademotion1";
		this.continueButton = "continuebutton1";
		this.replayButton = "replaybutton1";
		this.playground = "playground1";

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
		this.load.image("background1", BackgroundImage);
		this.load.image(this.playground, Playground);
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
		this.load.image(this.startDialog1, StartDialog1);
		this.load.image(this.startDialog2, StartDialog2);
		this.load.image(this.endText, EndText);
		this.load.image(this.endDialog1, EndDialog1);
		this.load.image(this.goodEmotion,GoodEmotion);
		this.load.image(this.mixedEmotion,MixedEmotion);
		this.load.image(this.badEmotion,BadEmotion);
        this.load.aseprite(this.playerIdle1, PlayerIdle1Sheet, PlayerIdleData);
		this.load.aseprite(this.playerIdle2, PlayerIdle2Sheet, PlayerIdleData);
		this.load.aseprite(this.playerWalk, PlayerWalkSheet, PlayerWalkData);
        this.load.aseprite(this.playerPoint, PlayerPointSheet, PlayerPointData);	
        this.load.aseprite(this.playerShout, PlayerShoutSheet, PlayerShoutData);
        this.load.aseprite(this.dogIdle,DogIdleSheet,DogIdleData);
        this.load.aseprite(this.bullyAndDog,BullyAndDogSheet,BullyAndDogData);
        this.load.aseprite(this.bullyIdle,BullyIdleSheet,BullyIdleData);
        this.load.aseprite(this.bullyWalk,BullyWalkSheet,BullyWalkData);
		this.load.audio("sceneSong", sceneSong);
		this.load.audio("badgeBling", BadgeBling);
	}

	public create(): void {
		const centerX = this.scale.displaySize.width * 0.5;
		const centerY = this.scale.displaySize.height * 0.5;
		
		//loads background from 'background1' string. this isn't stored in a local variable because of a bug where the wrong background was loaded in certain scenes.
		const img = this.add.image(centerX, centerY, "background1");
		this.components.addComponent(img, MakeFullscreen);
		this.add.image(190, 775, this.playground).setDepth(2).setScale(1);

		this.createSituation();
	}

	public update(time: number, delta: number): void {
		super.update(time, delta);
	}

	private createSituation(): void {
        this.game.sound.pauseAll();
		var song = this.sound.add("sceneSong", {volume: 0.3});
		song.play({
			loop: true
		});

		//player entity
        this.anims.create({
			key: this.playerIdle1,
			frameRate: 2,
			frames: this.anims.generateFrameNumbers(
				this.playerIdle1,
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
			this.playerIdle1
		);
		this.playerEntity.setDepth(1);
		this.playerEntity
			.play(this.playerIdle1)
			.toggleFlipX()
			.setScale(1);

		//dog animation	
		this.anims.create({
			key: this.dogIdle,
			frameRate: 2,
			frames: this.anims.generateFrameNumbers(
				this.dogIdle,
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
			this.dogIdle
		)
		this.dogEntity
			.play(this.dogIdle)
			.setScale(1);
		
		//first textbox with continue button
		const startDialogImage1 = this.add.image(700,300,this.startDialog1).setScale(0.6);
		const continuebutton1 = this.add.image(1200,300,this.continueButton).setScale(0.6).setInteractive({ useHandCursor: true, pixelPerfect: true });
		continuebutton1.on("pointerdown", () => {
			startDialogImage1.destroy();
			continuebutton1.destroy()			
			
			this.anims.create({
				key: this.bullyWalk,
				frameRate: 4,
				frames: this.anims.generateFrameNumbers(
					this.bullyWalk,
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
				this.bullyWalk
			)
			
			this.bullyEntity.play(this.bullyWalk).setScale(1);
	
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
					key: this.bullyAndDog,
					frameRate: 2,
					frames: this.anims.generateFrameNumbers(
						this.bullyAndDog,
						{
							start: 0,
							end: 1,
						}
					),
					repeat: -1,
				});
				this.dogEntity.setTexture(this.bullyAndDog);
				this.dogEntity.setX(1300).setY(600);
				this.dogEntity.play(this.bullyAndDog);
				this.createChoice();
			};				
		});		
	}

	private createChoice(): void {	
		//second textbox containing scenario	
		const startDialogImage2 = this.add.image(700,300,this.startDialog2).setScale(0.6);	
		
		//player entity to idle 2
        this.anims.create({
			key: this.playerIdle2,
			frameRate: 2,
			frames: this.anims.generateFrameNumbers(
				this.playerIdle2,
				{
					start: 0,
					end: 1,
				}
			),
			repeat: -1,
		});
		
		this.playerEntity.setTexture(
			this.playerIdle2
		);
		this.playerEntity.setDepth(1);
		this.playerEntity
			.play(this.playerIdle2)
			.setScale(1);			
		
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
			key: this.playerPoint,
			frameRate: 2,
			frames: this.anims.generateFrameNumbers(
				this.playerPoint,
				{
					start: 0,
					end: 1,
				}
			),
			repeat: -1,
		});

		this.playerEntity.setTexture(
			this.playerPoint
		);
		this.playerEntity
			.play(this.playerPoint)
			.toggleFlipX()
			.setScale(1);

		setTimeout(() => {
			//set bully idle animation
			this.anims.create({
				key: this.bullyIdle,
				frameRate: 2,
				frames: this.anims.generateFrameNumbers(
					this.bullyIdle,
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
				this.bullyIdle
			);
			this.bullyEntity
				.play(this.bullyIdle)
				.setScale(1);

			//set dog idle animation
			this.anims.create({
				key: this.dogIdle,
				frameRate: 2,
				frames: this.anims.generateFrameNumbers(
					this.dogIdle,
					{
						start: 0,
						end: 1,
					}
				),
				repeat: -1,
			});
	
			this.dogEntity.setTexture(this.dogIdle);
			this.dogEntity
				.setX(1200)
				.setY(700)
				.play(this.dogIdle)
				.setScale(1);		
		}, 1000);
		
		setTimeout(() => {
			this.add.image(700,350,this.endDialog1).setScale(0.6);			
			const continuebutton = this.add.image(1200,350,this.continueButton).setScale(0.6).setInteractive({ useHandCursor: true, pixelPerfect: true });
			continuebutton.on("pointerdown", () => {		
				WorldScene.scenario1Fininshed = true;	
				
				const badgeCaseImage = this.add.sprite(1000,550, this.badgeCase).setScale(0.4).setVisible(true).setAlpha(0).setDepth(5);
				const badgeS1Image = this.add.sprite(680,450, this.badgeS1).setScale(0.4).setVisible(WorldScene.scenario1Fininshed).setAlpha(0).setDepth(5);
				const badgeS2Image = this.add.sprite(1010,445, this.badgeS2).setScale(0.4).setVisible(WorldScene.scenario2Fininshed).setAlpha(0).setDepth(5);
				const badgeS3Image = this.add.sprite(1320,455, this.badgeS3).setScale(0.4).setVisible(WorldScene.scenario3Fininshed).setAlpha(0).setDepth(5);
				const badgeS4Image = this.add.sprite(690,755, this.badgeS4).setScale(0.4).setVisible(WorldScene.scenario4Fininshed).setAlpha(0).setDepth(5);
				const badgeS5Image = this.add.sprite(1010,765, this.badgeS5).setScale(0.4).setVisible(WorldScene.scenario5Fininshed).setAlpha(0).setDepth(5);
				const badgeS6Image = this.add.sprite(1310,750, this.badgeS6).setScale(0.4).setVisible(WorldScene.scenario6Fininshed).setAlpha(0).setDepth(5);
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
				  this.sound.add("badgeBling", {volume: 0.5}).play();
			  	    
				  setTimeout(() => {
						this.moveScene();
				  }, 4000);  
			});			
		}, 2000);
	}

	//walk away (wrong)
	private createResult2(): void {
		this.anims.create({
			key: this.playerWalk,
			frameRate:4,
			frames: this.anims.generateFrameNumbers(
				this.playerWalk,
				{
					start: 0,
					end: 3,
				}
			),
			repeat: -1,
		});

		this.playerEntity.setTexture(
			this.playerWalk
		);
		this.playerEntity
			.play(this.playerWalk)
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
					this.add.image(600,130,this.badEmotion).setScale(0.6);
					this.add.image(600,300,this.endText).setScale(0.6);					
					const replaybutton = this.add.image(1090,420,this.replayButton).setScale(0.6).setInteractive({ useHandCursor: true, pixelPerfect: true });
					replaybutton.on("pointerdown", () => {
						this.scene.restart();
					})					
			}
		}
	}

	//call for teacher (maybe)
	private createResult3(): void {
        this.anims.create({
			key: this.playerShout,
			frameRate: 2,
			frames: this.anims.generateFrameNumbers(
				this.playerShout,
				{
					start: 0,
					end: 1,
				}
			),
			repeat: -1,
		});

		this.playerEntity.setTexture(
			this.playerShout
		);
		this.playerEntity
			.play(this.playerShout)
			.toggleFlipX()
			.setScale(1);
		
			setTimeout(() => {
				this.add.image(600,130,this.mixedEmotion).setScale(0.6);
				this.add.image(600,300,this.endText).setScale(0.6);					
				const replaybutton = this.add.image(1090,420,this.replayButton).setScale(0.6).setInteractive({ useHandCursor: true, pixelPerfect: true });
				replaybutton.on("pointerdown", () => {
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
		this.game.sound.removeByKey("sceneSong");
		this.game.sound.resumeAll();
	}
}
