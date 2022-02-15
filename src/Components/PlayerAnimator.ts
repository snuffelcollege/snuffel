import PlayerMovement from "./PlayerMovement";
import PlayerEntity from "../GameObjects/Entities/PlayerEntity";
import AbstractComponent from "./AbstractComponent";
import GameObject = Phaser.GameObjects.GameObject;

/**
 * Animates the player character by choosing an animation to play based on the
 * direction the player is headed.
 */
export default class PlayerAnimator extends AbstractComponent {
	public spriteKey: string | null = null;

	public spriteAtlas: string | null = null;

	public spriteSheet: string | null = null;

	public mover!: PlayerMovement | null;

	public tags: Phaser.Animations.Animation[];

	private player: PlayerEntity;

	public constructor(obj: GameObject) {
		super(obj, typeof PlayerAnimator);

		this.player = obj as PlayerEntity;
		this.tags = [];
	}

	public start(): void {
		if (this.mover === null) {
			throw Error("Mover is not initialised");
		}

		if (this.spriteKey === null) {
			throw Error("Sprite Key is not provided");
		}

		if (this.spriteAtlas === null) {
			throw Error("Sprite Atlas is not provided");
		}

		if (this.spriteSheet === null) {
			throw Error("Sprite Sheet is not provided");
		}

		this.tags = this.player.scene.anims.createFromAseprite(this.spriteKey);
	}

	public update(): void {
		const offset = 4;

		if (this.mover) {
			const { state } = this.mover;
			if (state !== undefined) {
				const isMoving: boolean = this.mover.moving;
				const index = isMoving ? state : state + offset;

				this.player.play(this.tags[index], true);
			}
		}
	}
}
