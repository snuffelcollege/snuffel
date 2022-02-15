import { Scene } from "phaser";
import Sprite = Phaser.Physics.Arcade.Sprite;

/**
 * @deprecated
 * Use components instead
 * @remarks
 * The entity class extends the [Arcade Sprite](https://photonstorm.github.io/phaser3-docs/Phaser.Physics.Arcade.Sprite.html) from phaser 3.
 * This means every subclass of the Entity class has a physics body attached to it, this physics body can either be dynamic or static.
 *
 * Every entity can expose a preload, init, create, and update method.
 *
 */
export default class Entity extends Sprite {
	protected hasPhysics = false;

	protected constructor(
		scene: Scene,
		x: number,
		y: number,
		spriteKey: string
	) {
		super(scene, x, y, spriteKey);
		this.scene.add.existing(this);
		this.hasPhysics = this.scene.physics !== undefined;
	}

	public setScene(scene: Scene): void {
		this.scene = scene;
		this.scene.add.existing(this);
		this.scene.physics.add.existing(this);
		this.hasPhysics = this.scene.physics !== undefined;
	}

	/**
	 * @returns - The physics body attached to the player cast into the arcade physics model
	 */
	protected physicsBody(): Phaser.Physics.Arcade.Body {
		return this.body as Phaser.Physics.Arcade.Body;
	}
}
