import DepthLayers from "../DepthLayers";
import Depth = Phaser.GameObjects.Components.Depth;
import Transform = Phaser.GameObjects.Components.Transform;
import Size = Phaser.GameObjects.Components.Size;

/**
 * Use to indicate an object can be depth sorted
 */
interface DepthSortable extends Depth, Transform, Size {}

// todo: encapsulate update call into this file & chunk the sort calls to cull whatever is not on screen.

/**
 * Use to depth sort objects based on their y position & DepthLayer when {@link DepthSorter.sort} is called.
 */
export default class DepthSorter {
	private readonly sortables: DepthSortable[];

	private readonly depthLayers: DepthLayers[];

	private count = 0;

	private interval = 200;

	private ratio = 10_000;

	constructor() {
		this.sortables = [];
		this.depthLayers = [];
	}

	private static sort(
		sortables: DepthSortable[],
		depthLayers: DepthLayers[],
		ratio: number
	): void {
		for (let index = 0; index < sortables.length; index += 1) {
			const sprite = sortables[index];
			const depthLayer = depthLayers[index];

			sprite.setDepth(
				depthLayer + (sprite.y + sprite.displayHeight / 2) / ratio
			);
		}
	}

	/**
	 * Use to set the ratio of which to divide the y position with as to not overtake the DepthLayer.
	 * @remarks
	 * Using a low ratio might cause the DepthLayer to be incremented onto a higher level than it should be.
	 * @param ratio
	 */
	public setRatio(ratio: number): void {
		this.ratio = ratio;
	}

	/**
	 * Sorts the added objects
	 * @param time - the total time elapsed
	 * @param dTime - the time elapsed since last sort
	 */
	public sort(time: number, dTime: number): void {
		this.count += dTime;
		if (this.count >= this.interval) {
			DepthSorter.sort(this.sortables, this.depthLayers, this.ratio);
			this.count = 0;
		}
	}

	/**
	 * Adds a sortable object to the sorter
	 * @param sortable - The object to be sorted
	 * @param depthLayer - The depth layer on which it should remain
	 */
	public addSortable(sortable: DepthSortable, depthLayer: DepthLayers): void {
		this.sortables.push(sortable);
		this.depthLayers.push(depthLayer);
		DepthSorter.sort(this.sortables, this.depthLayers, this.ratio);
	}
}
