import GameObject = Phaser.GameObjects.GameObject;

/**
 * Used as a template for custom components.
 */
export default abstract class AbstractComponent {
	public readonly name: string;

	protected constructor(obj: GameObject, name: string) {
		this.name = name;
	}

	/**
	 * Use to instantiate static properties.
	 * @remarks
	 * This method is fired before it is added to a scene, but after the component is made aware of the game object
	 */
	public awake?(): void;

	/**
	 * Fired at every game step.
	 * @param time - The elapsed time
	 * @param deltaTime - The elapsed time since last update call
	 */
	public update?(time: number, deltaTime: number): void;

	/**
	 * Use to perform actions that should only fire once
	 *
	 * @remarks
	 * It is called after the component has been added to a scene. It fires on the first update call, and none after.
	 */
	public start?(): void;

	/**
	 * Use to cleanup any lingering hooks or callbacks that have been created by the component on the scene or object.
	 *
	 * @remarks
	 * This method is fired when the gameobject is destroyed.
	 */
	public destroy?(): void;
}
