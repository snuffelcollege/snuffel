import AbstractComponent from "./AbstractComponent";
import GameObject = Phaser.GameObjects.GameObject;
import Vector2 = Phaser.Math.Vector2;
import Transform = Phaser.GameObjects.Components.Transform;
import Vector2Like = Phaser.Types.Math.Vector2Like;

/**
 * Moves a transform to a desired location with a fixed velocity
 */
export default class MoveTo extends AbstractComponent {
	private static readonly DEFAULT_VELOCITY = 200;

	public readonly movableObj!: Transform;

	public velocity!: number;

	public move!: boolean;

	public movingDone!: () => void;

	private target!: Vector2;

	constructor(obj: GameObject) {
		super(obj, typeof MoveTo);

		if (
			typeof (obj as Vector2Like).x === undefined ||
			typeof (obj as Vector2Like).y === undefined
		) {
			throw Error(
				`MoveTo component obj does not implement Phaser.GameObjects.Components.Transform`
			);
		}

		this.movableObj = <Transform>(<unknown>obj);
		this.move = false;
		this.target = new Vector2();
	}

	/**
	 * Initialise settings
	 */
	public start(): void {
		if (!this.velocity) {
			this.velocity = MoveTo.DEFAULT_VELOCITY;
		}

		if (!this.target) {
			this.target = new Vector2(this.movableObj.x, this.movableObj.y);
		}
	}

	/**
	 * Move towards target until target has been reached, then fire a callback
	 * @param time
	 * @param deltaTime
	 */
	public update(time: number, deltaTime: number): void {
		if (!this.move) {
			return;
		}

		// todo: fix bug where sometimes sprites won't accurately find the target and instead bounce around it
		// should be bandaid fixed by flooring the values

		const pixelsPerMs = (this.velocity / 1000) * deltaTime; // velocity in pixels per ms;

		const fromX = this.movableObj.x;
		const fromY = this.movableObj.y;

		const toX = this.target.x;
		const toY = this.target.y;

		const direction = new Vector2(
			this.target.x - fromX,
			this.target.y - fromY
		).limit(pixelsPerMs);
		// limiting should have hopefully fixed the edge case issue
		// where obj would never reach their target due to incorrect float comparisons;

		const newX = fromX + direction.x;
		const newY = fromY + direction.y;

		// check if new position is within margin of the targeted pos
		// if so, set the coords to the target
		if (fromX <= toX && newX >= toX) {
			this.movableObj.setX(this.target.x);
		}

		if (fromY <= toY && newY >= toY) {
			this.movableObj.setY(this.target.y);
		}

		if (fromY === toY && fromX === toX) {
			// callback
			this.move = false;
			if (this.movingDone) {
				this.movingDone();
			}

			return;
		}

		this.movableObj.setPosition(newX, newY);
	}

	public setTarget(target: Vector2Like): void {
		if (this.target.equals(target)) {
			return;
		}

		this.target.copy(target);

		this.move = true;
	}
}
