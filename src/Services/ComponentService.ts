import GameObject = Phaser.GameObjects.GameObject;
import UPDATE = Phaser.Scenes.Events.UPDATE;
import AbstractComponent from "../Components/AbstractComponent";

/**
 * Adds components to game objects
 */
export default class ComponentService {
	private componentsByGameObject;

	constructor() {
		this.componentsByGameObject = new Map<
			GameObject,
			AbstractComponent[]
		>();
	}

	/**
	 * Use to add a component to the service.
	 * @param obj - The gameobject on which to attach the component
	 * @param Component - The component to add to the gameobject
	 */
	public addComponent<K extends GameObject, T extends AbstractComponent>(
		obj: K,
		Component: new (obj: K, componentService: ComponentService) => T
	): T {
		if (!this.componentsByGameObject.has(obj)) {
			this.componentsByGameObject.set(obj, []);
		}

		const components = this.componentsByGameObject.get(
			obj
		) as AbstractComponent[];

		const component = new Component(obj, this);

		components.push(component);

		if (component.awake) {
			component.awake();
		}

		if (component.start) {
			obj.scene.events.once(
				UPDATE as string,
				component.start.bind(component)
			);
		}

		if (component.update) {
			obj.scene.events.on(
				UPDATE as string,
				component.update.bind(component)
			);
		}

		if (component.destroy) {
			// todo: test if objects are destroyed on scene destruction AND on object destruction
			obj.on(
				Phaser.GameObjects.Events.DESTROY as string,
				this.onComponentDestroy.bind(this, obj, component)
			);
			obj.scene.events.on(
				Phaser.Scenes.Events.DESTROY as string,
				this.onComponentDestroy.bind(this, obj, component)
			);
		}

		return component;
	}

	/**
	 * @remarks
	 * The current implementation doesn't support adding or retrieving multiple components of the same type
	 * to a single gameobject
	 * @param obj - The gameobject to look for the component on
	 * @param type - The type of component to look for
	 * @returns An instance of the component if present, otherwise null.
	 */
	public getComponent<T extends AbstractComponent>(
		obj: GameObject,
		type: new (obj: GameObject) => T
	): T | null {
		const exists = this.componentsByGameObject.has(obj);

		if (!exists) {
			return null;
		}

		const components = this.componentsByGameObject.get(
			obj
		) as AbstractComponent[];

		for (let i = 0; i < components.length; i += 1) {
			const component = components[i];
			if (component instanceof type) {
				return component;
			}
		}

		return null;
	}

	/**
	 * Called when a gameobject is destroyed. Cleans up remaining listeners.
	 * @param obj - the gameobject which is destroyed
	 * @param component - the component which is attached to the gameobject
	 * @private
	 */
	private onComponentDestroy(
		obj: GameObject,
		component: AbstractComponent
	): void {
		// todo: figure out better object destruction
		// console.log(`Destroying ${obj.name} - ${component.name}`);
		if (component.start) {
			obj.scene.events.off(
				Phaser.Scenes.Events.PRE_UPDATE as string,
				component.start.bind(component),
				this
			);
		}

		if (component.update) {
			obj.scene.events.off(
				Phaser.Scenes.Events.UPDATE as string,
				component.update.bind(component),
				this
			);
		}

		if (component.destroy) {
			component.destroy();
		}
	}
}
