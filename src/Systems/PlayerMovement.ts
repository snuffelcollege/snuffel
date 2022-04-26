import { Scene } from "phaser";
import PlayerEntity from "../GameObjects/Entities/PlayerEntity";
import Vector2 = Phaser.Math.Vector2;
import Vector2Like = Phaser.Types.Math.Vector2Like;
import Pointer = Phaser.Input.Pointer;
import Key = Phaser.Input.Keyboard.Key;
import Keys = Phaser.Input.Keyboard.KeyCodes;

export type PlayerMovementArgs = {
	direction: Vector2Like;
	state: MovementState;
	isMoving: boolean;
};

enum MovementState {
	DOWN,
	UP,
	LEFT,
	RIGHT,
}

/**
 * adds player controls (WASD, Mouse clicks) to a scene.
 */
export default class PlayerMovement {
	protected static readonly maxVelocity = 2048;

	private static northWestRad = PlayerMovement.degToRad(225);

	private static northEastRad = PlayerMovement.degToRad(315);

	private static southWestRad = PlayerMovement.degToRad(135);

	private static southEastRad = PlayerMovement.degToRad(45);

	private static readonly PLAYER_MOVE = "PLAYER_MOVE";

	private scene: Scene;

	private player: PlayerEntity;

	private readonly keys: Phaser.Input.Keyboard.Key[];

	private readonly keyDirections: Vector2[];

	private direction = new Vector2();

	private state = MovementState.DOWN;

	private moving!: boolean;

	constructor(scene: Scene, player: PlayerEntity) {
		this.scene = scene;
		this.player = player;

		this.keys = [];
		this.keyDirections = [];
		this.addKeys(this.keys, this.keyDirections);
	}

	private static calcStateFromAngle(angle: number): MovementState {
		let state: MovementState;
		if (angle > this.southEastRad && angle < this.southWestRad) {
			// bottom animation
			state = MovementState.DOWN;
		} else if (angle >= this.southWestRad && angle <= this.northWestRad) {
			// left animation
			state = MovementState.LEFT;
		} else if (angle > this.northWestRad && angle < this.northEastRad) {
			// up animation
			state = MovementState.UP;
		} else {
			// right animation
			state = MovementState.RIGHT;
		}

		return state;
	}

	private static degToRad(degrees: number): number {
		return degrees * (Math.PI / 180);
	}

	public update(): void {
		const to = this.direction.reset();
		const ptr = this.scene.input.activePointer;

		if (ptr.isDown) {
			this.moveWithPointer(ptr, to);
		} else {
			this.moveWithKeys(to);
		}

		this.moving = !to.equals(Vector2.ZERO);

		if (!this.moving) {
			this.stopMoving();
		} else {
			const radianAngle = to.angle();
			this.state = PlayerMovement.calcStateFromAngle(radianAngle);
		}

		this.move(
			to
				.scale(PlayerMovement.maxVelocity)
				.limit(PlayerMovement.maxVelocity)
		);
	}

	public getState(): MovementState {
		return this.state;
	}

	public isMoving(): boolean {
		return this.moving;
	}

	private addKeys(keys: Key[], directions: Vector2[]): void {
		const kbd = this.scene.input.keyboard;

		if (!kbd) return;

		keys.push(
			kbd.addKey(Keys.W),
			kbd.addKey(Keys.A),
			kbd.addKey(Keys.D),
			kbd.addKey(Keys.S),
			kbd.addKey(Keys.UP),
			kbd.addKey(Keys.LEFT),
			kbd.addKey(Keys.RIGHT),
			kbd.addKey(Keys.DOWN)
		);

		directions.push(
			Vector2.UP,
			Vector2.LEFT,
			Vector2.RIGHT,
			Vector2.DOWN,
			Vector2.UP,
			Vector2.LEFT,
			Vector2.RIGHT,
			Vector2.DOWN
		);
	}

	private moveWithPointer(pointer: Pointer, direction: Vector2): Vector2 {
		const pos = {
			x:
				(this.player.x - this.scene.cameras.main.worldView.x) *
				this.scene.cameras.main.zoom,
			y:
				(this.player.y - this.scene.cameras.main.worldView.y) *
				this.scene.cameras.main.zoom,
		};

		return direction.copy(pointer.position).subtract(pos);
	}

	private moveWithKeys(direction: Vector2): Vector2 {
		for (let i = 0; i < this.keys.length; i += 1) {
			const key = this.keys[i];

			if (key.isDown) {
				direction.add(this.keyDirections[i]);
			}
		}

		return direction;
	}

	private move(to: Vector2Like) {
		this.player.setVelocity(to.x as number, to.y);
	}

	private stopMoving() {
		this.player.setVelocity(0, 0);
	}
}
