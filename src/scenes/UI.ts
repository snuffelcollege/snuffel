import MapIcon from "@assets/images/UI/map_icon.png";
import BadgeIcon from "@assets/images/UI/badge_icon.png";
import ControlsIcon from "@assets/images/UI/controls_icon.png";
import ControlKeys from "@assets/images/UI/tutorial_buttons.png";
import ControlKeysData from "@assets/images/UI/tutorial_buttons.json";
import ControlSpacebar from "@assets/images/UI/spacebar.png";
import ControlClick from "@assets/images/UI/mouse_click.png";
import ControlRegular from "@assets/images/UI/mouse_regular.png";
import UnmutedSoundIcon from "@assets/images/UI/unmuted.png";
import MutedSoundIcon from "@assets/images/UI/muted.png";
import { Scene } from "phaser";
import SceneLifecycle from "../SceneLifecycle";
import Sprite = Phaser.GameObjects.Sprite;
// import { config } from "vue/types/umd"

export default class UI extends Scene implements SceneLifecycle {

    private map_icon!: string;

    private badge_icon!: string;

    private controls_icon!: string;

    private controlKeys!: string;
    private controlSpacebar!: string;
    private controlClick!: string;
    private controlRegular!: string;
    private controlKeysEntity!: Sprite;
    private controlSpacebarEntity!: Sprite;
    private controlClickEntity!: Sprite;
    private controlRegularEntity!: Sprite;
	private muted!: string;
	private unmuted!: string;
    private controlState!: boolean;

    public init(): void {
        this.map_icon = "map";
        this.badge_icon = "badge";
        this.controls_icon = "controls";
        this.controlKeys = "controlKeys";
        this.controlSpacebar = "spacebar";
        this.controlClick = "click";
        this.controlRegular = "regular";
		this.muted = "muted";
		this.unmuted = "unmuted";
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
        this.load.image(this.controlSpacebar, ControlSpacebar);
        this.load.image(this.controlClick, ControlClick);
        this.load.image(this.controlRegular, ControlRegular);
		this.load.image(this.muted, MutedSoundIcon);
		this.load.image(this.unmuted,UnmutedSoundIcon);
        this.load.aseprite(this.controlKeys, ControlKeys, ControlKeysData);
    }

    create ()
    {
        if(this.game.scene.isVisible("start-scene")==false){
            const togglesound = this.add
			.image(1850,70, this.unmuted)
            .setScale(0.4)
			.setInteractive({ useHandCursor: true })
			.on("pointerdown", () => {
                switch(this.game.sound.mute){
                    case false:
                        togglesound.setTexture(this.muted);
                        this.game.sound.mute = true;
                        break;
                    case true:
                        togglesound.setTexture(this.unmuted);
                        this.game.sound.mute = false;
                        break;
                }
			});

            if(this.game.sound.mute){
                togglesound.setTexture(this.muted);
                console.log("MUTED");   
            }

            this.anims.create({
                key: this.controlKeys,
                frameRate: 1,
                frames: this.anims.generateFrameNumbers(
                    this.controlKeys,
                    {
                        start: 0,
                        end: 1,
                    }
                ),
                repeat: -1,
            });	

            this.controlKeysEntity = this.add.sprite(950, 600, this.controlKeys).setScale(0.5).setVisible(false);
            this.controlKeysEntity.play(this.controlKeys);
            this.controlSpacebarEntity = this.add.sprite(400, 600, this.controlSpacebar).setScale(0.5).setVisible(false);
            this.controlRegularEntity = this.add.sprite(1350, 600, this.controlRegular).setScale(0.5).setVisible(false);
            this.controlClickEntity = this.add.sprite(1600, 600, this.controlClick).setScale(0.5).setVisible(false);
            
            const controls = this.add
                .image(1850,170,this.controls_icon)
                .setScale(0.4)
                .setInteractive({useHandCursor: true})
                .on("pointerdown",() => {
                    switch(this.controlState){
                    case false:
                            this.controlKeysEntity.setVisible(true);
                            this.controlSpacebarEntity.setVisible(true);
                            this.controlRegularEntity.setVisible(true);
                            this.controlClickEntity.setVisible(true);
                            this.controlState = true;
                            break;
                        case true:
                            this.controlKeysEntity.setVisible(false);
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
            if(this.scene.isSleeping("world-scene")){
                badge.destroy();
                map.destroy();
                controls.destroy();
            }
        }
    }
}