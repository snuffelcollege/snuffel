import GameObject = Phaser.GameObjects.GameObject;
import AbstractComponent from "./AbstractComponent";

type DispatchCallback = (isOverlapping: boolean) => unknown;

/**
 * Calls a callback if the game object is touching or embedded with a collider
 */
export default class OverlayDispatcher extends AbstractComponent {
	public isOverlapping: boolean;

	private gameObject: GameObject;

	private dispatchCallback!: DispatchCallback;

	constructor(obj: GameObject) {
		super(obj, typeof OverlayDispatcher);

		if (!obj.body) {
			throw Error(
				"The provided gameobject does not contain a physics body"
			);
		}

		this.isOverlapping = false;
		this.gameObject = obj;
	}

	public setDispatchCallback(cb: DispatchCallback): void {
		this.dispatchCallback = cb;
	}

	public update(): void {
		const touching = !(this.gameObject.body as Phaser.Physics.Arcade.Body)
			.touching.none;
		const wasTouching = !(
			this.gameObject.body as Phaser.Physics.Arcade.Body
		).wasTouching.none;
		const { embedded } = this.gameObject.body as Phaser.Physics.Arcade.Body;

		if (touching || wasTouching || embedded) {
			this.dispatchCallback(true);
		} else {
			this.dispatchCallback(false);
		}
	}
}
