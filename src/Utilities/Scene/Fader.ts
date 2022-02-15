import { Scene } from "phaser";
import Camera = Phaser.Cameras.Scene2D.Camera;
import WAKE = Phaser.Scenes.Events.WAKE;
import CREATE = Phaser.Scenes.Events.CREATE;

export function fadeToBlack(
	scene: Scene,
	onComplete?: (camera: Camera) => unknown,
	duration = 500
): void {
	scene.cameras.main.fadeOut(
		duration,
		0,
		0,
		0,
		onComplete &&
			((camera: Camera, progress: number) => {
				if (progress >= 1) {
					onComplete(camera);
				}
			})
	);
}

export function fadeFromBlack(
	scene: Scene,
	onComplete?: (camera: Camera) => unknown,
	duration = 500
): void {
	scene.cameras.main.fadeIn(
		duration,
		0,
		0,
		0,
		onComplete &&
			((camera: Camera, progress: number) => {
				if (progress >= 1) {
					onComplete(camera);
				}
			})
	);
}

export function addFadeIn(scene: Scene) {
	scene.events.on(WAKE as string, fadeFromBlack);
	scene.events.on(CREATE as string, fadeFromBlack);
}
