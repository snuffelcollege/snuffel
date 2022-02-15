import { Scene } from "phaser";
import Entity from "./Entity";

/**
 * @deprecated
 * Use components instead
 */
export default class StaticEntity extends Entity {
	constructor(scene: Scene, x: number, y: number, spriteKey: string) {
		super(scene, x, y, spriteKey);

		this.setScene(scene);

		if (this.hasPhysics) {
			// this.setImmovable(true);
			this.physicsBody().setCollideWorldBounds(true);
		}
	}

	public setBoxColliders(
		width: number,
		height: number,
		xOffset: number,
		yOffset: number
	): void {
		this.setSize(width, height);
		(this.body as Phaser.Physics.Arcade.Body).setOffset(xOffset, yOffset);
	}
}
