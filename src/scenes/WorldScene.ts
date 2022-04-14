import worldTiles from "@assets/tilesheets/world_tiles.png";
import mainSceneTileData from "@assets/tilemaps/main_scene.json";
import poiCloudSheet from "@assets/spritesheets/pointOfInterest/cloud/poi_cloud.png";
import poiCloudData from "@assets/spritesheets/pointOfInterest/cloud/poi_cloud.json";
import fenceScene2 from "@assets/images/scenario_2/fence.png";
import dogScene2 from "@assets/images/scenario_2/dog1.png";
import stickScene2 from "@assets/images/scenario_2/stick.png";
import doorScene3 from "@assets/images/scenario_3/door.png";
import rayScene5 from "@assets/spritesheets/scenario_5/ray.png";
import rayDataScene5 from "@assets/spritesheets/scenario_5/ray.json";
import huskyImage from "@assets/spritesheets/husky/husky.png";
import huskyJson from "@assets/spritesheets/husky/husky.json";
import huskyWaitImage from "@assets/images/world/husky_wait.png";
import GateClosed from "@assets/images/world/schoolgate.png";
import GatePillar from "@assets/images/world/schoolgatepillar.png";
import GateFence from "@assets/images/world/schoolgatefence.png";
import Car from "@assets/images/scenario_6/car.png";
import Truck from "@assets/images/world/truck.png";
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
import SceneSong from "@assets/audio/scene.mp3";
import GoodEmotionAudio from "@assets/audio/correct.mp3";
import MixedEmotionAudio from "@assets/audio/almost.mp3";
import BadEmotionAudio from "@assets/audio/incorrect.mp3";
import BadgeBling from "@assets/audio/UI/badge_bling.mp3";

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

	public static scenario1Fininshed: boolean;
	public static scenario2Fininshed: boolean;
	public static scenario3Fininshed: boolean;
	public static scenario4Fininshed: boolean;
	public static scenario5Fininshed: boolean;
	public static scenario6Fininshed: boolean;
	public static gateOpen: boolean;
	public static truckGone: boolean;

	public static GateClosed: MovableEntity;
	public static GatePilar: MovableEntity;
	public static GateFence: MovableEntity;

	public static Truck: MovableEntity;
	
	private poiCloud!: string;

	private doorScene3!: string;

	private fenceScene2!: string;

	private dogScene2!: string;

	private stickScene2!: string;

	private rayScene5!: string;

	private dogInCar!: string;

	private scene1Dog!: string;

	private husky!: string;

	private huskyWait!: string;
	
	private gateClosed!: string;
	private gatePillar!: string;
	private gateFence!: string;

	private car!: string;

	private truck!: string;

	private dogAnimTags!: Phaser.Animations.Animation[];

	private switch_to_end!: boolean;

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
		WorldScene.scenario1Fininshed = false;
		WorldScene.scenario2Fininshed = false;
		WorldScene.scenario3Fininshed = false;
		WorldScene.scenario4Fininshed = false;
		WorldScene.scenario5Fininshed = false;
		WorldScene.scenario6Fininshed = false;
		WorldScene.gateOpen = false;
		WorldScene.truckGone = false;

		this.tilesetKey = "world_tiles";
		this.tilemapKey = "main_scene";

		this.poiCloud = "poi_cloud";
		this.fenceScene2 = "fence";
		this.dogScene2 = "dogScene2";
		this.stickScene2 = "stickScene2";
		this.doorScene3 = "doorScene3";
		this.rayScene5 = "rayScene5";
		this.dogInCar = "dogInCar";
		this.husky = "husky";
		this.huskyWait = "huskywait"
		this.gateClosed = "gateClosed";
		this.gatePillar = "gatePillar";
		this.gateFence = "gateFence";
		this.car = "car";
		this.truck = "truck";
		this.scene1Dog = "scene1dog";

		this.dogAnimTags = [];

		this.switch_to_end = false;

		this.components = new ComponentService();
		this.depthSorter = new DepthSorter();

		addFadeIn(this);
	}

	/**
	 * Load assets.
	 * A key has to be unique for the entire project, not just this scene.
	 */
	public preload(): void {
		// Point of Interests
		this.load.aseprite(this.poiCloud, poiCloudSheet, poiCloudData);
		this.load.image(this.fenceScene2, fenceScene2);
		this.load.image(this.dogScene2, dogScene2);
		this.load.image(this.stickScene2, stickScene2);
		this.load.image(this.doorScene3, doorScene3);
		this.load.aseprite(this.rayScene5, rayScene5, rayDataScene5);
		this.load.image(this.gateClosed, GateClosed);
		this.load.image(this.gatePillar, GatePillar);
		this.load.image(this.gateFence, GateFence);
		this.load.image(this.car,Car)
		this.load.image(this.truck, Truck);
		this.load.aseprite(this.dogInCar,DogInCarSheet,DogInCarData);
		this.load.aseprite(this.scene1Dog,Scene1DogSheet,Scene1DogData);

		//audio
		this.load.audio("scenesong", SceneSong);
		this.load.audio("goodemotionaudio", GoodEmotionAudio);
		this.load.audio("mixedemotionaudio", MixedEmotionAudio);
		this.load.audio("bademotionaudio", BadEmotionAudio);
		this.load.audio("badgebling",BadgeBling);

		// Player Idle & Move Animations
		this.load.aseprite(
			PlayerEntity.spriteKey,
			PlayerEntity.spriteSheet,
			PlayerEntity.spriteAtlas
		);

		// Husky idle & moving animations
		this.load.aseprite(this.husky, huskyImage, huskyJson);
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
		const Water = tilemap.createLayer("Water", tileset);
		const Grass = tilemap.createLayer("Grass", tileset);
		const Treeline_1 = tilemap.createLayer("Treeline_1", tileset);
		const Treeline_2 = tilemap.createLayer("Treeline_2", tileset);
		const Treeline_3 = tilemap.createLayer("Treeline_3", tileset);
		const Treeline_4 = tilemap.createLayer("Treeline_4", tileset);
		const Concrete = tilemap.createLayer("Concrete", tileset);
		const Fences = tilemap.createLayer("Fences", tileset);
		const Road = tilemap.createLayer("Road", tileset);
		const Road_lines = tilemap.createLayer("Road_lines", tileset);
		const Lanterns = tilemap.createLayer("Lanterns", tileset);
		const Collision_houses = tilemap.createLayer("Collision_houses", tileset);
		const Roofs = tilemap.createLayer("Roofs", tileset);
		const Bushes = tilemap.createLayer("Bushes", tileset);
		const Flowers = tilemap.createLayer("Flowers", tileset);

		// add collision to the layers which have collision specified inside tiled
		Water.setCollisionByProperty({ collision: true });
		Grass.setCollisionByProperty({ collision: true });
		Treeline_1.setCollisionByProperty({ collision: true });
		Treeline_2.setCollisionByProperty({ collision: true });
		Treeline_3.setCollisionByProperty({ collision: true });
		Treeline_4.setCollisionByProperty({ collision: true });
		Concrete.setCollisionByProperty({ collision: true });
		Fences.setCollisionByProperty({ collision: true });
		Lanterns.setCollisionByProperty({ collision: true });
		Collision_houses.setCollisionByProperty({ collision: true });
		Bushes.setCollisionByProperty({ collision: true });
		Flowers.setCollisionByProperty({ collision: true });

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

						//adds collision
						this.physics.add.collider(p, Water);
						this.physics.add.collider(p, Grass);
						this.physics.add.collider(p, Treeline_1);
						this.physics.add.collider(p, Treeline_2);
						this.physics.add.collider(p, Treeline_3);
						this.physics.add.collider(p, Treeline_4);
						this.physics.add.collider(p, Concrete);
						this.physics.add.collider(p, Fences);
						this.physics.add.collider(p, Road);
						this.physics.add.collider(p, Road_lines);
						this.physics.add.collider(p, Lanterns);
						this.physics.add.collider(p, Collision_houses);
						this.physics.add.collider(p, Bushes);

						this.depthSorter.addSortable(p, DepthLayers.PLAYER);

						player = p;
					}
					break;
				case "Objective":
					if (obj.point) {
						if (obj.name === "School") {
							this.createScenario1(
								this,
								collidables,
								overlappables,
								obj.x as number,
								obj.y as number,
								"scene-1"
							);
						}else if (obj.name === "Fence") {
							this.createScenario2(
								this,
								collidables,
								overlappables,
								obj.x as number,
								obj.y as number,
								"scene-2"
							);
						}else if (obj.name == "DogPupInHouse"){
							this.createScenario3(
								this,
								collidables,
								overlappables,
								obj.x as number,
								obj.y as number,
								"scene-3"
							);
						}else if (obj.name === "HuskyLamppost") {
							this.createScenario4(
								this,
								collidables,
								overlappables,
								obj.x as number,
								obj.y as number,
								"scene-4"
							);
						}else if (obj.name === "Guidedog") {
							this.createScenario5(
								this,
								collidables,
								overlappables,
								obj.x as number,
								obj.y as number,
								"scene-5"
							);
						}else if (obj.name === "DogCarParkinglot") {
							this.createScenario6(
								this,
								collidables,
								overlappables,
								obj.x as number,
								obj.y as number,
								"scene-6"
							);						
						}else if (obj.name === "HuskyIcecream") {
							this.createScenario8(
								this,
								collidables,
								overlappables,
								obj.x as number,
								obj.y as number,
								"scene-8"
							);
						}  else if (obj.name === "Cuddle") {
							this.createScenario11(
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
		Water.setDepth(DepthLayers.Water);
		Grass.setDepth(DepthLayers.Grass);
		Bushes.setDepth(DepthLayers.Bushes)
		Treeline_1.setDepth(DepthLayers.Treeline_1);
		Treeline_2.setDepth(DepthLayers.Treeline_2);
		Treeline_3.setDepth(DepthLayers.Treeline_3);
		Treeline_4.setDepth(DepthLayers.Treeline_4);
		Concrete.setDepth(DepthLayers.Concrete);
		Fences.setDepth(DepthLayers.Fences);
		Road.setDepth(DepthLayers.Road);
		Road_lines.setDepth(DepthLayers.Road_lines);
		Lanterns.setDepth(DepthLayers.Lanterns);
		Collision_houses.setDepth(DepthLayers.Collision_houses);
		Roofs.setDepth(DepthLayers.Roofs);
		Flowers.setDepth(DepthLayers.Flowers);

		this.depthSorter.setRatio(tilemap.heightInPixels * 1.1);

		WorldScene.GateClosed = new MovableEntity(this,2775,3175,this.gateClosed);
			
		WorldScene.GateClosed
			.setBodySize(WorldScene.GateClosed.width, WorldScene.GateClosed.height)
			.setDepth(DepthLayers.PLAYER)
			.setImmovable(true);

		collidables.push(WorldScene.GateClosed);

		WorldScene.GatePilar = new MovableEntity(this,2775,2900,this.gatePillar);
			
		WorldScene.GatePilar
			.setBodySize(WorldScene.GatePilar.width, WorldScene.GatePilar.height)
			.setDepth(DepthLayers.PLAYER)
			.setImmovable(true)
			.setVisible(false);

		collidables.push(WorldScene.GatePilar);

		WorldScene.GateFence = new MovableEntity(this,2500,3450,this.gateFence);
			
		WorldScene.GateFence
			.setBodySize(WorldScene.GateFence.width, 25)
			.setOffset(0,250)
			.setDepth(DepthLayers.Roofs)
			.setImmovable(true)
			.setVisible(false);

		collidables.push(WorldScene.GateFence);

		WorldScene.Truck = new MovableEntity(this,7200,3175,this.truck);
			
		WorldScene.Truck
			.setBodySize(WorldScene.Truck.width, WorldScene.Truck.height)
			.setDepth(DepthLayers.PLAYER)
			.setImmovable(true);

		collidables.push(WorldScene.Truck);
	}

	public update(time: number, delta: number): void {
		if(!WorldScene.gateOpen && WorldScene.scenario1Fininshed){
			WorldScene.gateOpen = true;
			WorldScene.GateClosed.destroy();
			WorldScene.GatePilar.setVisible(true);
			WorldScene.GateFence.setVisible(true);
		}
		

		if(!WorldScene.truckGone && WorldScene.scenario2Fininshed && WorldScene.scenario3Fininshed){
			WorldScene.truckGone = true;
			WorldScene.Truck.destroy();
		}

		if (!this.switch_to_end && WorldScene.scenario1Fininshed && WorldScene.scenario2Fininshed && WorldScene.scenario3Fininshed && WorldScene.scenario4Fininshed && WorldScene.scenario5Fininshed && WorldScene.scenario6Fininshed){
			this.switch_to_end = true;
			this.switchScene("end-scene");			
		}
			
		super.update(time, delta);
		this.depthSorter.sort(time, delta);
		
	}

	private switchScene(newScene: string) {	
		fadeToBlack(this, () => {			
			this.game.scene.switch("world-scene", newScene);
			this.game.scene.stop("UIScene");
			this.game.scene.start("UIScene");
		});
	}

	private createScenario1(
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
				if (dogTalkBubble.visible && !WorldScene.scenario1Fininshed) {
					this.switchScene(target_scene);
				}
			});

		dogTalkBubble
			.setDepth(DepthLayers.Roofs)
			.setFlipX(true)
			.play({ key: poiCloudAnimTags[0].key, repeat: -1 }, true)
			.setVisible(false)
			.setInteractive({ useHandCursor: true })
			.on("pointerdown", () => {
				if (!WorldScene.scenario1Fininshed){
				this.switchScene(target_scene)}});

		collidables.push(dog);

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

		overlappables.push(radius);

		const dispatcher = this.components.addComponent(
			radius,
			OverlayDispatcher
		);
		dispatcher.setDispatchCallback((isOverlapping) => {
				if (WorldScene.scenario1Fininshed){
					dogTalkBubble.setVisible(false);
				}else{
					dogTalkBubble.setVisible(isOverlapping);
				}			

			if (isOverlapping && this.sceneSwitchKey.isDown && !WorldScene.scenario1Fininshed) {
				this.switchScene(target_scene);
			}
		});
	}
	
	private createScenario2(
		scene: Scene,
		collidables: GameObject[],
		overlappables: GameObject[],
		x: number,
		y: number,
		target_scene: string
	): void {
		const poiCloudAnimTags = this.anims.createFromAseprite("poi_cloud");

		this.add.image(x,y-150,this.dogScene2).setDepth(DepthLayers.Roofs).setScale(0.4);
		this.add.image(x-100,y+100,this.stickScene2).setDepth(DepthLayers.PLAYER).setScale(0.4);

		const fenceCollidable = new MovableEntity(scene, x, y-50, this.fenceScene2).setScale(0.4);

		const fenceTalkBubble = this.add.sprite(
			fenceCollidable.x + 100,
			fenceCollidable.y - 200,
			this.poiCloud
		);

		this.depthSorter.addSortable(fenceCollidable, DepthLayers.PLAYER);

		fenceCollidable.setBodySize(500, 500)
			.setImmovable(true)
			.setFlipX(true)
			.setDepth(DepthLayers.PLAYER)
			.setInteractive({ useHandCursor: true })
			.on("pointerdown", () => {if(!WorldScene.scenario2Fininshed && fenceTalkBubble.visible){this.switchScene(target_scene)}});

		fenceTalkBubble
			.setDepth(DepthLayers.Roofs)
			.play({ key: poiCloudAnimTags[0].key, repeat: -1 }, true)
			.setVisible(false)
			.setInteractive({ useHandCursor: true })
			.on("pointerdown", () => {if(!WorldScene.scenario2Fininshed){this.switchScene(target_scene)}});

		collidables.push(fenceCollidable);

		const radius = this.add.zone(
			x,
			y-100,
			500,
			125
		);

		this.physics.world.enable(radius); // enable the zone's physics body

		(radius.body as Phaser.Physics.Arcade.Body)
			.setOffset(0, 225);

		overlappables.push(radius);

		const dispatcher = this.components.addComponent(
			radius,
			OverlayDispatcher
		);

		dispatcher.setDispatchCallback((isOverlapping) => {
			if (fenceTalkBubble.visible !== isOverlapping) {
				if (WorldScene.scenario2Fininshed){
					fenceTalkBubble.setVisible(false);
				}else{
					fenceTalkBubble.setVisible(isOverlapping);
				}	
			}

			if (isOverlapping && this.sceneSwitchKey.isDown && !WorldScene.scenario2Fininshed) {
				this.switchScene(target_scene);
			}
		});
	}
	private createScenario3(
		scene: Scene,
		collidables: GameObject[],
		overlappables: GameObject[],
		x: number,
		y: number,
		target_scene: string
	): void {
		const doorCollidable = new MovableEntity(scene, x, y+18, this.doorScene3).setVisible(false);

		doorCollidable.setBodySize(100,200)
			.setImmovable(true)
			.setDepth(DepthLayers.Collision_houses)
			.setInteractive({ useHandCursor: true })
			.on("pointerdown", () => {if(!WorldScene.scenario3Fininshed){this.switchScene(target_scene)}});

		collidables.push(doorCollidable);

		const radius = this.add.zone(
			x,
			y,
			450,
			280
		);

		this.physics.world.enable(radius); // enable the zone's physics body
		(radius.body as Phaser.Physics.Arcade.Body)
			.setOffset(0,250);

		overlappables.push(radius);

		const dispatcher = this.components.addComponent(
			radius,
			OverlayDispatcher
		);

		dispatcher.setDispatchCallback((isOverlapping) => {
				if (WorldScene.scenario3Fininshed){
					doorCollidable.setVisible(false);
				}else{
					doorCollidable.setVisible(isOverlapping);
				}	
			

			if (isOverlapping && this.sceneSwitchKey.isDown && !WorldScene.scenario3Fininshed) {
				this.switchScene(target_scene);
			}
		});
	}

	private createScenario4(
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

		dogLamppost
			.setScale(0.5)
			.setBodySize(dogLamppost.width, dogLamppost.height / 5)
			.setOffset(0, (dogLamppost.height * 4) / 5)
			.setImmovable(true)
			.setDepth(DepthLayers.PLAYER)
			.setInteractive({ useHandCursor: true })
			.on("pointerdown", () => {
				if (dogTalkBubble.visible && !WorldScene.scenario4Fininshed) {
					this.switchScene(target_scene);
				}
			});

		dogTalkBubble
			.setDepth(DepthLayers.Roofs)
			.play({ key: poiCloudAnimTags[0].key, repeat: -1 }, true)
			.setVisible(false)
			.setInteractive({ useHandCursor: true })
			.on("pointerdown", () => {if(!WorldScene.scenario4Fininshed){this.switchScene(target_scene)}});

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

		overlappables.push(radius);

		const dispatcher = this.components.addComponent(
			radius,
			OverlayDispatcher
		);

		dispatcher.setDispatchCallback((isOverlapping) => {
				if (WorldScene.scenario4Fininshed){
					dogTalkBubble.setVisible(false);
				}else{
					dogTalkBubble.setVisible(isOverlapping);
				}	
			

			if (isOverlapping && this.sceneSwitchKey.isDown && !WorldScene.scenario4Fininshed) {
				this.switchScene(target_scene);
			}
		});
	}

	private createScenario5(
		scene: Scene,
		collidables: GameObject[],
		overlappables: GameObject[],
		x: number,
		y: number,
		target_scene: string
	): void {
		const poiCloudAnimTags = this.anims.createFromAseprite("poi_cloud");

		const rayCollidable = new MovableEntity(scene, x, y+25, this.rayScene5).setScale(1);

		const dogTalkBubble = this.add.sprite(
			x + 64,
			y - 84,
			this.poiCloud
		);

		this.depthSorter.addSortable(rayCollidable, DepthLayers.PLAYER);

		this.dogAnimTags = this.anims.createFromAseprite("rayScene5");

		rayCollidable.setBodySize(rayCollidable.width, rayCollidable.height/2)
			.play({ key: this.dogAnimTags[0].key, repeat: -1, frameRate: 2 }, true)
			.setImmovable(true)
			.setDepth(DepthLayers.PLAYER)
			.setInteractive({ useHandCursor: true })
			.on("pointerdown", () => {
				if (dogTalkBubble.visible && !WorldScene.scenario5Fininshed) {
					this.switchScene(target_scene);
				}
			});

		dogTalkBubble
			.setDepth(DepthLayers.Roofs)
			.play({ key: poiCloudAnimTags[0].key, repeat: -1 }, true)
			.setVisible(false)
			.setInteractive({ useHandCursor: true })
			.on("pointerdown", () => {if(!WorldScene.scenario5Fininshed){this.switchScene(target_scene)}});

		collidables.push(rayCollidable);

		const radius = this.add.zone(
			x,
			y,
			rayCollidable.displayWidth,
			rayCollidable.displayHeight
		);

		this.physics.world.enable(radius); // enable the zone's physics body

		(radius.body as Phaser.Physics.Arcade.Body)
			.setOffset(-radius.displayWidth * 0.5, -radius.displayHeight * 0.5)
			.setCircle(rayCollidable.displayWidth);

		overlappables.push(radius);

		const dispatcher = this.components.addComponent(
			radius,
			OverlayDispatcher
		);

		dispatcher.setDispatchCallback((isOverlapping) => {
				if (WorldScene.scenario5Fininshed){
					dogTalkBubble.setVisible(false);
				}else{
					dogTalkBubble.setVisible(isOverlapping);
				}	
			

			if (isOverlapping && this.sceneSwitchKey.isDown && !WorldScene.scenario5Fininshed) {
				this.switchScene(target_scene);
			}
		});
	}

	private createScenario6(
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

		carScene.setBodySize(1350,650)//width and height of collision box
			.setImmovable(true)//speaks for itself
			.setDepth(DepthLayers.PLAYER)//sets layer of depth
			.setInteractive({ useHandCursor: true })
			.on("pointerdown", () => {
				if (dogWindow.visible && !WorldScene.scenario6Fininshed) {
					this.switchScene(target_scene);
				}
			});

		dogWindow
			.setDepth(DepthLayers.Roofs)
			.play({ key: dogWindowAnimTags[0].key, frameRate: 1, repeat: -1}, true)
			.setVisible(false)
			.setInteractive({ useHandCursor: true })
			.on("pointerdown", () => {if(!WorldScene.scenario6Fininshed){this.switchScene(target_scene)}})
			.setScale(0.5)
		collidables.push(carScene);

		const radius = this.add.zone(x,	y, 1000,600);

		this.physics.world.enable(radius); // enable the zone's physics body

		overlappables.push(radius);

		const dispatcher = this.components.addComponent(
			radius,
			OverlayDispatcher
		);

		dispatcher.setDispatchCallback((isOverlapping) => {
				if (WorldScene.scenario6Fininshed){
					dogWindow.setVisible(false);
				}else{
					dogWindow.setVisible(isOverlapping);
				}	
			

			if (isOverlapping && this.sceneSwitchKey.isDown&& !WorldScene.scenario6Fininshed) {
				this.switchScene(target_scene);
			}
		});
	}

	private createScenario8(
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
			.setDepth(DepthLayers.Roofs)
			.play({ key: poiCloudAnimTags[0].key, repeat: -1 }, true)
			.setVisible(false)
			.setInteractive({ useHandCursor: true })
			.on("pointerdown", () => this.switchScene(target_scene));

		collidables.push(dog);

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

	private createScenario11(
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
			.setDepth(DepthLayers.Roofs)
			.play({ key: poiCloudAnimTags[0].key, repeat: -1 }, true)
			.setVisible(false)
			.setInteractive({ useHandCursor: true })
			.on("pointerdown", () => this.switchScene(target_scene));

		collidables.push(dog);

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
