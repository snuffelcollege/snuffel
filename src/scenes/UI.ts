import MapIcon from "@assets/images/UI/map_icon.png";
import BadgeIcon from "@assets/images/UI/badge_icon.png";
import BadgeCase from "@assets/images/UI/badges/badge_case.png";
import BadgeS1 from "@assets/images/UI/badges/badge_s1.png";
import BadgeS2 from "@assets/images/UI/badges/badge_s2.png";
import BadgeS3 from "@assets/images/UI/badges/badge_s3.png";
import BadgeS4 from "@assets/images/UI/badges/badge_s4.png";
import BadgeS5 from "@assets/images/UI/badges/badge_s5.png";
import BadgeS6 from "@assets/images/UI/badges/badge_s6.png";
import ControlsIcon from "@assets/images/UI/controls_icon.png";
import ControlKeys from "@assets/spritesheets/UI/tutorial_buttons.png";
import ControlKeysData from "@assets/spritesheets/UI/tutorial_buttons.json";
import ControlSpacebar from "@assets/images/UI/spacebar.png";
import ControlClick from "@assets/images/UI/mouse_click.png";
import ControlRegular from "@assets/images/UI/mouse_regular.png";
import UnmutedSoundIcon from "@assets/images/UI/unmuted.png";
import MutedSoundIcon from "@assets/images/UI/muted.png";
import controlArrow from "@assets/spritesheets/UI/pointing_arrow.png";
import controlArrowData from "@assets/spritesheets/UI/pointing_arrow.json";
import { Scene } from "phaser";
import SceneLifecycle from "../SceneLifecycle";
import Sprite = Phaser.GameObjects.Sprite;
import WorldScene from "./WorldScene";
import { World } from "matter";

export default class UI extends Scene implements SceneLifecycle {

    private map_icon!: string;

    private badge_icon!: string;
    private badgeCase!: string;
    private badgeS1!: string;
    private badgeS2!: string;
    private badgeS3!: string;
    private badgeS4!: string;
    private badgeS5!: string;
    private badgeS6!: string;
    private badgeState!: boolean;

    private controls_icon!: string;
    private controlKeys!: string;
    private controlSpacebar!: string;
    private controlClick!: string;
    private controlRegular!: string;
    private controlKeysEntity!: Sprite;
    private controlSpacebarEntity!: Sprite;
    private controlClickEntity!: Sprite;
    private controlRegularEntity!: Sprite;
    private controlArrow!: string;
    private controlArrowEntity!: Sprite;
	private muted!: string;
	private unmuted!: string;
    private controlState!: boolean;

    public init(): void {
        this.map_icon = "map";
        this.badge_icon = "badge";
        this.badgeCase = "badgecase";
        this.badgeS1 = "badges1";
        this.badgeS2 = "badges2";
        this.badgeS3 = "badges3";
        this.badgeS4 = "badges4";
        this.badgeS5 = "badges5";
        this.badgeS6 = "badges6";
        this.badgeState = false;
        this.controls_icon = "controls";
        this.controlKeys = "controlKeys";
        this.controlSpacebar = "spacebar";
        this.controlClick = "click";
        this.controlRegular = "regular";
        this.controlArrow = "controlArrow";
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
        this.load.image(this.badgeCase, BadgeCase);
        this.load.image(this.badgeS1,BadgeS1);
        this.load.image(this.badgeS2,BadgeS2);
        this.load.image(this.badgeS3,BadgeS3);
        this.load.image(this.badgeS4,BadgeS4);
        this.load.image(this.badgeS5,BadgeS5);
        this.load.image(this.badgeS6,BadgeS6);
        this.load.image(this.controls_icon, ControlsIcon);
        this.load.image(this.controlSpacebar, ControlSpacebar);
        this.load.image(this.controlClick, ControlClick);
        this.load.image(this.controlRegular, ControlRegular);
		this.load.image(this.muted, MutedSoundIcon);
		this.load.image(this.unmuted,UnmutedSoundIcon);
        this.load.aseprite(this.controlKeys, ControlKeys, ControlKeysData);
        this.load.aseprite(this.controlArrow, controlArrow, controlArrowData);
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

            this.anims.create({
                key: this.controlArrow,
                frameRate: 1,
                frames: this.anims.generateFrameNumbers(
                    this.controlArrow,
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
            this.controlArrowEntity = this.add.sprite(1700, 170, this.controlArrow).setScale(0.5).setVisible(false);
            this.controlArrowEntity.play(this.controlArrow);           
            

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
                            this.controlArrowEntity.setVisible(false);
                            this.controlState = false;
                            break;       
                    }
                });
            
            if(WorldScene.scenario1Fininshed == false && this.game.scene.isVisible("world-scene")){
                setTimeout(() => {
                    this.controlState = true;
                    this.controlKeysEntity.setVisible(true);
                    this.controlSpacebarEntity.setVisible(true);
                    this.controlRegularEntity.setVisible(true);
                    this.controlClickEntity.setVisible(true);
                    setTimeout(() => {                        
                        this.controlArrowEntity.setVisible(true);
                    }, 1000);
                }, 1000);
            }    

            const badgeCaseImage = this.add.sprite(1000,550, this.badgeCase).setScale(0.4).setVisible(false);
            const badgeS1Image = this.add.sprite(680,450, this.badgeS1).setScale(0.4).setVisible(false);
            const badgeS2Image = this.add.sprite(1010,445, this.badgeS2).setScale(0.4).setVisible(false);
            const badgeS3Image = this.add.sprite(1320,455, this.badgeS3).setScale(0.4).setVisible(false);
            const badgeS4Image = this.add.sprite(690,755, this.badgeS4).setScale(0.4).setVisible(false);
            const badgeS5Image = this.add.sprite(1010,765, this.badgeS5).setScale(0.4).setVisible(false);
            const badgeS6Image = this.add.sprite(1310,750, this.badgeS6).setScale(0.4).setVisible(false);

            this.registry

            const badge = this.add
                .image(1850,270,this.badge_icon)
                .setScale(0.4)
                .setInteractive({useHandCursor: true})
                .on("pointerdown",() => {
                    switch(this.badgeState){
                        case false:
                            badgeCaseImage.setVisible(true).setAlpha(0);
                            badgeS1Image.setVisible(WorldScene.scenario1Fininshed).setAlpha(0);
                            badgeS2Image.setVisible(WorldScene.scenario2Fininshed).setAlpha(0);
                            badgeS3Image.setVisible(WorldScene.scenario3Fininshed).setAlpha(0);
                            badgeS4Image.setVisible(WorldScene.scenario4Fininshed).setAlpha(0);
                            badgeS5Image.setVisible(WorldScene.scenario5Fininshed).setAlpha(0);
                            badgeS6Image.setVisible(WorldScene.scenario6Fininshed).setAlpha(0);
                            //fade in effect
                            this.add.tween({
                                targets: [badgeCaseImage,badgeS1Image,badgeS2Image,badgeS3Image,badgeS4Image,badgeS5Image,badgeS6Image],
                                ease: 'Sine.easeInOut',
                                duration: 500,
                                delay: 0,
                                alpha: {
                                  getStart: () => 0,
                                  getEnd: () => 1
                                }
                              });
                            this.badgeState = true;
                            break;
                        case true:
                            //fadeout effect
                            this.add.tween({
                                targets: [badgeCaseImage,badgeS1Image,badgeS2Image,badgeS3Image,badgeS4Image,badgeS5Image,badgeS6Image],
                                ease: 'Sine.easeInOut',
                                duration: 500,
                                delay: 0,
                                alpha: {
                                  getStart: () => 1,
                                  getEnd: () => 0
                                },
                                onComplete: () => {
                                    badgeCaseImage.setVisible(false);
                                    badgeS1Image.setVisible(false);
                                    badgeS2Image.setVisible(false);
                                    badgeS3Image.setVisible(false);
                                    badgeS4Image.setVisible(false);
                                    badgeS5Image.setVisible(false);
                                    badgeS6Image.setVisible(false);
                                    this.badgeState = false;
                                }
                              });
                              break;                            
                    }
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