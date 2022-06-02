import BackgroundImage from "@assets/images/scenario_9/BG.png";
import Frisbee from "@assets/images/scenario_9/Frisbee.png";
import Frisbee2 from "@assets/images/scenario_9/Frisbee2.png";
import Option1 from "@assets/images/scenario_9/option_1.png";
import Option2 from "@assets/images/scenario_9/option_2.png";
import Option3 from "@assets/images/scenario_9/option_3.png";
import StartText from "@assets/images/scenario_9/start_text.png";
import EndText from "@assets/images/scenario_9/end_text.png";
import CharacterRunSheet from "@assets/spritesheets/scenario_9/boyrunf.png";
import CharacterRunData from "@assets/spritesheets/scenario_9/boyrunf.json";
import CharacterYellSheet from "@assets/spritesheets/scenario_9/boyyell.png";
import CharacterYellData from "@assets/spritesheets/scenario_9/boyyell.json";
import CharacterIdleSheet from "@assets/spritesheets/player/scenario/idle/character_idle.png";
import CharacterIdleData from "@assets/spritesheets/player/scenario/idle/character_idle.json";
import DogRunJson from "@assets/spritesheets/scenario_9/dogrun.json";
import DogRunSheet from "@assets/spritesheets/scenario_9/dogrun.png";
import DogJumpJson from "@assets/spritesheets/scenario_9/doggjump.json";
import DogJumpSheet from "@assets/spritesheets/scenario_9/doggjump.png";
import DogFrisbeeJson from "@assets/spritesheets/scenario_9/dogfrisbee.json";
import DogFrisbeeSheet from "@assets/spritesheets/scenario_9/dogfrisbee.png";
import { GameObjects, Scene } from "phaser";
import SceneLifecycle from "../SceneLifecycle";
import { addFadeIn, fadeToBlack } from "../Utilities/Scene/Fader";
import ComponentService from "../Services/ComponentService";
import MakeFullscreen from "../Components/MakeFullscreen";
import WorldScene, { WorldSceneConfig } from "./WorldScene";
import MoveTo from "../Components/MoveTo";
import SettingsConfig = Phaser.Types.Scenes.SettingsConfig;
import Sprite = Phaser.GameObjects.Sprite;
import DepthLayers from "../DepthLayers";
import FrisbeeSqueak from "@assets/audio/objects/dog_toy_squeak.mp3";
import StartTextAudio from "@assets/audio/scenario_9/start_text.mp3";
import EndTextAudio from "@assets/audio/scenario_9/end_text.mp3";
import Option1Audio from "@assets/audio/scenario_9/option_1.mp3";
import Option2Audio from "@assets/audio/scenario_9/option_2.mp3";
import Option3Audio from "@assets/audio/scenario_9/option_3.mp3";

// Config for the scene defining gravity and debug settings.
export const config: SettingsConfig = {
	active: false,
	key: "scene-9",
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

	private frisbeeEntity!: Sprite;

	private dogEntity!: Sprite;

	private dogRun!: string;
	private dogJump!: string;
	private dogFrisbee!: string;

	private option1!: string;

	private option2!: string;

	private option3!: string;
	
	private startText!: string;

	private endText!: string;

	private frisbee!: string;
	private frisbee2!: string;

	private characterRun!: string;

	private exitSceneKey!: string;

	private characterWalk!: string;

	private characterIdle!: string;
	
	private characterYell!: string;

	private sparkleEntity!: Sprite;

	private dogRunAnims!: Phaser.Animations.Animation[];
	private dogJumpAnims!: Phaser.Animations.Animation[];

	private characterRunAnims!: Phaser.Animations.Animation[];

	constructor(cfg: SettingsConfig = config) {
		super(cfg);
	}

	public init(): void {
		this.dogRun = "dogRun9";
		this.dogJump = "dogJump9";
		this.dogFrisbee = "dogFrisbee9";
		this.option1 = "option19";
		this.option2 = "option29";
		this.option3 = "option39";
		this.startText = "starttext9";
		this.endText = "endtext9";
		this.frisbee = "frisbee";
		this.frisbee2 = "frisbee2";
		this.characterRun = "boyRun9";
		this.characterWalk = "boyWalk9";
		this.characterIdle = "boyIdle9";
		this.characterYell = "boyYell9";

		if (!WorldSceneConfig.key) {
			throw Error("Exit scene key is undefined");
		}

		this.exitSceneKey = WorldSceneConfig.key;

		this.components = new ComponentService();

		this.characterRunAnims = [];
		this.dogRunAnims = [];
		this.dogJumpAnims = [];

		// The moment the scene renders, a fade from black is started using this function.
		addFadeIn(this);
	}

	// A key has to be unique for the entire project, not just this scene.
	public preload(): void {
		this.load.image("background9", BackgroundImage);
		this.load.image(this.option1, Option1);
		this.load.image(this.option2, Option2);
		this.load.image(this.option3, Option3);
		this.load.image(this.startText,StartText);
		this.load.image(this.endText, EndText);
		this.load.image(this.frisbee, Frisbee);
		this.load.image(this.frisbee2, Frisbee2);
		this.load.audio("frisbeesqueak9", FrisbeeSqueak);
		this.load.aseprite(
			this.characterRun,
			CharacterRunSheet,
			CharacterRunData
		);
		this.load.aseprite(
			this.characterWalk,
			CharacterYellSheet,
			CharacterYellData
		);
		this.load.aseprite(
			this.characterIdle,
			CharacterIdleSheet,
			CharacterIdleData
		);

		this.load.aseprite(this.dogRun, DogRunSheet, DogRunJson);
		this.load.aseprite(this.dogJump, DogJumpSheet, DogJumpJson);
		this.load.aseprite(this.dogFrisbee, DogFrisbeeSheet, DogFrisbeeJson);
		this.load.aseprite(this.characterYell, CharacterYellSheet, CharacterYellData);

		this.load.audio("9startTextAudio", StartTextAudio);
		this.load.audio("9endTextAudio", EndTextAudio);
		this.load.audio("9option1Audio", Option1Audio);
		this.load.audio("9option2Audio", Option2Audio);
		this.load.audio("9option3Audio", Option3Audio);
	}

	public create(): void {
		const centerX = this.scale.displaySize.width * 0.5;
		const centerY = this.scale.displaySize.height * 0.5;

		const img = this.add.image(centerX, centerY, "background9");

		this.components.addComponent(img, MakeFullscreen);

		// todo; make into a component
		this.dogRunAnims.push(...this.anims.createFromAseprite(this.dogRun));
		this.dogJumpAnims.push(...this.anims.createFromAseprite(this.dogJump));
		this.characterRunAnims.push(...this.anims.createFromAseprite(this.characterRun));

		this.createSituation();
	}

	public update(time: number, delta: number): void {
		super.update(time, delta);
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
			700,
			this.characterIdle
		);
		
		this.characterEntity
			.play(this.characterIdle)
			.setScale(0.7)
			.setDepth(2);

		this.frisbeeEntity = this.add.sprite(1070, 740, this.frisbee2).setScale(0.7).setDepth(DepthLayers.Grass);
		
		this.dogEntity = this.add.sprite(
			0,
			this.characterEntity.y + 100,
			this.dogRun
		);
		this.dogEntity
			.setScale(1)
			.play({ key: this.dogRunAnims[0].key, repeat: -1, frameRate: 8 });

		const moveTo = this.components.addComponent(this.dogEntity, MoveTo);

		moveTo.setTarget({
			x: this.characterEntity.x - 300,
			y: this.dogEntity.y-100,
		});

		moveTo.velocity = 200;

		moveTo.movingDone = () => {
			this.dogEntity.play({
				key: this.dogJumpAnims[0].key,
				repeat: -1,
				frameRate: 2
			});
			this.sound.add("9startTextAudio", {volume: 1}).play();
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
			this.game.sound.removeByKey("9startTextAudio");
			this.sound.add("9option1Audio", {volume: 1}).play();
			button1.angle = 5;			
		});
		button1.on('pointerout',() => {
			this.game.sound.removeByKey("9option1Audio");
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
			this.game.sound.removeByKey("9startTextAudio");
			this.sound.add("9option2Audio", {volume: 1}).play();
			button2.angle = 5;			
		});
		button2.on('pointerout',() => {
			this.game.sound.removeByKey("9option2Audio");
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
			this.game.sound.removeByKey("9startTextAudio");
			this.sound.add("9option3Audio", {volume: 1}).play();
			button3.angle = 5;			
		});
		button3.on('pointerout',() => {
			this.game.sound.removeByKey("9option3Audio");
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

	//stand still and scream (maybe)
	private createResult1(): void {
		this.anims.create({
			key: this.characterYell,
			frameRate: 2,
			frames: this.anims.generateFrameNumbers(this.characterYell, {
				start: 0,
				end: 1,
			}),
			repeat: -1,
		});

		this.characterEntity.setScale(0.74).play(this.characterYell);

		this.frisbeeEntity.destroy();

		this.dogEntity.play({ key: this.dogJumpAnims[0].key, repeat: -1, frameRate: 2}).setDepth(DepthLayers.PLAYER);

		setTimeout(() => {
			this.add.image(600,130,"mixedemotion").setScale(0.6);
			this.add.image(600,300,this.endText).setScale(0.6);	
			const replaybutton = this.add.image(1090,360,"replaybutton").setScale(0.6).setInteractive({ useHandCursor: true, pixelPerfect: true });
			this.sound.add("mixedemotionaudio", {volume: 1}).play();
			setTimeout(() => {
				this.sound.add("9endTextAudio", {volume: 1}).play();
			}, 3000);
			replaybutton.on("pointerdown", () => {
				this.game.sound.removeByKey("mixedemotionaudio");
				this.game.sound.removeByKey("9endTextAudio");
				this.scene.restart();
			});			
		}, 5000);
	}
	
	//run away (wrong)
	private createResult2(): void {
		this.dogEntity.play({ key: this.dogRunAnims[0].key, repeat: -1 });

		const moveToHusky = this.components.addComponent(
			this.dogEntity,
			MoveTo
		);

		moveToHusky.setTarget({
			x: 2300,
			y: this.dogEntity.y-200,
		});

		moveToHusky.velocity = 200;

		this.characterEntity
			.play({ key: this.characterRunAnims[0].key, repeat: -1 })
			.setScale(0.7);

		const moveToCharacter = this.components.addComponent(
			this.characterEntity,
			MoveTo
		);

		moveToCharacter.setTarget({
			x: 2100,
			y: this.characterEntity.y-200,
		});

		moveToCharacter.velocity = 200;

		this.frisbeeEntity.destroy();

		setTimeout(() => {
			this.add.image(600,130,"bademotion").setScale(0.6);
			this.add.image(600,300,this.endText).setScale(0.6);					
			const replaybutton = this.add.image(1090,360,"replaybutton").setScale(0.6).setInteractive({ useHandCursor: true, pixelPerfect: true });
			this.sound.add("bademotionaudio", {volume: 1}).play();			
			setTimeout(() => {
				this.sound.add("9endTextAudio", {volume: 1}).play();
			}, 2500);
			replaybutton.on("pointerdown", () => {
				this.game.sound.removeByKey("bademotionaudio");
				this.game.sound.removeByKey("9endTextAudio");	
				this.scene.restart();
			});
			
		}, 5000);
	}

	//stand still (good)
	private createResult3(): void {
		this.anims.create({
			key: this.dogFrisbee,
			frameRate: 2,
			frames: this.anims.generateFrameNumbers(this.dogFrisbee, {
				start: 0,
				end: 1,
			}),
			repeat: -1,
		});
		
		const moveFrisbee = this.components.addComponent(
			this.frisbeeEntity,
			MoveTo
		);

		moveFrisbee.setTarget({
			x: this.frisbeeEntity.x-75,
			y: this.frisbeeEntity.y+75
		});

		moveFrisbee.velocity = 250;

		moveFrisbee.movingDone = () => {
			var squeal = this.sound.add("frisbeesqueak9");
			squeal.play();	
			this.dogEntity.play(this.dogFrisbee).setY(750);
			this.frisbeeEntity.destroy();
		};		

		setTimeout(() => {
			this.add.image(600,130,"goodemotion").setScale(0.6);
			this.add.image(600,300,this.endText).setScale(0.6);					
			const continuebutton = this.add.image(1090,360,"continuebutton").setScale(0.6).setInteractive({ useHandCursor: true, pixelPerfect: true });
			this.sound.add("goodemotionaudio", {volume: 1}).play();	
			setTimeout(() => {
				this.sound.add("9endTextAudio", {volume: 1}).play();
			}, 3000);
			continuebutton.on("pointerdown", () => {
				continuebutton.disableInteractive();
				this.game.sound.removeByKey("goodemotionaudio");
				this.game.sound.removeByKey("9endTextAudio");
				WorldScene.scenario9Fininshed = true;
				
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
					targets: [badgeCaseImage,badgeS1Image,badgeS2Image,badgeS3Image,badgeS4Image,badgeS5Image,badgeS6Image,badgeS7Image,badgeS8Image,badgeS10Image],
					ease: 'Sine.easeInOut',
					duration: 500,
					delay: 0,
					alpha: {
					  getStart: () => 0,
					  getEnd: () => 1					  
					}					
				  });
				  this.add.tween({
					targets: [badgeS9Image],
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
					1205,
					690,
					"sparkles"
				)
				
				this.sparkleEntity.play("sparkles").setScale(0.7).setDepth(6);
			  	    
				  setTimeout(() => {
						this.moveScene();
				  }, 4000);
			});			
		}, 5000);
	}

	

	private moveScene() {
		fadeToBlack(this, () => {
			this.scene.stop(this.scene.key).wake(this.exitSceneKey);
			this.scene.start("UIScene");
		});
	}
}
