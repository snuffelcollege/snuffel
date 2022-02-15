import sheet from "@assets/spritesheets/player/world/character/player_character_sheet.png";
import atlas from "@assets/spritesheets/player/world/character/player_character_sheet.json";
import { Scene } from "phaser";
import MovableEntity from "./MovableEntity";
import Vector2 = Phaser.Math.Vector2;

interface IMovable {
	move(velocity: Vector2): void;
}

/**
 * @deprecated
 * Use components instead
 * @remarks
 * Player Entity class. This file will contain the logic to interact and move around the game world.
 * Detais T.B.D.
 */
export default class PlayerEntity extends MovableEntity implements IMovable {
	public static readonly spriteKey = "player_character_sprite";

	public static readonly spriteSheet = sheet;

	public static readonly spriteAtlas = atlas;

	private static readonly velocity = 256;

	public readonly direction = new Vector2();

	constructor(scene: Scene, x: number, y: number) {
		super(scene, x, y, PlayerEntity.spriteKey, PlayerEntity.velocity);

		this.physicsBody().setCollideWorldBounds(true);

		// set collision bounds

		const collisionHeight = this.displayHeight / 5; // sets the actual collision to be 1/5th of the texture
		const collisionOffsetY = collisionHeight * 4; // positions the collision to be at the feet of the player;
		const collisionWidth = this.displayWidth / 2;
		const collisionOffsetX = collisionWidth / 2;

		this.setSize(collisionWidth, collisionHeight); // set collider to be 1/5th of the player
		this.physicsBody().setOffset(collisionOffsetX, collisionOffsetY); // set anchor at the feet of the player
		this.setScale(1);
	}
}
