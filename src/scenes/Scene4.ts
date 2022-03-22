import Background from "@assets/images/scenario_4/BG.png";
import CharacterRunSheet from "@assets/spritesheets/player/scenario/run/character_run.png";
import CharacterRunData from "@assets/spritesheets/player/scenario/run/character_run.json";
import CharacterWalkSheet from "@assets/spritesheets/player/scenario/walk/character_walk.png";
import CharacterWalkData from "@assets/spritesheets/player/scenario/walk/character_walk.json";
import Option1 from "@assets/images/scenario_4/option_1.png";
import Option2 from "@assets/images/scenario_4/option_2.png";
import Option3 from "@assets/images/scenario_4/option_3.png";
import OptionStick from "@assets/images/world/option_stick.png"
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
import { WorldSceneConfig } from "./WorldScene";
import { addFadeIn, fadeToBlack } from "../Utilities/Scene/Fader";
import MoveTo from "../Components/MoveTo";
import FixedHeightAnimator from "../Components/FixedHeightAnimator";
import { waitFor } from "../Utilities/Scene/SceneUtil";
import SettingsConfig = Phaser.Types.Scenes.SettingsConfig;
import Sprite = Phaser.GameObjects.Sprite;

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

	private optionStick!: string;

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
		this.shrubbery = "shrubbery"

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

			this.characterEntity.toggleFlipX().play({
				key: this.characterRunAnims[0].key,
				repeat: -1,
			});

			moveTo.setTarget({
				x: this.characterEntity.x + 700,
				y: this.characterEntity.y + 50,
			});

			moveTo.velocity = 300;

			moveTo.movingDone = () => {
				this.characterEntity.stop();
				this.moveScene();
			};
		};

		//this.cameras.main.flash(2000, 200, 0, 0);
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
				this.moveScene();
			}
		}
		//this.cameras.main.flash(2000, 0, 200, 0);
	}

	private createResult3() {
		this.huskyEntity.play({ key: this.huskyJumpAnims[0].key, repeat: -1 });

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
			x: this.characterEntity.x + 700,
			y: this.characterEntity.y + 50,
		});

		moveToPlayer.velocity = 300;

		moveToPlayer.movingDone = () => {
			this.characterEntity.stop();
			this.moveScene();
		};

		//this.cameras.main.flash(2000, 200, 0, 0);
	}

	

	private moveScene() {
		fadeToBlack(this, () => {
			this.scene.stop(this.scene.key).wake(this.exitSceneKey);
		});
	}
}
