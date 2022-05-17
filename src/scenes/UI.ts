import MapIcon from "@assets/images/UI/map_icon.png";
import BadgeIcon from "@assets/images/UI/badge_icon.png";
import BadgeCase from "@assets/images/UI/badges/badge_case.png";
import BadgeS1 from "@assets/images/UI/badges/badge_s1.png";
import BadgeS2 from "@assets/images/UI/badges/badge_s2.png";
import BadgeS3 from "@assets/images/UI/badges/badge_s3.png";
import BadgeS4 from "@assets/images/UI/badges/badge_s4.png";
import BadgeS5 from "@assets/images/UI/badges/badge_s5.png";
import BadgeS6 from "@assets/images/UI/badges/badge_s6.png";
import BadgeS7 from "@assets/images/UI/badges/badge_s7.png";
import BadgeS8 from "@assets/images/UI/badges/badge_s8.png";
import BadgeS9 from "@assets/images/UI/badges/badge_s9.png";
import BadgeS10 from "@assets/images/UI/badges/badge_s10.png";
import GoodEmotion from "@assets/images/world/correct_option.png";
import MixedEmotion from "@assets/images/world/almost_option.png";
import BadEmotion from "@assets/images/world/incorrect_option.png";
import ContinueButton from "@assets/images/UI/continue_button.png";
import ReplayButton from "@assets/images/UI/replay_button.png";
import OptionStick from "@assets/images/world/option_stick.png";
import ControlsIcon from "@assets/images/UI/controls_icon.png";
import ControlKeys from "@assets/spritesheets/UI/tutorial_buttons.png";
import ControlKeysData from "@assets/spritesheets/UI/tutorial_buttons.json";
import ControlSpacebar from "@assets/images/UI/spacebar.png";
import ControlClick from "@assets/images/UI/mouse_click.png";
import ControlRegular from "@assets/images/UI/mouse_regular.png";
import UnmutedSoundIcon from "@assets/images/UI/soundunmuted.png";
import MutedSoundIcon from "@assets/images/UI/soundmuted.png";
import UnmutedMusicIcon from "@assets/images/UI/musicunmuted.png";
import MutedMusicIcon from "@assets/images/UI/musicmuted.png";
//import controlArrow from "@assets/spritesheets/UI/pointing_arrow.png";
//import controlArrowData from "@assets/spritesheets/UI/pointing_arrow.json";
import SparkleSheet from "@assets/spritesheets/UI/Sparkles.png";
import SparkleData from "@assets/spritesheets/UI/Sparkles.json";
import menuSound from "@assets/audio/UI/menu_button.mp3";
import FenceOpen from "@assets/audio/fence_open.mp3";
import TruckMove from "@assets/audio/truck_move.mp3";
import { Scene } from "phaser";
import SceneLifecycle from "../SceneLifecycle";
import Sprite = Phaser.GameObjects.Sprite;
import WorldScene from "./WorldScene";

export default class UI extends Scene implements SceneLifecycle {

    private map_icon!: string;

    private badge_icon!: string;
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
    //private controlArrow!: string;
    //private controlArrowEntity!: Sprite;
	private soundmuted!: string;
	private soundunmuted!: string;
	private musicmuted!: string;
	private musicunmuted!: string;
    private soundMuted!: boolean;
    private musicMuted!: boolean;
    private controlState!: boolean;

    public init(): void {
        this.map_icon = "map";
        this.badge_icon = "badge";
        this.badgeState = false;
        this.controls_icon = "controls";
        this.controlKeys = "controlKeys";
        this.controlSpacebar = "spacebar";
        this.controlClick = "click";
        this.controlRegular = "regular";
        //this.controlArrow = "controlArrow";
		this.soundmuted = "soundmuted";
		this.soundunmuted = "soundunmuted";
		this.musicmuted = "musicmuted";
		this.musicunmuted = "musicunmuted";
        this.soundMuted = false;
        this.musicMuted = false;
        this.controlState = false;
    }

    constructor ()
    {
        super({ key: 'UIScene', active: true });
    }

    public preload(): void {
        this.load.image(this.map_icon, MapIcon);
        this.load.image(this.badge_icon,BadgeIcon);
        this.load.image("badgecase", BadgeCase);
        this.load.image("badge1",BadgeS1);
        this.load.image("badge2",BadgeS2);
        this.load.image("badge3",BadgeS3);
        this.load.image("badge4",BadgeS4);
        this.load.image("badge5",BadgeS5);
        this.load.image("badge6",BadgeS6);
        this.load.image("badge7",BadgeS7);
        this.load.image("badge8",BadgeS8);
        this.load.image("badge9",BadgeS9);
        this.load.image("badge10",BadgeS10);
		this.load.image("continuebutton",ContinueButton);
		this.load.image("replaybutton",ReplayButton);
		this.load.image("goodemotion",GoodEmotion);
		this.load.image("mixedemotion",MixedEmotion);
		this.load.image("bademotion",BadEmotion);       
		this.load.image("stick", OptionStick);
        this.load.image(this.controls_icon, ControlsIcon);
        this.load.image(this.controlSpacebar, ControlSpacebar);
        this.load.image(this.controlClick, ControlClick);
        this.load.image(this.controlRegular, ControlRegular);
		this.load.image(this.soundmuted, MutedSoundIcon);
		this.load.image(this.soundunmuted,UnmutedSoundIcon);
		this.load.image(this.musicmuted, MutedMusicIcon);
		this.load.image(this.musicunmuted,UnmutedMusicIcon);
        this.load.aseprite(this.controlKeys, ControlKeys, ControlKeysData);
        //this.load.aseprite(this.controlArrow, controlArrow, controlArrowData);
        this.load.aseprite("sparkles", SparkleSheet, SparkleData);
        this.load.audio("menuSound", menuSound);        
		this.load.audio("fenceopen", FenceOpen);
		this.load.audio("truckmove",TruckMove);

    }

    create ()
    {
        var menuSound = this.sound.add("menuSound");
		
        if(this.scene.isVisible("start-scene")==false){
            
            var sound = "";
            if(this.sound.mute){
                sound = this.soundmuted;
            } else{
                sound = this.soundunmuted;
            }

            const togglesound = this.add
			.image(1850,70, sound)
            .setScale(0.4)
			.setInteractive({ useHandCursor: true })
			.on("pointerdown", () => {
                switch(this.sound.mute){
                    case false:
                        togglesound.setTexture(this.soundmuted);
                        this.sound.mute = true;
                        break;
                    case true:
                        togglesound.setTexture(this.soundunmuted);
                        this.sound.mute = false;
                        break;
                }
			});

            if(this.soundMuted){
                togglesound.setTexture(this.soundmuted);
            }

            var music = "";
            if(this.scene.isSleeping("world-scene")){   //player zit in een scene
                try{
                    this.sound.get("backgroundSong").duration;
                    this.sound.removeByKey("backgroundSong");
                    music = this.musicunmuted;
                    this.musicMuted = false;
                    this.sound.play("scenesong", {volume:0.2, loop:true});
                } catch {   //player had in overworld gemute dus in scene moet je ook mute
                    music = this.musicmuted;
                    this.musicMuted = true;
                } 
            } else {    //player zit in overworld
                try{
                    this.sound.get("scenesong").duration;
                    this.sound.removeByKey("scenesong");
                    music = this.musicunmuted;
                    this.musicMuted = false;
                    this.sound.play("backgroundSong", {volume:0.3, loop:true});
                } catch {   //player had in scene gemute dus in overwold moet je ook mute
                    music = this.musicmuted;
                    this.musicMuted = true;
                }
            }

            const togglemusic = this.add
			.image(1850,170, music)
            .setScale(0.4)
			.setInteractive({ useHandCursor: true })
			.on("pointerdown", () => {
                menuSound.play({
                    loop: false
                });
                if(this.scene.isSleeping("world-scene")){   //scene
                    if(this.musicMuted){    //mute
                        togglemusic.setTexture(this.musicunmuted);
                        this.sound.play("scenesong", {volume:0.2, loop:true});
                        this.musicMuted = false;
                    } else {    //unmute
                        togglemusic.setTexture(this.musicmuted);
                        this.sound.removeByKey("scenesong");
                        this.musicMuted = true;
                    }
                } else {    //overworld
                    if(this.musicMuted){    //mute
                        togglemusic.setTexture(this.musicunmuted);
                        this.sound.play("backgroundSong", {volume:0.3, loop:true});
                        this.musicMuted = false;
                    } else {    //unmute
                        togglemusic.setTexture(this.musicmuted);
                        this.sound.removeByKey("backgroundSong");
                        this.musicMuted = true;
                    }
                }
			});

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

            // this.anims.create({
            //     key: this.controlArrow,
            //     frameRate: 1,
            //     frames: this.anims.generateFrameNumbers(
            //         this.controlArrow,
            //         {
            //             start: 0,
            //             end: 1,
            //         }
            //     ),
            //     repeat: -1,
            // });	

            this.controlKeysEntity = this.add.sprite(950, 600, this.controlKeys).setScale(0.5).setVisible(false);
            this.controlKeysEntity.play(this.controlKeys);
            this.controlSpacebarEntity = this.add.sprite(400, 600, this.controlSpacebar).setScale(0.5).setVisible(false);
            this.controlRegularEntity = this.add.sprite(1350, 600, this.controlRegular).setScale(0.5).setVisible(false);
            this.controlClickEntity = this.add.sprite(1600, 600, this.controlClick).setScale(0.5).setVisible(false);
            //this.controlArrowEntity = this.add.sprite(1700, 270, this.controlArrow).setScale(0.5).setVisible(false);
            //this.controlArrowEntity.play(this.controlArrow);           
            

            const controls = this.add
                .image(1850,270,this.controls_icon)
                .setScale(0.4)
                .setInteractive({useHandCursor: true})
                .on("pointerdown",() => {
                    menuSound.play({
                        loop: false
                    });
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
                            //this.controlArrowEntity.setVisible(false);
                            this.controlState = false;
                            break;       
                    }
                });
            
            // if(!WorldScene.scenario1Fininshed && this.game.scene.isVisible("world-scene")){
            //     setTimeout(() => {
            //         this.controlState = true;
            //         this.controlKeysEntity.setVisible(true);
            //         this.controlSpacebarEntity.setVisible(true);
            //         this.controlRegularEntity.setVisible(true);
            //         this.controlClickEntity.setVisible(true);            
            //         //this.controlArrowEntity.setVisible(true);
            //     }, 1000);
            // }    

            const badgeCaseImage = this.add.sprite(960,550, "badgecase").setScale(0.6).setVisible(false);
            const badgeS1Image = this.add.sprite(512,482, "badge1").setScale(0.6).setVisible(false);
            const badgeS2Image = this.add.sprite(736,481, "badge2").setScale(0.6).setVisible(false);
            const badgeS3Image = this.add.sprite(966,481, "badge3").setScale(0.6).setVisible(false);
            const badgeS4Image = this.add.sprite(1200,481, "badge4").setScale(0.6).setVisible(false);
            const badgeS5Image = this.add.sprite(1430,481, "badge5").setScale(0.6).setVisible(false);
            const badgeS6Image = this.add.sprite(512,690, "badge6").setScale(0.6).setVisible(false);
            const badgeS7Image = this.add.sprite(745,690, "badge7").setScale(0.6).setVisible(false);
            const badgeS8Image = this.add.sprite(970,690, "badge8").setScale(0.6).setVisible(false);
            const badgeS9Image = this.add.sprite(1205,690, "badge9").setScale(0.6).setVisible(false);
            const badgeS10Image = this.add.sprite(1430,690, "badge10").setScale(0.6).setVisible(false);

            const badge = this.add
                .image(1850,370,this.badge_icon)
                .setScale(0.4)
                .setInteractive({useHandCursor: true})
                .on("pointerdown",() => {
                    menuSound.play({
                        loop: false
                    });
                    switch(this.badgeState){
                        case false:
                            badgeCaseImage.setVisible(true).setAlpha(0);
                            badgeS1Image.setVisible(WorldScene.scenario1Fininshed).setAlpha(0);
                            badgeS2Image.setVisible(WorldScene.scenario2Fininshed).setAlpha(0);
                            badgeS3Image.setVisible(WorldScene.scenario3Fininshed).setAlpha(0);
                            badgeS4Image.setVisible(WorldScene.scenario4Fininshed).setAlpha(0);
                            badgeS5Image.setVisible(WorldScene.scenario5Fininshed).setAlpha(0);
                            badgeS6Image.setVisible(WorldScene.scenario6Fininshed).setAlpha(0);
                            badgeS7Image.setVisible(WorldScene.scenario7Fininshed).setAlpha(0);
                            badgeS8Image.setVisible(WorldScene.scenario8Fininshed).setAlpha(0);
                            badgeS9Image.setVisible(WorldScene.scenario9Fininshed).setAlpha(0);
                            badgeS10Image.setVisible(WorldScene.scenario11Fininshed).setAlpha(0);
                            //fade in effect
                            this.add.tween({
                                targets: [badgeCaseImage,badgeS1Image,badgeS2Image,badgeS3Image,badgeS4Image,badgeS5Image,badgeS6Image,badgeS7Image,badgeS8Image,badgeS9Image,badgeS10Image],
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
                                targets: [badgeCaseImage,badgeS1Image,badgeS2Image,badgeS3Image,badgeS4Image,badgeS5Image,badgeS6Image,badgeS7Image,badgeS8Image,badgeS9Image,badgeS10Image],
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
                                    badgeS7Image.setVisible(false);
                                    badgeS8Image.setVisible(false);
                                    badgeS9Image.setVisible(false);
                                    badgeS10Image.setVisible(false);
                                    this.badgeState = false;
                                }
                              });
                              break;                            
                    }
                });
            const map = this.add
                .image(1850,370,this.map_icon)
                .setVisible(false)
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