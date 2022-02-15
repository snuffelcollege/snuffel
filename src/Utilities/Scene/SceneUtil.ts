import { Scene } from "phaser";
import UPDATE = Phaser.Scenes.Events.UPDATE;

// todo: Create a waitFor version which emits a scene event to prevent "callback hell" when nesting is required.

/**
 * Use it to wait for a specific amount of time.
 *
 * @param scene - The scene which to wait in.
 * @param onComplete - The function to execute when waiting is done.
 * @param duration - How long to wait in miliseconds
 */
function waitFor(scene: Scene, onComplete: () => void, duration: number): void {
	let elapsed = 0;

	const updateListener = (time: number, deltaTime: number) => {
		elapsed += deltaTime;

		if (elapsed > duration) {
			onComplete();
			scene.events.removeListener(UPDATE as string, updateListener);
		}
	};

	scene.events.addListener(UPDATE as string, updateListener);
}

// Remove the below line once more exports are made
// eslint-disable-next-line import/prefer-default-export
export { waitFor };
