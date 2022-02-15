import AbstractComponent from "./AbstractComponent";
import Sprite = Phaser.GameObjects.Sprite;
import PhaserAnimation = Phaser.Animations.Animation;
import Size = Phaser.GameObjects.Components.Size;

/**
 * Integrate aseprite animations with Sprites
 */
export default class FixedHeightAnimator extends AbstractComponent {
	public readonly animatable!: Sprite;

	public desiredHeight!: number;

	private animations!: PhaserAnimation[];

	constructor(sprite: Sprite) {
		super(sprite, typeof AbstractComponent);

		this.animatable = sprite;
		this.desiredHeight = sprite.displayHeight;
		this.animations = [];
	}

	/**
	 * Returns the ratio-locked width for the sizeable object after it's scaled to the provided height
	 * Note that this does not scale the actual object to the provided height.
	 * @param sizeable - The object to scale
	 * @param height - The new height to scale it to
	 */
	private static getRatioDisplayWidth(
		sizeable: Size,
		height: number
	): number {
		// ...
		const oHeight = sizeable.displayHeight;
		const oWidth = sizeable.displayWidth;

		return height / (oHeight / oWidth);
	}

	/**
	 * Associates an animation with the Game Object and returns the id for the animation
	 * @param anim - The animation to be added
	 */
	public addAnimation(anim: PhaserAnimation): number {
		const index = this.animations.length;
		this.animations.push(anim);

		return index;
	}

	/**
	 * Adds playable animations to the component
	 * @param anims - An array of animations to be added
	 */
	public addAnimations(...anims: PhaserAnimation[]): number[] {
		const aids /* Animation IDs */ = [
			this.animations.length,
			this.animations.length + anims.length,
		];
		this.animations.push(...anims);

		return aids;
	}

	/**
	 * Loops an animation
	 * @param aid - The animation ID to loop
	 * @param ignoreIfPlaying - Restart animation if it's already playing
	 */
	public loop(aid: number, ignoreIfPlaying = true): void {
		this.animatable
			.play(
				{
					key: this.animations[aid].key,
					repeat: -1,
				},
				ignoreIfPlaying
			)
			.setDisplaySize(
				FixedHeightAnimator.getRatioDisplayWidth(
					this.animatable,
					this.desiredHeight
				),
				this.desiredHeight
			);
	}

	/**
	 * Stop the animation
	 */
	public stop(): void {
		this.animatable.stop();
	}

	/**
	 * Play an animation once
	 * @param aid - The animation ID to play
	 * @param ignoreIfPlaying - Restart animation if it's already playing
	 */
	public once(aid: number, ignoreIfPlaying: boolean): void {
		const previousAnim = this.animatable.anims.currentAnim;

		this.animatable
			.play(this.animations[aid].key, ignoreIfPlaying)
			.setDisplaySize(
				FixedHeightAnimator.getRatioDisplayWidth(
					this.animatable,
					this.desiredHeight
				),
				this.desiredHeight
			)
			.playAfterRepeat(previousAnim);
	}
}
