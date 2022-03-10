import UnmutedSoundIcon from "@assets/images/world/unmuted.png";
import MutedSoundIcon from "@assets/images/world/muted.png";
import { Scene } from "phaser";
import SceneLifecycle from "../SceneLifecycle";

export default class UI extends Scene implements SceneLifecycle {

    
	private muted!: string;

	private unmuted!: string;

    public init(): void {
		this.muted = "muted";
		this.unmuted = "unmuted";
    }

    constructor ()
    {
        super({ key: 'UIScene', active: true });
    }

    public preload(): void {
		this.load.image(this.muted, MutedSoundIcon);
		this.load.image(this.unmuted,UnmutedSoundIcon);
    }

    create ()
    {
        const togglesound = this.add
			.image(200,200, this.unmuted)
			.setInteractive({ useHandCursor: true })
			.on("pointerdown", () => {
				console.log("test")
			})
    }
}