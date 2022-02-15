export interface SharedParameters {
	[key: string | number]: unknown;
}

/**
 * Implement this interface when extending from {@link Phaser.Scene} to get better lifecycle hook completion
 */
export default interface SceneLifecycle {
	/**
	 * This method is called once per game step while the scene is running.
	 *
	 * @remarks
	 * See the {@link https://photonstorm.github.io/phaser3-docs/Phaser.Scene.html#update | Phaser Documentation} for more information.
	 * @param time - The total elapsed time
	 * @param deltaTime - The elapsed time since last update
	 */
	update?(time: number, deltaTime: number): void;

	/**
	 * Use it to create your game objects. This method is called by the Scene Manager when the scene starts, after init() and preload()
	 *
	 * @remarks
	 * See {@link https://photonstorm.github.io/phaser3-docs/Phaser.Types.Scenes.html#.SceneCreateCallback | Phaser Documentation} for more information.
	 * @param data - An object which can contain properties which will be available inside the preload, and init method (Not recommended to use)
	 */
	create?(data: SharedParameters): void;

	/**
	 * Use it to load assets. This method is called by the Scene Manager, after init() and before create()
	 *
	 * @remarks
	 * See {@link https://photonstorm.github.io/phaser3-docs/Phaser.Types.Scenes.html#.ScenePreloadCallback | Phaser Documentation} for more information.
	 * @param data - An object which can contain properties which will be available inside the preload, and init method (Not recommended to use)
	 */
	preload?(data: SharedParameters): void;

	/**
	 * Use it as a substitute for the constructor of a scene, instantiate "constant" properties here. This method is called by the Scene Manager when the scene starts, before preload() and create().
	 *
	 * @remarks
	 * See the {@link https://photonstorm.github.io/phaser3-docs/Phaser.Types.Scenes.html#.SceneInitCallback | Phaser Documentation} for more information.
	 * @param data - An object which can contain properties which will be available inside the preload, and init method (Not recommended to use)
	 */
	init?(data: SharedParameters): void;
}
