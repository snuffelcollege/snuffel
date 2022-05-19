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
import spencerScene8Sheet from "@assets/spritesheets/scenario_8/spencer.png";
import spencerScene8Data from "@assets/spritesheets/scenario_8/spencer.json";
import IceCreamStandSheet from "@assets/spritesheets/scenario_7/ijscoman.png";
import IceCreamStandData from "@assets/spritesheets/scenario_7/ijscoman.json";
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
import DogeFrisbeeSheet from "@assets/spritesheets/scenario_9/doge2.png";
import DogeFrisbeeData from "@assets/spritesheets/scenario_9/doge2.json";
import DogeSheet from "@assets/spritesheets/scenario_9/doge1.png";
import DogeData from "@assets/spritesheets/scenario_9/doge1.json";
import ParkGateClosed from "@assets/images/world/parkgate.png";
import ParkGateOpen from "@assets/images/world/parkgateopen.png";
import Scene1DogSheet from "@assets/spritesheets/scenario_1/snuffelidle.png";
import Scene1DogData from "@assets/spritesheets/scenario_1/snuffelidle.json";
import Scene1TextCloud from "@assets/images/scenario_1/text_cloud.png";
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
	public static scenario7Fininshed: boolean;
	public static scenario8Fininshed: boolean;
	public static scenario9Fininshed: boolean;
	public static scenario11Fininshed: boolean;

	private GateClosed!: MovableEntity;
	private GatePilar!: MovableEntity;
	private GateFence!: MovableEntity;

	private Truck!: MovableEntity;

	private ParkGate!: MovableEntity;
	private ParkGateLeft!: MovableEntity;
	private ParkGateRight!: MovableEntity;

	private scene1Cloud!: string;
	
	private poiCloud!: string;

	private doorScene3!: string;

	private fenceScene2!: string;

	private dogScene2!: string;

	private stickScene2!: string;

	private rayScene5!: string;

	private spencerScene8!: string;

	private iceCreamStand!: string;

	private dogInCar!: string;

	private doge!: string;

	private dogeFrisbee!: string;

	private scene1Dog!: string;

	private husky!: string;

	private huskyWait!: string;
	
	private gateClosed!: string;
	private gatePillar!: string;
	private gateFence!: string;
	
	private parkGate!: string;
	private parkGatePillar!: string;

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
		WorldScene.scenario7Fininshed = false;
		WorldScene.scenario8Fininshed = false;
		WorldScene.scenario9Fininshed = false;
		WorldScene.scenario11Fininshed = false;		

		this.tilesetKey = "world_tiles";
		this.tilemapKey = "main_scene";

		this.poiCloud = "poi_cloud";
		this.fenceScene2 = "fence";
		this.dogScene2 = "dogScene2";
		this.stickScene2 = "stickScene2";
		this.doorScene3 = "doorScene3";
		this.rayScene5 = "rayScene5";
		this.spencerScene8 = "spencerScene8"
		this.iceCreamStand = "iceCreamStand7"
		this.dogInCar = "dogInCar";
		this.husky = "husky";
		this.huskyWait = "huskywait"
		this.gateClosed = "gateClosed";
		this.gatePillar = "gatePillar";
		this.gateFence = "gateFence";
		this.parkGate = "parkGate";
		this.parkGatePillar = "parkGatePillar";
		this.car = "car";
		this.truck = "truck";
		this.doge = "doge";
		this.dogeFrisbee = "dogeFrisbee";
		this.scene1Dog = "scene1dog";
		this.scene1Cloud = "scene1Cloud";

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
		this.load.aseprite(this.spencerScene8,spencerScene8Sheet,spencerScene8Data);
		this.load.aseprite(this.iceCreamStand,IceCreamStandSheet,IceCreamStandData)
		this.load.image(this.gateClosed, GateClosed);
		this.load.image(this.gatePillar, GatePillar);
		this.load.image(this.gateFence, GateFence);
		this.load.image(this.parkGate, ParkGateClosed);
		this.load.image(this.parkGatePillar, ParkGateOpen);
		this.load.image(this.car,Car)
		this.load.image(this.truck, Truck);
		this.load.image(this.scene1Cloud, Scene1TextCloud);
		this.load.aseprite(this.dogInCar,DogInCarSheet,DogInCarData);
		this.load.aseprite(this.doge,DogeSheet,DogeData);
		this.load.aseprite(this.dogeFrisbee,DogeFrisbeeSheet,DogeFrisbeeData);
		this.load.aseprite(this.scene1Dog,Scene1DogSheet,Scene1DogData);

		//audio
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
		//this.events.on(Phaser.Scenes.Events.WAKE, this.updateBlockades);, was used for updateblockades, but we had problems trying to play audio.
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
		const Concrete_dirt = tilemap.createLayer("Concrete_dirt", tileset);
		const Fences = tilemap.createLayer("Fences", tileset);
		const Road = tilemap.createLayer("Road", tileset);
		const Road_lines = tilemap.createLayer("Road_lines", tileset);
		const Lanterns = tilemap.createLayer("Lanterns", tileset);
		const Collision_houses = tilemap.createLayer("Collision_houses", tileset);
		const Roofs = tilemap.createLayer("Roofs", tileset);
		const Flowers_bushes = tilemap.createLayer("Flowers_bushes", tileset);

		// add collision to the layers which have collision specified inside tiled
		Water.setCollisionByProperty({ collision: true });
		Grass.setCollisionByProperty({ collision: true });
		Treeline_1.setCollisionByProperty({ collision: true });
		Treeline_2.setCollisionByProperty({ collision: true });
		Treeline_3.setCollisionByProperty({ collision: true });
		Treeline_4.setCollisionByProperty({ collision: true });
		Concrete_dirt.setCollisionByProperty({ collision: true });
		Fences.setCollisionByProperty({ collision: true });
		Lanterns.setCollisionByProperty({ collision: true });
		Collision_houses.setCollisionByProperty({ collision: true });
		Flowers_bushes.setCollisionByProperty({ collision: true });

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
						this.physics.add.collider(p, Concrete_dirt);
						this.physics.add.collider(p, Fences);
						this.physics.add.collider(p, Road);
						this.physics.add.collider(p, Road_lines);
						this.physics.add.collider(p, Lanterns);
						this.physics.add.collider(p, Collision_houses);
						this.physics.add.collider(p, Flowers_bushes);

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
						}else if (obj.name === "ManOnBench") {
							this.createScenario8(
								this,
								collidables,
								overlappables,
								obj.x as number,
								obj.y as number,
								"scene-8"
							);					
						}else if (obj.name === "HuskyIcecream") {
							this.createScenario7(
								this,
								collidables,
								overlappables,
								obj.x as number,
								obj.y as number,
								"scene-7"
							);
						}else if (obj.name === "Frisbee") {
							this.createScenario9(
								this,
								collidables,
								overlappables,
								obj.x as number,
								obj.y as number,
								"scene-9"
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
		Flowers_bushes.setDepth(DepthLayers.Flowers_bushes)
		Treeline_1.setDepth(DepthLayers.Treeline_1);
		Treeline_2.setDepth(DepthLayers.Treeline_2);
		Treeline_3.setDepth(DepthLayers.Treeline_3);
		Treeline_4.setDepth(DepthLayers.Treeline_4);
		Concrete_dirt.setDepth(DepthLayers.Concrete_dirt);
		Fences.setDepth(DepthLayers.Fences);
		Road.setDepth(DepthLayers.Road);
		Road_lines.setDepth(DepthLayers.Road_lines);
		Lanterns.setDepth(DepthLayers.Lanterns);
		Collision_houses.setDepth(DepthLayers.Collision_houses);
		Roofs.setDepth(DepthLayers.Roofs);

		this.depthSorter.setRatio(tilemap.heightInPixels * 1.1);

		this.GateClosed = new MovableEntity(this,2775,3175,this.gateClosed);
			
		this.GateClosed
			.setBodySize(this.GateClosed.width, this.GateClosed.height)
			.setDepth(DepthLayers.PLAYER)
			.setImmovable(true);

		collidables.push(this.GateClosed);

		this.GatePilar = new MovableEntity(this,2775,2900,this.gatePillar);
			
		this.GatePilar
			.setBodySize(this.GatePilar.width, this.GatePilar.height)
			.setDepth(DepthLayers.PLAYER)
			.setImmovable(true)
			.setVisible(false);

		collidables.push(this.GatePilar);

		this.GateFence = new MovableEntity(this,2500,3450,this.gateFence);
			
		this.GateFence
			.setBodySize(this.GateFence.width, 25)
			.setOffset(0,250)
			.setDepth(DepthLayers.Roofs)
			.setImmovable(true)
			.setVisible(false);

		collidables.push(this.GateFence);

		this.Truck = new MovableEntity(this,7200,3175,this.truck);
			
		this.Truck
			.setBodySize(this.Truck.width, this.Truck.height)
			.setDepth(DepthLayers.PLAYER)
			.setImmovable(true);

		collidables.push(this.Truck);
		
		this.ParkGate = new MovableEntity(this,9030,3125,this.parkGate);
			
		this.ParkGate
			.setBodySize(this.ParkGate.width, this.ParkGate.height)
			.setScale(1.5)
			.setDepth(DepthLayers.PLAYER)
			.setImmovable(true);

		collidables.push(this.ParkGate);

		this.ParkGateLeft = new MovableEntity(this,8825,3200,this.parkGatePillar);
			
		this.ParkGateLeft
			.setBodySize(this.ParkGateLeft.width, this.ParkGateLeft.height)
			.setScale(1.5)
			.setDepth(DepthLayers.PLAYER)
			.setVisible(false)
			.setImmovable(true);

		collidables.push(this.ParkGateLeft);

		this.ParkGateRight = new MovableEntity(this,9235,3200,this.parkGatePillar);
			
		this.ParkGateRight
			.setBodySize(this.ParkGateRight.width, this.ParkGateRight.height)
			.setScale(1.5)
			.setDepth(DepthLayers.PLAYER)
			.setVisible(false)
			.setImmovable(true);

		collidables.push(this.ParkGateRight);
	}

	public update(time: number, delta: number): void {			
		super.update(time, delta);
		this.depthSorter.sort(time, delta);		
		this.updateBlockades()
	}
	
	//this is called on wake
	public updateBlockades(){
		if(this.GateClosed.visible && WorldScene.scenario1Fininshed){
			this.GateClosed.destroy();
			this.GatePilar.setVisible(true);
			this.GateFence.setVisible(true);
			this.sound.play("fenceopen", {volume:0.5});
		}		

		if(this.Truck.visible && WorldScene.scenario2Fininshed && WorldScene.scenario3Fininshed){
			this.Truck.destroy();
			this.sound.play("truckmove", {volume:0.5});
		}

		if(this.ParkGate.visible && WorldScene.scenario4Fininshed && WorldScene.scenario5Fininshed && WorldScene.scenario6Fininshed){
			this.ParkGate.destroy();
			this.ParkGateLeft.setVisible(true);
			this.ParkGateRight.setVisible(true);
			this.sound.play("fenceopen", {volume:0.5});
		}

		if (!this.switch_to_end && WorldScene.scenario7Fininshed && WorldScene.scenario8Fininshed && WorldScene.scenario9Fininshed && WorldScene.scenario11Fininshed){
			this.switch_to_end = true;
			this.switchScene("end-scene");			
		}
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
		

		const dog = new MovableEntity(scene, x, y, this.scene1Dog).setScale(0.6);

		const dogTalkBubble = this.add.image(
			dog.x - 170,
			dog.y - 130,
			this.scene1Cloud
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
			.setScale(0.5)
			.setDepth(DepthLayers.Roofs)
			.setVisible(false)
			.setInteractive({ useHandCursor: true })
			.on("pointerdown", () => {
				if (!WorldScene.scenario1Fininshed){
				this.switchScene(target_scene)}});

		collidables.push(dog);

		const radius = this.add.zone(
			dog.x,
			dog.y,
			350,
			350
		);

		this.physics.world.enable(radius); // enable the zone's physics body

		(radius.body as Phaser.Physics.Arcade.Body)
			.setOffset(-radius.displayWidth * 0.5, -radius.displayHeight * 0.5)
			.setCircle(350);

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

		this.add.image(x,y-200,this.dogScene2).setDepth(DepthLayers.Roofs).setScale(0.5);
		this.add.image(x-100,y+100,this.stickScene2).setDepth(DepthLayers.PLAYER).setScale(0.4);

		const fenceCollidable = new MovableEntity(scene, x, y-70, this.fenceScene2).setVisible(true);

		fenceCollidable
			.setScale(0.5)
			.setImmovable(true)
			.setDepth(DepthLayers.Fences)
			.setInteractive({ useHandCursor: true })
			.on("pointerdown", () => {if(!WorldScene.scenario2Fininshed){this.switchScene(target_scene)}});

		collidables.push(fenceCollidable);

		const fenceTalkBubble = this.add.sprite(
			x + 100,
			y - 200,
			this.poiCloud
		);

		fenceTalkBubble
			.setDepth(DepthLayers.Roofs)
			.play({ key: poiCloudAnimTags[0].key, repeat: -1 }, true)
			.setVisible(false)
			.setInteractive({ useHandCursor: true })
			.on("pointerdown", () => {if(!WorldScene.scenario2Fininshed){this.switchScene(target_scene)}});

		const radius = this.add.zone(
			x,
			y-100,
			600,
			400
		);

		this.physics.world.enable(radius); // enable the zone's physics body

		(radius.body as Phaser.Physics.Arcade.Body)
			.setOffset(50, 100);

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

		rayCollidable.setBodySize(rayCollidable.width, rayCollidable.height/1.5)
			.play({ key: this.dogAnimTags[0].key, repeat: -1, frameRate: 2 }, true)
			.setOffset(0,75)
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
			.setOffset(-200, -75)
			.setCircle(350);

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

		const spencerCollidable = new MovableEntity(scene, x, y+25, this.spencerScene8).setScale(1);

		const dogTalkBubble = this.add.sprite(
			x - 90,
			y - 84,
			this.poiCloud
		);

		this.depthSorter.addSortable(spencerCollidable, DepthLayers.PLAYER);

		this.dogAnimTags = this.anims.createFromAseprite("spencerScene8");

		spencerCollidable.setBodySize(spencerCollidable.width, spencerCollidable.height/1.5)
			.play({ key: this.dogAnimTags[0].key, repeat: -1, frameRate: 2 }, true)
			.setOffset(0,75)
			.setImmovable(true)
			.setDepth(DepthLayers.PLAYER)
			.setInteractive({ useHandCursor: true })
			.on("pointerdown", () => {
				if (dogTalkBubble.visible && !WorldScene.scenario8Fininshed) {
					this.switchScene(target_scene);
				}
			});

		dogTalkBubble
			.setDepth(DepthLayers.Roofs)
			.play({ key: poiCloudAnimTags[0].key, repeat: -1 }, true)
			.setVisible(false)
			.setFlipX(true)
			.setInteractive({ useHandCursor: true })
			.on("pointerdown", () => {if(!WorldScene.scenario8Fininshed){this.switchScene(target_scene)}});

		collidables.push(spencerCollidable);

		const radius = this.add.zone(
			x,
			y,
			spencerCollidable.displayWidth,
			spencerCollidable.displayHeight
		);

		this.physics.world.enable(radius); // enable the zone's physics body

		(radius.body as Phaser.Physics.Arcade.Body)
			.setOffset(-220, -160)
			.setCircle(350);

		overlappables.push(radius);

		const dispatcher = this.components.addComponent(
			radius,
			OverlayDispatcher
		);

		dispatcher.setDispatchCallback((isOverlapping) => {
				if (WorldScene.scenario8Fininshed){
					dogTalkBubble.setVisible(false);
				}else{
					dogTalkBubble.setVisible(isOverlapping);
				}	
			

			if (isOverlapping && this.sceneSwitchKey.isDown && !WorldScene.scenario8Fininshed) {
				this.switchScene(target_scene);
			}
		});
	}

	private createScenario7(
		scene: Scene,
		collidables: GameObject[],
		overlappables: GameObject[],
		x: number,
		y: number,
		target_scene: string
	): void {
		this.anims.create({
			key: this.iceCreamStand,
			frameRate: 2,
			frames: this.anims.generateFrameNumbers(
				this.iceCreamStand,
				{
					start: 1,
					end: 0,
				}
			),
			repeat: -1,
		});	
		const poiCloudAnimTags = this.anims.createFromAseprite("poi_cloud");

		const dog = new MovableEntity(scene, x, y, this.iceCreamStand);

		const dogTalkBubble = this.add.sprite(
			dog.x + 150,
			dog.y - 10,
			this.poiCloud
		);

		this.depthSorter.addSortable(dog, DepthLayers.PLAYER);

		dog.setBodySize(300,50)
			.setOffset(30,400)
			.play(this.iceCreamStand)
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
			.setDepth(DepthLayers.Roofs)
			.play({ key: poiCloudAnimTags[0].key, repeat: -1 }, true)
			.setVisible(false)
			.setInteractive({ useHandCursor: true })
			.on("pointerdown", () => {if(!WorldScene.scenario7Fininshed){this.switchScene(target_scene)}});

		collidables.push(dog);

		const radius = this.add.zone(
			dog.x,
			dog.y,
			dog.displayWidth,
			dog.displayHeight
		);

		this.physics.world.enable(radius); // enable the zone's physics body

		(radius.body as Phaser.Physics.Arcade.Body)
			.setOffset(-160,50)
			.setCircle(dog.displayWidth);

		overlappables.push(radius);

		const dispatcher = this.components.addComponent(
			radius,
			OverlayDispatcher
		);

		dispatcher.setDispatchCallback((isOverlapping) => {
			if (WorldScene.scenario7Fininshed){
				dogTalkBubble.setVisible(false);
			}else{
				dogTalkBubble.setVisible(isOverlapping);
			}	
		

		if (isOverlapping && this.sceneSwitchKey.isDown && !WorldScene.scenario7Fininshed) {
			this.switchScene(target_scene);
		}
	});
	}

	private createScenario9(
		scene: Scene,
		collidables: GameObject[],
		overlappables: GameObject[],
		x: number,
		y: number,
		target_scene: string
	): void {
		const poiCloudAnimTags = this.anims.createFromAseprite("poi_cloud");

		const dog = new MovableEntity(scene, x, y, this.doge);

		const dogTalkBubble = this.add.sprite(
			dog.x + 125,
			dog.y - 125,
			this.poiCloud
		);

		this.depthSorter.addSortable(dog, DepthLayers.PLAYER);

		this.dogAnimTags = this.anims.createFromAseprite(this.doge);

		this.anims.create({
			key: this.dogeFrisbee,
			frameRate: 2,
			frames: this.anims.generateFrameNumbers(
				this.dogeFrisbee,
				{
					start: 1,
					end: 0,
				}
			),
			repeat: -1,
		});	

		dog.setBodySize(dog.width, dog.height)
			.play({ key: this.dogAnimTags[0].key, repeat: -1, frameRate: 2 }, true)
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
			.on("pointerdown", () => {if(!WorldScene.scenario9Fininshed){this.switchScene(target_scene)}});

		collidables.push(dog);

		const radius = this.add.zone(
			dog.x,
			dog.y,
			dog.displayWidth,
			dog.displayHeight
		);

		this.physics.world.enable(radius); // enable the zone's physics body

		(radius.body as Phaser.Physics.Arcade.Body)
			.setOffset(-225,-200)
			.setCircle(dog.displayWidth*2);

		overlappables.push(radius);

		const dispatcher = this.components.addComponent(
			radius,
			OverlayDispatcher
		);

		var textureChanged = false;
		dispatcher.setDispatchCallback((isOverlapping) => {
			if (dogTalkBubble.visible !== isOverlapping) {
				dogTalkBubble.setVisible(isOverlapping);
			}

			if (isOverlapping && this.sceneSwitchKey.isDown && !WorldScene.scenario9Fininshed) {
				this.switchScene(target_scene);
			}

			if(WorldScene.scenario9Fininshed && textureChanged == false){
				dog.setTexture(this.dogeFrisbee);
				dog.play(this.dogeFrisbee);
				dogTalkBubble.setVisible(false);
				textureChanged = true;
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
		const doorCollidable = new MovableEntity(scene, x, y+18, this.doorScene3).setVisible(false);

		doorCollidable.setBodySize(100,200)
			.setImmovable(true)
			.setDepth(DepthLayers.Collision_houses)
			.setInteractive({ useHandCursor: true })
			.on("pointerdown", () => {if(!WorldScene.scenario11Fininshed){this.switchScene(target_scene)}});

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
				if (WorldScene.scenario11Fininshed){
					doorCollidable.setVisible(false);
				}else{
					doorCollidable.setVisible(isOverlapping);
				}	
			

			if (isOverlapping && this.sceneSwitchKey.isDown && !WorldScene.scenario11Fininshed) {
				this.switchScene(target_scene);
			}
		});
	}

	
}
