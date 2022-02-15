import { Scene } from "phaser";
import Entity from "./Entity";
import Vector2Like = Phaser.Types.Math.Vector2Like;

/**
 * @deprecated
 * Use components instead
 * @remarks
 * A subclass of MovableEntity has a collision body and is able to move itself or is able
 * to be moved relative to the game world it is rendered in.
 */
export default class MovableEntity extends Entity {
	public readonly velocity: number;

	constructor(
		scene: Scene,
		x: number,
		y: number,
		spriteKey: string,
		maxVelocity = 64
	) {
		super(scene, x, y, spriteKey);

		if (!this.scene.physics) {
			throw new Error(
				"No configured arcade physics found for the current scene"
			);
		}

		this.scene.physics.add.existing(this);

		this.velocity = maxVelocity;
	}

	/**
	 * Sets the directional velocity to the parameters values. If the vector contains undefined fields it is discarded.
	 * @param velocity - The directional velocity in the form of a Vector2Like
	 */
	public move(velocity: Vector2Like): void {
		const { x, y } = velocity;

		if (typeof x === "number" && typeof y === "number") {
			this.setVelocity(x, y);
		}
	}
}
