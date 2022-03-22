import BackgroundImage from "@assets/images/scenario_1/BG.png";
import Option1 from "@assets/images/scenario_1/option_1.png";
import Option2 from "@assets/images/scenario_1/option_2.png";
import Option3 from "@assets/images/scenario_1/option_3.png";
import OptionStick from "@assets/images/world/option_stick.png";
import Playground from "@assets/images/scenario_1/playground.png";
import PlayerIdleSheet from "@assets/spritesheets/player/scenario/idle/character_idle.png";
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
import { GameObjects, Scene } from "phaser";
import SceneLifecycle from "../SceneLifecycle";
import { addFadeIn, fadeToBlack } from "../Utilities/Scene/Fader";
import ComponentService from "../Services/ComponentService";
import MakeFullscreen from "../Components/MakeFullscreen";
import { WorldSceneConfig } from "./WorldScene";
import MoveTo from "../Components/MoveTo";
import sceneSong from "@assets/audio/scene.mp3";
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

    private playerIdle!: string;

	private playerWalk!: string;

    private playerPoint!: string;

    private playerShout!: string;

    private dogIdle!: string;

    private bullyAndDog!: string;

    private bullyIdle!: string;

	private option1!: string;

	private option2!: string;

	private option3!: string;

	private optionStick!: string;

	private playground!: string;

	private exitSceneKey!: string;

	constructor(cfg: SettingsConfig = config) {
		super(cfg);
	}

	public init(): void {

		//initializes variables, the string value has to be unique or phaser will reuse it in other scenes
        this.playerIdle = "playeridle1";
		this.playerWalk = "playerwalk1";
        this.playerPoint = "playerpoint1";
        this.playerShout = "playershout1";
        this.dogIdle = "dogidle1";
        this.bullyAndDog = "bullyanddog1";
        this.bullyIdle = "bullyidle1";        
		this.option1 = "option11";
		this.option2 = "option21";
		this.option3 = "option31";
		this.optionStick = "stick1";
		this.playground = "playgground1";

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
        this.load.aseprite(this.playerIdle, PlayerIdleSheet, PlayerIdleData);
		this.load.aseprite(this.playerWalk, PlayerWalkSheet, PlayerWalkData);
        this.load.aseprite(this.playerPoint, PlayerPointSheet, PlayerPointData);	
        this.load.aseprite(this.playerShout, PlayerShoutSheet, PlayerShoutData);
        this.load.aseprite(this.dogIdle,DogIdleSheet,DogIdleData);
        this.load.aseprite(this.bullyAndDog,BullyAndDogSheet,BullyAndDogData);
        this.load.aseprite(this.bullyIdle,BullyIdleSheet,BullyIdleData);
		this.load.audio("sceneSong", sceneSong);
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
		var song = this.sound.add("sceneSong");
		song.play({
			loop: true
		});

		//player entity
        this.anims.create({
			key: this.playerIdle,
			frameRate: 2,
			frames: this.anims.generateFrameNumbers(
				this.playerIdle,
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
			this.playerIdle
		);
		this.playerEntity.setDepth(1);
		this.playerEntity
			.play(this.playerIdle)
			.toggleFlipX()
			.setScale(1);
		
		//bully entity (bully and dog animation)
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

		this.bullyEntity = this.add.sprite(
			1300,
			550,
			this.bullyAndDog
		);
		this. bullyEntity
			.play(this.bullyAndDog)
			.setScale(1);
			
		this.createChoice();		
	}

	private createChoice(): void {
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
	
			this.dogEntity = this.add.sprite(
				1200,
				700,
				this.dogIdle
			);
			this.dogEntity
				.play(this.dogIdle)
				.setScale(1);		
		}, 1000);
		
		setTimeout(() => {
			this.moveScene();
		}, 5000);
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
				this.moveScene();
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
			this.moveScene();
		}, 5000);
	}

	//fade to black and back to overworld
	private moveScene() {
		fadeToBlack(this, () => {
			this.scene.stop(this.scene.key).wake(this.exitSceneKey);
		});
		this.game.sound.removeByKey("sceneSong");
		this.game.sound.resumeAll();
	}
}