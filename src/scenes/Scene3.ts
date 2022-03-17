import BackgroundImage from "@assets/images/scenario_3/BG.png";
import { Scene } from "phaser";

import CharacterPupHoldTexture from "@assets/spritesheets/scenario_3/character_pup_hold.png";
import CharacterPupHoldConfig from "@assets/spritesheets/scenario_3/character_pup_hold.json";
import CharacterIdleTexture from "@assets/spritesheets/player/scenario/idle/character_idle.png";
import CharacterIdleConfig from "@assets/spritesheets/player/scenario/idle/character_idle.json";
import MotherDogTexture from "@assets/spritesheets/scenario_3/mother_dog.png";
import MotherDogConfig from "@assets/spritesheets/scenario_3/mother_dog.json";
import CharacterWalkTexture from "@assets/spritesheets/player/scenario/walk/character_walk.png";
import CharacterWalkConfig from "@assets/spritesheets/player/scenario/walk/character_walk.json";
import CharacterRunTexture from "@assets/spritesheets/player/scenario/run/character_run.png";
import CharacterRunConfig from "@assets/spritesheets/player/scenario/run/character_run.json";
import CharacterPupHoldFearTexture from "@assets/spritesheets/scenario_3/character_pup_hold_fear.png";
import CharacterPupHoldFearConfig from "@assets/spritesheets/scenario_3/character_pup_hold_fear.json";
import PointOfInterestCloudTexture from "@assets/spritesheets/pointOfInterest/cloud/poi_cloud.png";
import PointOfInterestCloudConfig from "@assets/spritesheets/pointOfInterest/cloud/poi_cloud.json";
import AdultNPCTexture from "@assets/spritesheets/scenario_3/npc_1.png";
import AdultNPCConfig from "@assets/spritesheets/scenario_3/npc_1.json";
import ApprovalChatTexture from "@assets/spritesheets/scenario_3/approval_chat_icon.png";
import ApprovalChatConfig from "@assets/spritesheets/scenario_3/approval_chat_icon.json";
import QuestionChatTexture from "@assets/spritesheets/scenario_3/question_chat_icon.png";
import QuestionChatConfig from "@assets/spritesheets/scenario_3/question_chat_icon.json";
import Option1Texture from "@assets/images/scenario_3/option_1.png";
import Option2Texture from "@assets/images/scenario_3/option_2.png";
import Option3Texture from "@assets/images/scenario_3/option_3.png";
import OptionStick from "@assets/images/world/option_stick.png";

import { WorldSceneConfig } from "./WorldScene";

import SceneLifecycle from "../SceneLifecycle";

import { addFadeIn, fadeToBlack } from "../Utilities/Scene/Fader";
import ComponentService from "../Services/ComponentService";
import MakeFullscreen from "../Components/MakeFullscreen";
import MoveTo from "../Components/MoveTo";
import {
	createOption,
	optionEffect,
} from "../Utilities/Scene/ScenarioOptionUtil";
import { waitFor } from "../Utilities/Scene/SceneUtil";
import FixedHeightAnimator from "../Components/FixedHeightAnimator";
import SettingsConfig = Phaser.Types.Scenes.SettingsConfig;
import GameObject = Phaser.GameObjects.GameObject;

export const config: SettingsConfig = {
	active: false,
	key: "scene-3",
	physics: {
		default: "arcade",
		arcade: {
			gravity: { y: 0 },
			debug: process.env.NODE_ENV === "development",
		},
	},
};

export default class Scene3 extends Scene implements SceneLifecycle {
	private option1Img!: string;

	private option2Img!: string;

	private option3Img!: string;

	private optionStick!: string;

	private exitSceneKey!: string;

	private components!: ComponentService;

	private motherDogSleep!: string;

	private motherDog!: string;

	private characterHoldPup!: string;

	private characterWalk!: string;

	private characterIdle!: string;

	private characterRun!: string;

	private characterHoldPupFear!: string;

	private pointOfInterestCloud!: string;

	private adultNPC!: string;

	private approvalChatIcon!: string;

	private questionChatIcon!: string;

	constructor(cfg: SettingsConfig = config) {
		super(cfg);
	}

	private static disableOptions(options: GameObject[]): void {
		for (let i = 0; i < options.length; i += 1) {
			const option = options[i];
			option.disableInteractive();
		}
	}

	public init(): void {
		this.components = new ComponentService();

		if (!WorldSceneConfig.key) {
			throw Error("Exit scene key is undefined");
		}

		this.exitSceneKey = WorldSceneConfig.key;

		this.motherDog = "scene3motherDog";

		this.characterWalk = "scene3characterWalk";
		this.characterHoldPup = "scene3characterHoldPup";
		this.characterIdle = "scene3characterIdle";
		this.characterRun = "scene3characterRun";
		this.characterHoldPupFear = "scene3characterHoldPupFear";
		this.adultNPC = "scene3AdultNPC";

		this.pointOfInterestCloud = "poi_cloud";
		this.approvalChatIcon = "scene3ApprovalIcon";
		this.questionChatIcon = "scene3QuestionIcon";

		this.option1Img = "scene3Option13";
		this.option2Img = "scene3Option23";
		this.option3Img = "scene3Option33";
		this.optionStick = "stick3";

		addFadeIn(this);
	}

	// A key has to be unique for the entire project, not just this scene.
	public preload(): void {
		this.load.image("background3", BackgroundImage);
		this.load.image(this.optionStick, OptionStick);
		this.load.aseprite(this.motherDog, MotherDogTexture, MotherDogConfig);
		this.load.aseprite(
			this.characterHoldPup,
			CharacterPupHoldTexture,
			CharacterPupHoldConfig
		);
		this.load.aseprite(
			this.characterWalk,
			CharacterWalkTexture,
			CharacterWalkConfig
		);
		this.load.aseprite(
			this.characterIdle,
			CharacterIdleTexture,
			CharacterIdleConfig
		);
		this.load.aseprite(
			this.characterRun,
			CharacterRunTexture,
			CharacterRunConfig
		);
		this.load.aseprite(
			this.characterHoldPupFear,
			CharacterPupHoldFearTexture,
			CharacterPupHoldFearConfig
		);

		this.load.aseprite(
			this.pointOfInterestCloud,
			PointOfInterestCloudTexture,
			PointOfInterestCloudConfig
		);

		this.load.aseprite(this.adultNPC, AdultNPCTexture, AdultNPCConfig);

		this.load.aseprite(
			this.approvalChatIcon,
			ApprovalChatTexture,
			ApprovalChatConfig
		);

		this.load.aseprite(
			this.questionChatIcon,
			QuestionChatTexture,
			QuestionChatConfig
		);

		this.load.image(this.option1Img, Option1Texture);
		this.load.image(this.option2Img, Option2Texture);
		this.load.image(this.option3Img, Option3Texture);
	}

	public create(): void {
		const background = this.add.image(0, 0, "background3");
		this.components.addComponent(background, MakeFullscreen);

		// define entities
		const motherDog = this.add
			.sprite(510, 417, this.motherDogSleep)
			.setOrigin(0, 0);

		const character = this.add
			.sprite(this.scale.width, 213, this.characterWalk)
			.setOrigin(0, 0)
			.toggleFlipX();

		// define components
		const characterMover = this.components.addComponent(character, MoveTo);

		const characterAnimator = this.components.addComponent(
			character,
			FixedHeightAnimator
		);
		const motherDogAnimator = this.components.addComponent(
			motherDog,
			FixedHeightAnimator
		);

		// adjust parameters
		characterMover.velocity = 170;
		characterAnimator.desiredHeight = 744;
		motherDogAnimator.desiredHeight = 470;

		characterAnimator.addAnimations(
			...this.anims.createFromAseprite(this.characterWalk),
			...this.anims.createFromAseprite(this.characterIdle),
			...this.anims.createFromAseprite(this.characterHoldPup),
			...this.anims.createFromAseprite(this.characterRun),
			...this.anims.createFromAseprite(this.characterHoldPupFear)
		);
		motherDogAnimator.addAnimations(
			...this.anims.createFromAseprite(this.motherDog)
		);

		// use components & entities
		characterAnimator.loop(0);
		motherDogAnimator.loop(1);

		characterMover.movingDone = () => {

			// todo: idle animation without pup
			characterAnimator.loop(1);
			character.toggleFlipX();

			const stick1 = this.add.image(420,1260, this.optionStick);
			const stick1move = this.components.addComponent(
				stick1,
				MoveTo
			);
			stick1move.setTarget({
				x: stick1.x,
				y: stick1.y - 300,
			});		
			stick1move.velocity = 280;
			const stick2 = this.add.image(970,1260, this.optionStick);
			const stick2move = this.components.addComponent(
				stick2,
				MoveTo
			);
			stick2move.setTarget({
				x: stick2.x,
				y: stick2.y - 300,
			});		
			stick2move.velocity = 280;
			const stick3 = this.add.image(1510,1260, this.optionStick);
			const stick3move = this.components.addComponent(
				stick3,
				MoveTo
			);
			stick3move.setTarget({
				x: stick3.x,
				y: stick3.y - 300,
			});		
			stick3move.velocity = 280;
			// ... present stages
			const options = [
				createOption(this, this.option1Img, 420, 1200).setOrigin(0.5),
				createOption(this, this.option2Img, 970, 1200).setOrigin(0.5),
				createOption(this, this.option3Img, 1510, 1200).setOrigin(0.5),
			];
			const button1move = this.components.addComponent(
				options[0],
				MoveTo
			);
			button1move.setTarget({
				x: options[0].x,
				y: options[0].y - 300,
			});		
			button1move.velocity = 280;			
			const button2move = this.components.addComponent(
				options[1],
				MoveTo
			);
			button2move.setTarget({
				x: options[1].x,
				y: options[1].y - 300,
			});		
			button2move.velocity = 280;
			const button3move = this.components.addComponent(
				options[2],
				MoveTo
			);
			button3move.setTarget({
				x: options[2].x,
				y: options[2].y - 300,
			});		
			button3move.velocity = 280;

			options[0].on("pointerover", () => {
				options[0].angle = 5;			
			});
			options[0].on('pointerout',() => {
				options[0].angle = 0;
			})
			options[1].on("pointerover", () => {
				options[1].angle = 5;			
			});
			options[1].on('pointerout',() => {
				options[1].angle = 0;
			})
			options[2].on("pointerover", () => {
				options[2].angle = 5;			
			});
			options[2].on('pointerout',() => {
				options[2].angle = 0;
			})

			options[0].on(
				"pointerdown",() => {		
				//disables sign 1, moves signs and sticks of option 2 and 3 offscreen
				options[0].disableInteractive()				
				button2move.setTarget({
					x: options[1].x,
					y: options[1].y + 300,
				});		
				button2move.velocity = 280;
				stick2move.setTarget({
					x: stick2.x,
					y: stick2.y + 300,
				});		
				stick2move.velocity = 280;
				button3move.setTarget({
					x: options[2].x,
					y: options[2].y + 300,
				});		
				button3move.velocity = 280;
				stick3move.setTarget({
					x: stick3.x,
					y: stick3.y + 300,
				});		
				stick3move.velocity = 280;			
				this.option1(
					options,
					characterAnimator,
					motherDogAnimator,
					characterMover
				);
			});

			options[1].on(
				"pointerdown", () => {
					//disables sign 2, moves signs and sticks of option 1 and 3 offscreen
				stick1move.setTarget({
					x: stick1.x,
					y: stick1.y + 300,
				});		
				stick1move.velocity = 280;
				button1move.setTarget({
					x: options[0].x,
					y: options[0].y + 300,
				});		
				button1move.velocity = 280;
				options[1].disableInteractive()				
				button3move.setTarget({
					x: options[2].x,
					y: options[2].y + 300,
				});		
				button3move.velocity = 280;
				stick3move.setTarget({
					x: stick3.x,
					y: stick3.y + 300,
				});		
				stick3move.velocity = 280;
					this.option2(
						options,
						characterAnimator,
						motherDogAnimator,
						characterMover
					);

				}
			);

			options[2].on(
				"pointerdown", () => {
					stick1move.setTarget({
						x: stick1.x,
						y: stick1.y + 300,
					});		
					stick1move.velocity = 280;
					button1move.setTarget({
						x: options[0].x,
						y: options[0].y + 300,
					});		
					button1move.velocity = 280;
					stick2move.setTarget({
						x: stick2.x,
						y: stick2.y + 300,
					});		
					stick2move.velocity = 280;
					button2move.setTarget({
						x: options[1].x,
						y: options[1].y + 300,
					});		
					button2move.velocity = 280;
					options[2].disableInteractive();
					this.option3(
						options,
						characterAnimator,
						characterMover
					);

				}
			);
		};

		characterMover.setTarget({ x: 1168, y: character.y });
	}

	public option1(
		options: GameObject[],
		characterAnimator: FixedHeightAnimator,
		motherDogAnimator: FixedHeightAnimator,
		characterMover: MoveTo
	): void {
		// disable interaction all options after click
		Scene3.disableOptions(options);

		// play character idle animation
		characterAnimator.loop(2);

		// display wrong choice effect
		optionEffect(this, false);

		// wait a bit to let the it sink in
		waitFor(
			this,
			() => {
				// play feared pup hold animation
				characterAnimator.loop(4);

				// dog starts barking
				motherDogAnimator.loop(0);

				// wait for 2 seconds
				waitFor(
					this,
					() => {
						// player starts running away
						characterMover.velocity = 325;

						characterMover.movingDone = () => {
							this.moveScene();
						};

						characterMover.setTarget({
							x: this.scale.width,
							y: characterMover.movableObj.y,
						});

						characterAnimator.loop(3);
					},
					2000
				);
			},
			2000
		);
	}

	public option2(
		options: GameObject[],
		characterAnimator: FixedHeightAnimator,
		motherDogAnimator: FixedHeightAnimator,
		characterMover: MoveTo
	): void {
		Scene3.disableOptions(options);

		// display wrong choice effect
		optionEffect(this, false);

		// wait a bit to let the it sink in
		waitFor(
			this,
			() => {
				const originalY = characterMover.movableObj.y;
				// slowly move character towards dog
				characterAnimator.loop(0);
				characterAnimator.animatable.toggleFlipX();
				characterMover.velocity = 100;
				characterMover.movingDone = () => {
					characterAnimator.animatable.toggleFlipX();
					characterAnimator.loop(1);

					const cloudAnims = this.anims.createFromAseprite(
						this.pointOfInterestCloud
					);

					const cloud = this.add
						.sprite(
							motherDogAnimator.animatable.x +
								motherDogAnimator.animatable.displayWidth +
								-40,
							motherDogAnimator.animatable.y + 40,
							this.pointOfInterestCloud
						)
						.setOrigin(0, 0)
						.setScale(1.5)
						.play({ key: cloudAnims[0].key, repeat: -1 }, true);

					waitFor(
						this,
						() => {
							cloud.destroy();

							motherDogAnimator.loop(0);

							characterMover.velocity = 325;
							characterMover.movingDone = () => this.moveScene();
							characterMover.setTarget({
								x: this.scale.width,
								y: originalY,
							});
							characterAnimator.loop(3);
						},
						1000
					);
				};

				characterMover.setTarget({
					x: 968,
					y: characterMover.movableObj.y + 100,
				});
			},
			2000
		);
	}

	public option3(
		options: GameObject[],
		characterAnimator: FixedHeightAnimator,
		characterMover: MoveTo
	) {
		Scene3.disableOptions(options);

		// display wrong choice effect
		optionEffect(this, true);

		// load npc on right side of the scene
		const adultNpc = this.add
			.sprite(this.scale.width, 100, this.adultNPC)
			.setOrigin(0, 0)
			.toggleFlipX();

		const adultAnimator = this.components.addComponent(
			adultNpc,
			FixedHeightAnimator
		);

		const adultMover = this.components.addComponent(adultNpc, MoveTo);

		adultAnimator.addAnimations(
			...this.anims.createFromAseprite(this.adultNPC)
		);
		adultAnimator.desiredHeight = 900;
		adultAnimator.loop(1);

		adultMover.setTarget({
			x: characterAnimator.animatable.x + 240,
			y: adultNpc.y,
		});

		adultMover.movingDone = () => {
			adultAnimator.loop(0);

			waitFor(
				this,
				() => {
					characterAnimator.animatable.toggleFlipX();

					const cloudAnims = this.anims.createFromAseprite(
						this.pointOfInterestCloud
					);

					const cloud = this.add
						.sprite(
							characterAnimator.animatable.x - 140,
							characterAnimator.animatable.y,
							this.pointOfInterestCloud
						)
						.toggleFlipX()
						.setOrigin(0, 0)
						.setScale(1.5)
						.play({ key: cloudAnims[0].key, repeat: -1 }, true);

					waitFor(
						this,
						() => {
							cloud.destroy();

							const questionAnims = this.anims.createFromAseprite(
								this.questionChatIcon
							);

							// todo: Create question animation once it's available
							const question = this.add
								.sprite(
									characterAnimator.animatable.x - 140,
									characterAnimator.animatable.y,
									this.questionChatIcon
								)
								.setOrigin(0, 0)
								.setScale(1.5)
								.play(
									{ key: questionAnims[0].key, repeat: -1 },
									true
								);

							waitFor(
								this,
								() => {
									question.destroy();

									const approvalAnims =
										this.anims.createFromAseprite(
											this.approvalChatIcon
										);

									const approval = this.add
										.sprite(
											adultNpc.x + 20,
											adultNpc.y,
											this.approvalChatIcon
										)
										.play(
											{
												key: approvalAnims[0].key,
												repeat: -1,
											},
											true
										)
										.setScale(1.5);

									waitFor(
										this,
										() => {
											approval.destroy();
											characterAnimator.loop(0);
											characterMover.setTarget({
												x:
													characterMover.movableObj
														.x - 100,
												y:
													characterMover.movableObj
														.y + 100,
											});

											characterMover.movingDone = () => {
												characterAnimator.animatable.toggleFlipX();
												characterAnimator.loop(1);
												this.moveScene();
											};
										},
										3000
									);
								},
								3000
							);
						},
						3000
					);
				},
				500
			);
		};
	}

	public update(): void {
		// todo: figure out a good way to implement a finite state machine so there is no
		// 		 requirement for such deep nesting
	}

	private moveScene() {
		fadeToBlack(this, () => {
			this.scene.stop(this.scene.key).wake(this.exitSceneKey);
		});
	}
}
