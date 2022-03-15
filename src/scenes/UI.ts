import MapIcon from "@assets/images/world/map_icon.png"
import BadgeIcon from "@assets/images/world/badge_icon.png"
import ControlsIcon from "@assets/images/world/controls_icon.png"
import UnmutedSoundIcon from "@assets/images/world/unmuted.png";
import MutedSoundIcon from "@assets/images/world/muted.png";
import { Scene } from "phaser";
import SceneLifecycle from "../SceneLifecycle";

export default class UI extends Scene implements SceneLifecycle {

    private map_icon!: string;

    private badge_icon!: string;

    private controls_icon!: string;

	private muted!: string;

	private unmuted!: string;

    private mutestate!: boolean;

    public init(): void {
        this.map_icon = "map";
        this.badge_icon = "badge";
        this.controls_icon = "controls";
		this.muted = "muted";
		this.unmuted = "unmuted";
        this.mutestate = false;
    }

    constructor ()
    {
        super({ key: 'UIScene', active: true });
    }

    public preload(): void {
        this.load.image(this.map_icon, MapIcon);
        this.load.image(this.badge_icon,BadgeIcon);
        this.load.image(this.controls_icon, ControlsIcon);
		this.load.image(this.muted, MutedSoundIcon);
		this.load.image(this.unmuted,UnmutedSoundIcon);
    }

    create ()
    {
        const togglesound = this.add
			.image(1850,70, this.unmuted)
            .setScale(0.4)            
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
			});
        const controls = this.add
            .image(1850,170,this.controls_icon)
            .setScale(0.4)
            .setInteractive({useHandCursor: true})
            .on("pointerdown",() => {
                //show controls
            });
        const badge = this.add
            .image(1850,270,this.badge_icon)
            .setScale(0.4)
            .setInteractive({useHandCursor: true})
            .on("pointerdown",() => {
                //open and close badge case
            });
        const map = this.add
            .image(1850,370,this.map_icon)
            .setScale(0.4)
            .setInteractive({useHandCursor: true})
            .on("pointerdown",() => {
                //show area map
           });


    }
}