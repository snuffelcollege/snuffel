import { Scene } from "phaser";
import PhaserImage = Phaser.GameObjects.Image;

/**
 * Adds a questionnaire option to the provided scene.
 * @param scene - the scene to create an option for
 * @param texture - the texture to use
 * @param x - the x position of the texture
 * @param y - the y position of the texture
 */
function createOption(
	scene: Scene,
	texture: string,
	x: number,
	y: number
): PhaserImage {
	return scene.add
		.image(x, y, texture)
		.setOrigin(0, 0)
		.setDepth(1)
		.setInteractive({ useHandCursor: true, pixelPerfect: true });
}

/**
 * Adds the effect presented to the player when an
 * option is chosen during the questionnaire of a scenario
 * @param scene - The scene for which to render the effect
 * @param correct - Whether the option which was chosen was correct or not
 */
function optionEffect(scene: Scene, correct: boolean): void {
	if (correct) {
		scene.cameras.main.flash(2000, 0, 200, 0);
	} else {
		scene.cameras.main.flash(2000, 200, 0, 0);
	}
}

export { createOption, optionEffect };
