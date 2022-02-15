import GameObject = Phaser.GameObjects.GameObject;
import PhaserImage = Phaser.GameObjects.Image;
import AbstractComponent from "./AbstractComponent";

/**
 * Stretches an image to the fullscreen bounds of the scene
 */
export default class MakeFullscreen extends AbstractComponent {
	private img: PhaserImage;

	public constructor(obj: GameObject) {
		super(obj, typeof MakeFullscreen);

		this.img = obj as PhaserImage;
	}

	public awake(): void {
		this.img.setPosition(
			this.img.scene.scale.width / 2,
			this.img.scene.scale.height / 2
		);
		this.img.setSize(
			this.img.scene.scale.width,
			this.img.scene.scale.height
		);
	}
}
