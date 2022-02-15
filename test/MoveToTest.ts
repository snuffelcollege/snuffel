import {Scene} from "phaser";
import ComponentService from "../src/Services/ComponentService";
import MoveTo from "../src/Components/MoveTo";

/**
 * Randomly tests the MoveTo method for 1000 iterations.
 * Increasing the number of iterations will improve test accuracy
 */
export default class MoveToTest extends Scene {
	create() {
		const components = new ComponentService();

		const testObj = this.add.sprite(0, 0, "");

		const mover = components.addComponent(testObj, MoveTo);

		const requestedIterations = 1000;
		let currentIteration = 0;

		mover.movingDone = () => {
			const x = Phaser.Math.FloatBetween(0, this.scale.width);
			const y = Phaser.Math.FloatBetween(0, this.scale.height);
			const velocity = Phaser.Math.FloatBetween(0.01, 1000);

			if (currentIteration < requestedIterations) {
				mover.velocity = velocity;
				mover.setTarget({ x, y });

				currentIteration += 1;
				console.log(`Completed iteration ${currentIteration}`);
			} else {
				window.alert(
					`Successfully completed ${currentIteration} randomized iterations!`
				);
			}
		};

		mover.movingDone();
	}
}
