import worldTiles from "@assets/tilesheets/world_tiles.png";
import mainSceneTileData from "@assets/tilemaps/main_scene.json";
import poiCloudSheet from "@assets/spritesheets/pointOfInterest/cloud/poi_cloud.png";
import poiCloudData from "@assets/spritesheets/pointOfInterest/cloud/poi_cloud.json";
import huskyImage from "@assets/spritesheets/husky/husky.png";
import huskyJson from "@assets/spritesheets/husky/husky.json";
import huskyWaitImage from "@assets/images/world/husky_wait.png";
import Car from "@assets/images/scenario_6/car.png";
import DogInCarSheet from "@assets/spritesheets/scenario_6/dog_neutral.png";
import DogInCarData from "@assets/spritesheets/scenario_6/dog_neutral.json";
import Scene1DogSheet from "@assets/spritesheets/scenario_1/snuffelidle.png";
import Scene1DogData from "@assets/spritesheets/scenario_1/snuffelidle.json";
import { Scene } from "phaser";
import PlayerEntity from "../GameObjects/Entities/PlayerEntity";
import DepthSorter from "../Services/DepthSorter";
import DepthLayers from "../DepthLayers";
import MovableEntity from "../GameObjects/Entities/MovableEntity";
import PlayerMovement from "../Components/PlayerMovement";
import PlayerAnimator from "../Components/PlayerAnimator";
import ComponentService from "../Services/ComponentService";
import OverlayDispatcher from "../Components/OverlayDispatcher";
import CameraComponent from "../Components/CameraComponent";
import { addFadeIn, fadeToBlack } from "../Utilities/Scene/Fader";
import SceneLifecycle from "../SceneLifecycle";
import SettingsConfig = Phaser.Types.Scenes.SettingsConfig;
import Keys = Phaser.Input.Keyboard.KeyCodes;
import GameObject = Phaser.GameObjects.GameObject;

export const WorldSceneConfig: SettingsConfig = {
	key: "world-scene",
	physics: {
		default: "arcade",
		arcade: {
			debug: process.env.NODE_ENV === "development",
			fps: 60,
		},
	},
};

export default class WorldScene extends Scene implements SceneLifecycle {
	protected tilemapKey!: string;

	protected tilesetKey!: string;

	private poiCloud!: string;

	private dogInCar!: string;

	private scene1Dog!: string;

	private husky!: string;

	private huskyWait!: string;

	private car!: string;

	private dogAnimTags!: Phaser.Animations.Animation[];

	private components!: ComponentService;

	private depthSorter!: DepthSorter;

	private sceneSwitchKey!: Phaser.Input.Keyboard.Key;

	constructor(cfg = WorldSceneConfig) {
		super(cfg);
	}

	/**
	 * Initialise "constant" strings and properties.
	 */
	public init(): void {
		this.tilesetKey = "world_tiles";
		this.tilemapKey = "main_scene";

		this.poiCloud = "poi_cloud";
		this.dogInCar = "dogInCar";
		this.husky = "husky";
		this.huskyWait = "huskywait"
		this.car = "car";
		this.scene1Dog = "scene1dog";

		this.dogAnimTags = [];

		this.components = new ComponentService();
		this.depthSorter = new DepthSorter();

		addFadeIn(this);
	}

	/**
	 * Load assets.
	 * A key has to be unique for the entire project, not just this scene.
	 */
	public preload(): void {
		// Point of Interest Idle Animations
		this.load.aseprite(this.poiCloud, poiCloudSheet, poiCloudData);
		this.load.aseprite(this.dogInCar,DogInCarSheet,DogInCarData);
		this.load.aseprite(this.scene1Dog,Scene1DogSheet,Scene1DogData);


		// Player Idle & Move Animations
		this.load.aseprite(
			PlayerEntity.spriteKey,
			PlayerEntity.spriteSheet,
			PlayerEntity.spriteAtlas
		);

		// Husky idle & moving animations
		this.load.aseprite(this.husky, huskyImage, huskyJson);
		this.load.image(this.car,Car)
		this.load.image(this.tilesetKey, worldTiles);
		this.load.image(this.huskyWait, huskyWaitImage);
		this.load.tilemapTiledJSON({
			key: this.tilemapKey,
			url: mainSceneTileData,
		});
	}

	/**
	 * Create game objects and components
	 */
	public create(): void {
		this.sceneSwitchKey = this.input.keyboard.addKey(Keys.SPACE);

		// load the tilemap from tiled.
		const tilemap = this.make.tilemap({ key: this.tilemapKey });
		// add the textures the tilemap requires.
		const tileset = tilemap.addTilesetImage(
			this.tilesetKey,
			this.tilesetKey
		);

		// the Tiled layer name => look in the json file to find all names
		// the below capitalised variables represent each layer added to the Tiled map.
		// todo; remove the 2nd tileset.
		const FOREGROUND = tilemap.createLayer("FOREGROUND", tileset);
		const SKY = tilemap.createLayer("SKY", tileset);
		const OVERLAY = tilemap.createLayer("OVERLAY", tileset);
		const DECOR = tilemap.createLayer("DECOR", tileset);
		const BACKGROUND = tilemap.createLayer("BACKGROUND", tileset);

		// add collision to the layers which have collision specified inside tiled
		DECOR.setCollisionByProperty({ collision: true });1
		BACKGROUND.setCollisionByProperty({ collision: true });

		const collidables: GameObject[] = [];
		const overlappables: GameObject[] = [];
		let player: PlayerEntity | undefined;

		// todo; extract to it's own method or class which can interact with Tiled objects
		// loop over all the objects in the objects layer of the tilemap
		for (
			let i = 0, { objects } = tilemap.getObjectLayer("OBJECTS");
			i < objects.length;
			i += 1
		) {
			const obj = objects[i];
			switch (obj.type) {
				case "PlayerSpawn":
					{
						const p = new PlayerEntity(
							this,
							obj.x as number,
							obj.y as number
						);

						const mover = this.components.addComponent(
							p,
							PlayerMovement
						);
						const animator = this.components.addComponent(
							p,
							PlayerAnimator
						);

						animator.spriteKey = PlayerEntity.spriteKey;
						animator.spriteAtlas = PlayerEntity.spriteAtlas;
						animator.spriteSheet = PlayerEntity.spriteSheet;
						animator.mover = mover;

						this.components.addComponent(p, CameraComponent);

						this.physics.add.collider(p, DECOR);
						this.physics.add.collider(p, BACKGROUND);

						this.depthSorter.addSortable(p, DepthLayers.PLAYER);

						player = p;
					}
					break;
				case "Objective":
					if (obj.point) {
						if (obj.name === "School") {
							this.createSchoolScene(
								this,
								collidables,
								overlappables,
								obj.x as number,
								obj.y as number,
								"scene-1"
							);
						}else if (obj.name === "Fence") {
							this.createFenceScene(
								this,
								collidables,
								overlappables,
								obj.x as number,
								obj.y as number,
								"scene-2"
							);
						}else if (obj.name == "DogPupInHouse"){
							this.createDogPupInHouseScene(
								this,
								collidables,
								overlappables,
								obj.x as number,
								obj.y as number,
								"scene-3"
							);
						}else if (obj.name === "HuskyLamppost") {
							this.createDogLamppostScene(
								this,
								collidables,
								overlappables,
								obj.x as number,
								obj.y as number,
								"scene-4"
							);
						}else if (obj.name === "Guidedog") {
							this.createGuidedogScene(
								this,
								collidables,
								overlappables,
								obj.x as number,
								obj.y as number,
								"scene-5"
							);
						}else if (obj.name === "DogCarParkinglot") {
							this.createDogCarParkinglot(
								this,
								collidables,
								overlappables,
								obj.x as number,
								obj.y as number,
								"scene-6"
							);						
						}else if (obj.name === "HuskyIcecream") {
							this.createDogIceScene(
								this,
								collidables,
								overlappables,
								obj.x as number,
								obj.y as number,
								"scene-8"
							);
						}  else if (obj.name === "Cuddle") {
							this.createFenceScene(
								this,
								collidables,
								overlappables,
								obj.x as number,
								obj.y as number,
								"scene-11"
							);
						}
					} else if (obj.ellipse) {
						const props = obj.properties as any[];

						const radius = this.add.zone(
							obj.x as number,
							obj.y as number,
							obj.width as number,
							obj.height as number
						);

						for (let j = 0; j < props.length; j += 1) {
							const { name, value } = props[j] as {
								name: string;
								value: string | number | boolean;
							};
							switch (name) {
								case "target_scene":
									{
										const dispatcher =
											this.components.addComponent(
												radius,
												OverlayDispatcher
											);

										dispatcher.setDispatchCallback(
											(isOverlapping) => {
												if (
													this.sceneSwitchKey
														.isDown &&
													isOverlapping
												) {
													this.switchScene(
														value as string
													);
												}
											}
										);
									}
									break;
								case "collision_type":
									this.physics.world.enable(radius); // enable the zone's physics body

									(
										radius.body as Phaser.Physics.Arcade.Body
									).setCircle(obj.width as number);

									if (value === "collision") {
										collidables.push(radius);
									} else if (value === "overlap") {
										overlappables.push(radius);
									}

									break;
								default:
									break;
							}
						}
					}
					break;
				default:
					break;
			}
		}

		/**
		 * After all Tiled objects have been parsed and loaded, add collisions
		 * to the player character
		 */
		if (player !== undefined) {
			this.physics.add.collider(player, collidables);
			this.physics.add.overlap(player, overlappables);
		}

		// set world bounds
		this.physics.world.bounds.width = tilemap.widthInPixels;
		this.physics.world.bounds.height = tilemap.heightInPixels;

		// configure camera
		this.cameras.main.setBounds(
			0,
			0,
			tilemap.widthInPixels,
			tilemap.heightInPixels
		);

		// sort z indices
		BACKGROUND.setDepth(DepthLayers.BACKGROUND);
		OVERLAY.setDepth(DepthLayers.OVERLAY);
		DECOR.setDepth(DepthLayers.DECOR);

		this.depthSorter.setRatio(tilemap.heightInPixels * 1.1);
	}

	public update(time: number, delta: number): void {
		super.update(time, delta);
		this.depthSorter.sort(time, delta);
	}

	private createDogIceScene(
		scene: Scene,
		collidables: GameObject[],
		overlappables: GameObject[],
		x: number,
		y: number,
		target_scene: string
	): void {
		const poiCloudAnimTags = this.anims.createFromAseprite("poi_cloud");

		const dog = new MovableEntity(scene, x, y, this.husky).setScale(0.4);

		const dogTalkBubble = this.add.sprite(
			dog.x + 64,
			dog.y - 84,
			this.poiCloud
		);

		this.depthSorter.addSortable(dog, DepthLayers.PLAYER);

		this.dogAnimTags = this.anims.createFromAseprite(this.husky);

		dog.setBodySize(dog.width, dog.height / 5)
			.setOffset(0, (dog.height * 4) / 5)
			.play({ key: this.dogAnimTags[1].key, repeat: -1 }, true)
			.setImmovable(true)
			.setFlipX(true)
			.setDepth(DepthLayers.PLAYER)
			.setInteractive({ useHandCursor: true })
			.on("pointerdown", () => {
				if (dogTalkBubble.visible) {
					this.switchScene(target_scene);
				}
			});

		dogTalkBubble
			.setDepth(DepthLayers.OVERLAY)
			.play({ key: poiCloudAnimTags[0].key, repeat: -1 }, true)
			.setVisible(false)
			.setInteractive({ useHandCursor: true })
			.on("pointerdown", () => this.switchScene(target_scene));

		collidables.push(dog);

		// this.physics.add.collider(player, dog);

		const radius = this.add.zone(
			dog.x,
			dog.y,
			dog.displayWidth,
			dog.displayHeight
		);

		this.physics.world.enable(radius); // enable the zone's physics body

		(radius.body as Phaser.Physics.Arcade.Body)
			.setOffset(-radius.displayWidth * 0.5, -radius.displayHeight * 0.5)
			.setCircle(dog.displayWidth);

		// scene.physics.add.overlap(player, radius);

		overlappables.push(radius);

		const dispatcher = this.components.addComponent(
			radius,
			OverlayDispatcher
		);

		dispatcher.setDispatchCallback((isOverlapping) => {
			if (dogTalkBubble.visible !== isOverlapping) {
				dogTalkBubble.setVisible(isOverlapping);
			}

			if (isOverlapping && this.sceneSwitchKey.isDown) {
				this.switchScene(target_scene);
			}
		});
	}

	private createDogPupInHouseScene(
		scene: Scene,
		collidables: GameObject[],
		overlappables: GameObject[],
		x: number,
		y: number,
		target_scene: string
	): void {
		const poiCloudAnimTags = this.anims.createFromAseprite("poi_cloud");

		const dog = new MovableEntity(scene, x, y, this.husky).setVisible(false)
		const dogTalkBubble = this.add.sprite(x,y,this.poiCloud);

		dog.setBodySize(100,200)
			.setImmovable(true)
			.setDepth(DepthLayers.PLAYER)
			.setInteractive({ useHandCursor: true })
			.on("pointerdown", () => {
				if (dogTalkBubble.visible) {
					this.switchScene(target_scene);
				}
			});

		dogTalkBubble
			.setDepth(DepthLayers.OVERLAY)
			.play({ key: poiCloudAnimTags[0].key, repeat: -1 }, true)
			.setVisible(false)
			.setInteractive({ useHandCursor: true })
			.on("pointerdown", () => this.switchScene(target_scene));

		collidables.push(dog);

		const radius = this.add.zone(
			x,
			y,
			450,
			150
		);

		this.physics.world.enable(radius); // enable the zone's physics body
		(radius.body as Phaser.Physics.Arcade.Body)
			.setOffset(0,160)

		overlappables.push(radius);

		const dispatcher = this.components.addComponent(
			radius,
			OverlayDispatcher
		);

		dispatcher.setDispatchCallback((isOverlapping) => {
			if (dogTalkBubble.visible !== isOverlapping) {
				dogTalkBubble.setVisible(isOverlapping);
			}

			if (isOverlapping && this.sceneSwitchKey.isDown) {
				this.switchScene(target_scene);
			}
		});
	}

	private createFenceScene(
		scene: Scene,
		collidables: GameObject[],
		overlappables: GameObject[],
		x: number,
		y: number,
		target_scene: string
	): void {
		const poiCloudAnimTags = this.anims.createFromAseprite("poi_cloud");

		const dog = new MovableEntity(scene, x, y, this.husky).setScale(0.4);

		const dogTalkBubble = this.add.sprite(
			dog.x + 64,
			dog.y - 84,
			this.poiCloud
		);

		this.depthSorter.addSortable(dog, DepthLayers.PLAYER);

		this.dogAnimTags = this.anims.createFromAseprite(this.husky);

		dog.setBodySize(dog.width, dog.height / 5)
			.setOffset(0, (dog.height * 4) / 5)
			.play({ key: this.dogAnimTags[1].key, repeat: -1 }, true)
			.setImmovable(true)
			.setFlipX(true)
			.setDepth(DepthLayers.PLAYER)
			.setInteractive({ useHandCursor: true })
			.on("pointerdown", () => {
				if (dogTalkBubble.visible) {
					this.switchScene(target_scene);
				}
			});

		dogTalkBubble
			.setDepth(DepthLayers.OVERLAY)
			.play({ key: poiCloudAnimTags[0].key, repeat: -1 }, true)
			.setVisible(false)
			.setInteractive({ useHandCursor: true })
			.on("pointerdown", () => this.switchScene(target_scene));

		collidables.push(dog);

		// this.physics.add.collider(player, dog);

		const radius = this.add.zone(
			dog.x,
			dog.y,
			dog.displayWidth,
			dog.displayHeight
		);

		this.physics.world.enable(radius); // enable the zone's physics body

		(radius.body as Phaser.Physics.Arcade.Body)
			.setOffset(-radius.displayWidth * 0.5, -radius.displayHeight * 0.5)
			.setCircle(dog.displayWidth);

		// scene.physics.add.overlap(player, radius);

		overlappables.push(radius);

		const dispatcher = this.components.addComponent(
			radius,
			OverlayDispatcher
		);

		dispatcher.setDispatchCallback((isOverlapping) => {
			if (dogTalkBubble.visible !== isOverlapping) {
				dogTalkBubble.setVisible(isOverlapping);
			}

			if (isOverlapping && this.sceneSwitchKey.isDown) {
				this.switchScene(target_scene);
			}
		});
	}

	private createDogLamppostScene(
		scene: Scene,
		collidables: GameObject[],
		overlappables: GameObject[],
		x: number,
		y: number,
		target_scene: string
	): void {
		const poiCloudAnimTags = this.anims.createFromAseprite("poi_cloud");

		const dogLamppost = new MovableEntity(scene, x, y, this.huskyWait).setScale(
			0.4
		);

		const dogTalkBubble = this.add.sprite(
			dogLamppost.x + 182,
			dogLamppost.y,
			this.poiCloud
		);

		this.depthSorter.addSortable(dogLamppost, DepthLayers.PLAYER);

		//this.dogAnimTags = this.anims.createFromAseprite(this.husky);

		dogLamppost
			.setScale(0.5)
			.setBodySize(dogLamppost.width, dogLamppost.height / 5)
			.setOffset(0, (dogLamppost.height * 4) / 5)
			.setImmovable(true)
			.setDepth(DepthLayers.PLAYER)
			.setInteractive({ useHandCursor: true })
			.on("pointerdown", () => {
				if (dogTalkBubble.visible) {
					this.switchScene(target_scene);
				}
			});

		dogTalkBubble
			.setDepth(DepthLayers.OVERLAY)
			.play({ key: poiCloudAnimTags[0].key, repeat: -1 }, true)
			.setVisible(false)
			.setInteractive({ useHandCursor: true })
			.on("pointerdown", () => this.switchScene(target_scene));

		// this.physics.add.collider(player, dogLamppost);

		collidables.push(dogLamppost);

		const radius = this.add.zone(
			dogLamppost.x,
			dogLamppost.y + dogLamppost.height / 3,
			dogLamppost.displayWidth,
			dogLamppost.displayHeight
		);

		this.physics.world.enable(radius); // enable the zone's physics body

		(radius.body as Phaser.Physics.Arcade.Body)
			.setOffset(-radius.displayWidth * 0.5, -radius.displayHeight * 0.5)
			.setCircle(dogLamppost.displayWidth);

		// scene.physics.add.overlap(player, radius);

		overlappables.push(radius);

		const dispatcher = this.components.addComponent(
			radius,
			OverlayDispatcher
		);

		dispatcher.setDispatchCallback((isOverlapping) => {
			if (dogTalkBubble.visible !== isOverlapping) {
				dogTalkBubble.setVisible(isOverlapping);
			}

			if (isOverlapping && this.sceneSwitchKey.isDown) {
				this.switchScene(target_scene);
			}
		});
	}

	private createGuidedogScene(
		scene: Scene,
		collidables: GameObject[],
		overlappables: GameObject[],
		x: number,
		y: number,
		target_scene: string
	): void {
		const poiCloudAnimTags = this.anims.createFromAseprite("poi_cloud");

		const dog = new MovableEntity(scene, x, y, this.husky).setScale(0.4);

		const dogTalkBubble = this.add.sprite(
			dog.x + 64,
			dog.y - 84,
			this.poiCloud
		);

		this.depthSorter.addSortable(dog, DepthLayers.PLAYER);

		this.dogAnimTags = this.anims.createFromAseprite(this.husky);

		dog.setBodySize(dog.width, dog.height / 5)
			.setOffset(0, (dog.height * 4) / 5)
			.play({ key: this.dogAnimTags[1].key, repeat: -1 }, true)
			.setImmovable(true)
			.setFlipX(true)
			.setDepth(DepthLayers.PLAYER)
			.setInteractive({ useHandCursor: true })
			.on("pointerdown", () => {
				if (dogTalkBubble.visible) {
					this.switchScene(target_scene);
				}
			});

		dogTalkBubble
			.setDepth(DepthLayers.OVERLAY)
			.play({ key: poiCloudAnimTags[0].key, repeat: -1 }, true)
			.setVisible(false)
			.setInteractive({ useHandCursor: true })
			.on("pointerdown", () => this.switchScene(target_scene));

		collidables.push(dog);

		// this.physics.add.collider(player, dog);

		const radius = this.add.zone(
			dog.x,
			dog.y,
			dog.displayWidth,
			dog.displayHeight
		);

		this.physics.world.enable(radius); // enable the zone's physics body

		(radius.body as Phaser.Physics.Arcade.Body)
			.setOffset(-radius.displayWidth * 0.5, -radius.displayHeight * 0.5)
			.setCircle(dog.displayWidth);

		// scene.physics.add.overlap(player, radius);

		overlappables.push(radius);

		const dispatcher = this.components.addComponent(
			radius,
			OverlayDispatcher
		);

		dispatcher.setDispatchCallback((isOverlapping) => {
			if (dogTalkBubble.visible !== isOverlapping) {
				dogTalkBubble.setVisible(isOverlapping);
			}

			if (isOverlapping && this.sceneSwitchKey.isDown) {
				this.switchScene(target_scene);
			}
		});
	}

	private switchScene(newScene: string) {
		fadeToBlack(this, () => {
			this.scene.switch(newScene);
		});
	}

	private createDogCarParkinglot(
		scene: Scene,
		collidables: GameObject[],
		overlappables: GameObject[],
		x: number,
		y: number,
		target_scene: string
	): void {
		const dogWindowAnimTags = this.anims.createFromAseprite("dogInCar");

		const carScene = new MovableEntity(scene, x, y, this.car).setScale(0.5);

		const dogWindow = this.add.sprite(
			carScene.x + 150,
			carScene.y - 120,
			this.dogInCar
		);

		//this.depthSorter.addSortable(carScene, DepthLayers.PLAYER);

		carScene.setBodySize(1350,650)//width and height of collision box
			.setImmovable(true)//speaks for itself
			.setDepth(DepthLayers.PLAYER)//sets layer of depth
			.setInteractive({ useHandCursor: true })
			.on("pointerdown", () => {
				if (dogWindow.visible) {
					this.switchScene(target_scene);
				}
			});

		dogWindow
			.setDepth(DepthLayers.OVERLAY)
			.play({ key: dogWindowAnimTags[0].key, frameRate: 1, repeat: -1}, true)
			.setVisible(false)
			.setInteractive({ useHandCursor: true })
			.on("pointerdown", () => this.switchScene(target_scene))
			.setScale(0.5)
		collidables.push(carScene);

		// this.physics.add.collider(player, dog);

		const radius = this.add.zone(x,	y, 1000,600);

		this.physics.world.enable(radius); // enable the zone's physics body

		// scene.physics.add.overlap(player, radius);

		overlappables.push(radius);

		const dispatcher = this.components.addComponent(
			radius,
			OverlayDispatcher
		);

		dispatcher.setDispatchCallback((isOverlapping) => {
			if (dogWindow.visible !== isOverlapping) {
				dogWindow.setVisible(isOverlapping);
			}

			if (isOverlapping && this.sceneSwitchKey.isDown) {
				this.switchScene(target_scene);
			}
		});
	}
	private createSchoolScene(
		scene: Scene,
		collidables: GameObject[],
		overlappables: GameObject[],
		x: number,
		y: number,
		target_scene: string
	): void {
		const poiCloudAnimTags = this.anims.createFromAseprite("poi_cloud");

		const dog = new MovableEntity(scene, x, y, this.scene1Dog).setScale(0.6);

		const dogTalkBubble = this.add.sprite(
			dog.x - 150,
			dog.y - 130,
			this.poiCloud
		);

		this.depthSorter.addSortable(dog, DepthLayers.PLAYER);

		this.dogAnimTags = this.anims.createFromAseprite(this.scene1Dog);

		dog.setBodySize(dog.width, dog.height / 5)
			.setOffset(0, (dog.height * 4) / 5)
			.play({ key: this.dogAnimTags[0].key, repeat: -1, frameRate: 2 }, true)
			.setImmovable(true)
			.setFlipX(false)
			.setDepth(DepthLayers.PLAYER)
			.setInteractive({ useHandCursor: true })
			.on("pointerdown", () => {
				if (dogTalkBubble.visible) {
					this.switchScene(target_scene);
				}
			});

		dogTalkBubble
			.setDepth(DepthLayers.OVERLAY)
			.setFlipX(true)
			.play({ key: poiCloudAnimTags[0].key, repeat: -1 }, true)
			.setVisible(false)
			.setInteractive({ useHandCursor: true })
			.on("pointerdown", () => this.switchScene(target_scene));

		collidables.push(dog);

		// this.physics.add.collider(player, dog);

		const radius = this.add.zone(
			dog.x,
			dog.y,
			230,
			230
		);

		this.physics.world.enable(radius); // enable the zone's physics body

		(radius.body as Phaser.Physics.Arcade.Body)
			.setOffset(-radius.displayWidth * 0.5, -radius.displayHeight * 0.5)
			.setCircle(230);

		// scene.physics.add.overlap(player, radius);

		overlappables.push(radius);

		const dispatcher = this.components.addComponent(
			radius,
			OverlayDispatcher
		);

		dispatcher.setDispatchCallback((isOverlapping) => {
			if (dogTalkBubble.visible !== isOverlapping) {
				dogTalkBubble.setVisible(isOverlapping);
			}

			if (isOverlapping && this.sceneSwitchKey.isDown) {
				this.switchScene(target_scene);
			}
		});
	}

}
