import MapIcon from "@assets/images/UI/map_icon.png"
import BadgeIcon from "@assets/images/UI/badge_icon.png"
import ControlsIcon from "@assets/images/UI/controls_icon.png"
import ControlUp from "@assets/images/UI/up.png"
import ControlDown from "@assets/images/UI/down.png"
import ControlLeft from "@assets/images/UI/left.png"
import ControlRight from "@assets/images/UI/right.png"
import ControlSpacebar from "@assets/images/UI/spacebar.png"
import ControlClick from "@assets/images/UI/mouse_click.png"
import ControlRegular from "@assets/images/UI/mouse_regular.png"
import UnmutedSoundIcon from "@assets/images/UI/unmuted.png";
import MutedSoundIcon from "@assets/images/UI/muted.png";
import { Scene } from "phaser";
import SceneLifecycle from "../SceneLifecycle";
import Sprite = Phaser.GameObjects.Sprite;

export default class UI extends Scene implements SceneLifecycle {

    private map_icon!: string;

    private badge_icon!: string;

    private controls_icon!: string;

    private controlUp!: string;
    private controlDown!: string;
    private controlLeft!: string;
    private controlRight!: string;
    private controlSpacebar!: string;
    private controlClick!: string;
    private controlRegular!: string;
    private controlUpEntity!: Sprite;
    private controlDownEntity!: Sprite;
    private controlLeftEntity!: Sprite;
    private controlRightEntity!: Sprite;
    private controlSpacebarEntity!: Sprite;
    private controlClickEntity!: Sprite;
    private controlRegularEntity!: Sprite;

	private muted!: string;

	private unmuted!: string;

    private muteState!: boolean;
    private controlState!: boolean;

    public init(): void {
        this.map_icon = "map";
        this.badge_icon = "badge";
        this.controls_icon = "controls";
        this.controlUp = "up";
        this.controlDown = "down";
        this.controlLeft = "left";
        this.controlRight = "right";
        this.controlSpacebar = "spacebar";
        this.controlClick = "click";
        this.controlRegular = "regular";
		this.muted = "muted";
		this.unmuted = "unmuted";
        this.muteState = false;
        this.controlState = false;
    }

    constructor ()
    {
        super({ key: 'UIScene', active: true });
    }

    public preload(): void {
        this.load.image(this.map_icon, MapIcon);
        this.load.image(this.badge_icon,BadgeIcon);
        this.load.image(this.controls_icon, ControlsIcon);
        this.load.image(this.controlUp, ControlUp);
        this.load.image(this.controlDown, ControlDown);
        this.load.image(this.controlLeft, ControlLeft);
        this.load.image(this.controlRight, ControlRight);
        this.load.image(this.controlSpacebar, ControlSpacebar);
        this.load.image(this.controlClick, ControlClick);
        this.load.image(this.controlRegular, ControlRegular);
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
                switch(this.muteState){
                    case false:
                        togglesound.setTexture(this.muted);
                        this.muteState = true;
                        this.game.sound.mute = true;
                        break;
                    case true:
                        togglesound.setTexture(this.unmuted);
                        this.muteState = false;
                        this.game.sound.mute = false;
                        break;
                }
			});
        
        this.controlSpacebarEntity = this.add.sprite(400, 600, this.controlSpacebar).setScale(0.5).setVisible(false);
        this.controlUpEntity = this.add.sprite(950, 450, this.controlUp).setScale(0.5).setVisible(false);
        this.controlDownEntity = this.add.sprite(950, 750, this.controlDown).setScale(0.5).setVisible(false);
        this.controlLeftEntity = this.add.sprite(800, 600, this.controlLeft).setScale(0.5).setVisible(false);
        this.controlRightEntity = this.add.sprite(1100, 600, this.controlRight).setScale(0.5).setVisible(false);
        this.controlRegularEntity = this.add.sprite(1350, 600, this.controlRegular).setScale(0.5).setVisible(false);
        this.controlClickEntity = this.add.sprite(1600, 600, this.controlClick).setScale(0.5).setVisible(false);
        
        const controls = this.add
            .image(1850,170,this.controls_icon)
            .setScale(0.4)
            .setInteractive({useHandCursor: true})
            .on("pointerdown",() => {
                switch(this.controlState){
                   case false:
                        this.controlUpEntity.setVisible(true);
                        this.controlDownEntity.setVisible(true);
                        this.controlLeftEntity.setVisible(true);
                        this.controlRightEntity.setVisible(true);
                        this.controlSpacebarEntity.setVisible(true);
                        this.controlRegularEntity.setVisible(true);
                        this.controlClickEntity.setVisible(true);
                        this.controlState = true;
                        break;
                    case true:
                        this.controlUpEntity.setVisible(false);
                        this.controlDownEntity.setVisible(false);
                        this.controlLeftEntity.setVisible(false);
                        this.controlRightEntity.setVisible(false);
                        this.controlSpacebarEntity.setVisible(false);
                        this.controlRegularEntity.setVisible(false);
                        this.controlClickEntity.setVisible(false);
                        this.controlState = false;
                        break;       
                }
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