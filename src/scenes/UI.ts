import UnmutedSoundIcon from "@assets/images/world/unmuted.png";
import MutedSoundIcon from "@assets/images/world/muted.png";
import { Scene } from "phaser";
import SceneLifecycle from "../SceneLifecycle";

export default class UI extends Scene implements SceneLifecycle {

    
	private muted!: string;

	private unmuted!: string;

    private mutestate!: boolean;

    public init(): void {
		this.muted = "muted";
		this.unmuted = "unmuted";
        this.mutestate = false;
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
			.image(1800,100, this.unmuted)
            .setScale(0.6)            
			.setInteractive({ useHandCursor: true })
			.on("pointerdown", () => {
                switch(this.mutestate){
                    case false:
                        togglesound.setTexture(this.muted);
                        this.mutestate = true;
                        this.game.sound.mute = true;
                        break;
                    case true:
                        togglesound.setTexture(this.unmuted);
                        this.mutestate = false;
                        this.game.sound.mute = false;
                        break;
                }
			})
    }
}