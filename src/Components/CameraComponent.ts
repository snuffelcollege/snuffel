import { Scene } from "phaser";
import AbstractComponent from "./AbstractComponent";
import GameObject = Phaser.GameObjects.GameObject;

/**
 * Sets the main camera to follow a game object
 */
export default class CameraComponent extends AbstractComponent {
	private readonly gameObject: GameObject;

	private scene: Scene;

	constructor(obj: GameObject) {
		super(obj, typeof obj);

		this.gameObject = obj;
		this.scene = obj.scene;
	}

	public start(): void {
		this.scene.cameras.main.setZoom(.58);
		this.scene.cameras.main.startFollow(this.gameObject, true, 0.1, 0.1);
	}

	public destroy(): void {
		this.scene.cameras.main.stopFollow();
	}
}
