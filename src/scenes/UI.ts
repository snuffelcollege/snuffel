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
import MapIcon from "@assets/images/UI/map_icon.png";
import MapBase from "@assets/images/UI/Map/map_base.png";
import MapRoll from "@assets/images/UI/Map/map_roll.png";
import MapPart1 from "@assets/images/UI/Map/map1.png";
import MapPart2 from "@assets/images/UI/Map/map2.png";
import MapPart3 from "@assets/images/UI/Map/map3.png";
import MapPart4 from "@assets/images/UI/Map/map4.png";
import MapX from "@assets/images/UI/Map/map_X.png";
import MapSound from "@assets/audio/UI/map_open.mp3";
import controlArrow from "@assets/spritesheets/UI/pointing_arrow.png";
import controlArrowData from "@assets/spritesheets/UI/pointing_arrow.json";
import SparkleSheet from "@assets/spritesheets/UI/Sparkles.png";
import SparkleData from "@assets/spritesheets/UI/Sparkles.json";
import menuSound from "@assets/audio/UI/menu_button.mp3";
import FenceOpen from "@assets/audio/fence_open.mp3";
import WoodenFenceOpen from "@assets/audio/wooden_fence_open.mp3";
import TruckMove from "@assets/audio/truck_move.mp3";
import { Scene } from "phaser";
import SceneLifecycle from "../SceneLifecycle";
import Sprite = Phaser.GameObjects.Sprite;
import WorldScene from "./WorldScene";
import { World } from "matter";

export default class UI extends Scene implements SceneLifecycle {

    private map_icon!: string;
    private map_base!: string;
    private map_roll!: string;
    private map1!: string;
    private map2!: string;
    private map3!: string;
    private map4!: string;
    private mapX!: string;
    private mapState!: boolean;
    private mapAnimating!: boolean;

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
    private controlArrow!: string;
    private controlArrowEntity!: Sprite;
	private soundmuted!: string;
	private soundunmuted!: string;
	private musicmuted!: string;
	private musicunmuted!: string;
    private soundMuted!: boolean;
    private musicMuted!: boolean;
    private controlState!: boolean;

    public init(): void {
        this.map_icon = "map";
        this.map_base = "mapbase";
        this.map_roll = "maproll";
        this.map1 = "map1";
        this.map2 = "map2";
        this.map3 = "map3";
        this.map4 = "map4";
        this.mapX = "mapX";
        this.badge_icon = "badge";
        this.badgeState = false;
        this.controls_icon = "controls";
        this.controlKeys = "controlKeys";
        this.controlSpacebar = "spacebar";
        this.controlClick = "click";
        this.controlRegular = "regular";
        this.controlArrow = "controlArrow";
		this.soundmuted = "soundmuted";
		this.soundunmuted = "soundunmuted";
		this.musicmuted = "musicmuted";
		this.musicunmuted = "musicunmuted";
        this.soundMuted = false;
        this.musicMuted = false;
        this.controlState = false;
        this.mapState = false;
        this.mapAnimating = false;
    }

    constructor ()
    {
        super({ key: 'UIScene', active: true });
    }

    public preload(): void {
        this.load.image(this.map_icon, MapIcon);
        this.load.image(this.map1, MapPart1);
        this.load.image(this.map2, MapPart2);
        this.load.image(this.map3, MapPart3);
        this.load.image(this.map4, MapPart4);
        this.load.image(this.mapX, MapX);
        this.load.image(this.map_base, MapBase);
        this.load.image(this.map_roll, MapRoll);
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
        this.load.aseprite(this.controlArrow, controlArrow, controlArrowData);
        this.load.aseprite("sparkles", SparkleSheet, SparkleData);
        this.load.audio("menuSound", menuSound);        
		this.load.audio("fenceopen", FenceOpen);
        this.load.audio("woodenfenceopen", WoodenFenceOpen);
		this.load.audio("truckmove",TruckMove);
        this.load.audio("mapSound", MapSound);

    }

    create ()
    {
        var menuSound = this.sound.add("menuSound");
        var mapSound = this.sound.add("mapSound");
		
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

            //creating animation for controls
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

            //initializing controls
            this.controlKeysEntity = this.add.sprite(950, 600, this.controlKeys).setScale(0.5).setVisible(false);
            this.controlKeysEntity.play(this.controlKeys);
            this.controlSpacebarEntity = this.add.sprite(400, 600, this.controlSpacebar).setScale(0.5).setVisible(false);
            this.controlRegularEntity = this.add.sprite(1350, 600, this.controlRegular).setScale(0.5).setVisible(false);
            this.controlClickEntity = this.add.sprite(1600, 600, this.controlClick).setScale(0.5).setVisible(false);                   
            
            //guide for controls
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
                            this.controlState = false;
                            break;       
                    }
                });

            //creating animation for arrow    
            this.anims.create({
                key: this.controlArrow,
                frameRate: 2,
                frames: this.anims.generateFrameNumbers(
                    this.controlArrow,
                    {
                        start: 0,
                        end: 1,
                    }
                ),
                repeat: -1,
            });	    
            
            //loading arrow aseprite
            this.controlArrowEntity = this.add.sprite(1700, 900, this.controlArrow).setScale(0.7).setVisible(false);
            this.controlArrowEntity.play(this.controlArrow);    

            //pointing arrow functionality
            if(WorldScene.scenario1Fininshed && !WorldScene.part1 && this.game.scene.isVisible("world-scene")){
                this.controlArrowEntity.setVisible(true);
                setTimeout(() => {       
                    this.controlArrowEntity.setVisible(false);
                }, 3000);
                WorldScene.part1 = true;
            } 
            if(WorldScene.scenario2Fininshed && WorldScene.scenario3Fininshed && !WorldScene.part2 && this.game.scene.isVisible("world-scene")){
                this.controlArrowEntity.setVisible(true);
                setTimeout(() => {       
                    this.controlArrowEntity.setVisible(false);
                }, 3000);
                WorldScene.part2 = true;
            } 
            if(WorldScene.scenario4Fininshed && WorldScene.scenario5Fininshed && WorldScene.scenario6Fininshed && !WorldScene.part3 && this.game.scene.isVisible("world-scene")){
                this.controlArrowEntity.setVisible(true).setRotation(1.57);
                setTimeout(() => {       
                    this.controlArrowEntity.setVisible(false);
                }, 3000);
                WorldScene.part3 = true;
            }  

            //initializing badgecase and badge images
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

            //badge case functionality
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
                            //badgecase is visible if button is pressed
                            badgeCaseImage.setVisible(true).setAlpha(0);

                            //sets badge to visible if scenario is finished
                            badgeS1Image.setVisible(WorldScene.scenario1Fininshed).setAlpha(0);
                            badgeS2Image.setVisible(WorldScene.scenario2Fininshed).setAlpha(0);
                            badgeS3Image.setVisible(WorldScene.scenario3Fininshed).setAlpha(0);
                            badgeS4Image.setVisible(WorldScene.scenario4Fininshed).setAlpha(0);
                            badgeS5Image.setVisible(WorldScene.scenario5Fininshed).setAlpha(0);
                            badgeS6Image.setVisible(WorldScene.scenario6Fininshed).setAlpha(0);
                            badgeS7Image.setVisible(WorldScene.scenario7Fininshed).setAlpha(0);
                            badgeS8Image.setVisible(WorldScene.scenario8Fininshed).setAlpha(0);
                            badgeS9Image.setVisible(WorldScene.scenario9Fininshed).setAlpha(0);
                            badgeS10Image.setVisible(WorldScene.scenario10Fininshed).setAlpha(0);
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
                                    //hiding all badges and badgecase
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

            const mapbase = this.add.image(1000,500, "mapbase").setVisible(false).setScale(0.8).setDepth(1);
            const maprollLeft = this.add.image(900,500, "maproll").setVisible(false).setScale(0.8).setDepth(2);
            const maprollRight = this.add.image(1000,500, "maproll").setVisible(false).setScale(0.8).setDepth(2);
            const map1 = this.add.image(1000,500, this.map1).setVisible(false).setScale(0.8).setDepth(1);
            const map2 = this.add.image(1000,500, this.map2).setVisible(false).setScale(0.8).setDepth(1);
            const map3 = this.add.image(1000,500, this.map3).setVisible(false).setScale(0.8).setDepth(1);
            const map4 = this.add.image(1000,500, this.map4).setVisible(false).setScale(0.8).setDepth(1);
            const mapX1 = this.add.image(600,450, this.mapX).setVisible(false).setScale(0.8).setDepth(1);
            const mapX2 = this.add.image(775,375, this.mapX).setVisible(false).setScale(0.7).setDepth(1);
            const mapX3 = this.add.image(1150,375, this.mapX).setVisible(false).setScale(0.7).setDepth(1);
            const mapX4 = this.add.image(1450,425, this.mapX).setVisible(false).setScale(0.6).setDepth(1);
            const mapX5 = this.add.image(1400,325, this.mapX).setVisible(false).setScale(0.7).setDepth(1);
            const mapX6 = this.add.image(1600,350, this.mapX).setVisible(false).setScale(0.8).setDepth(1);
            const mapX7 = this.add.image(1475,550, this.mapX).setVisible(false).setScale(0.7).setDepth(1);
            const mapX8 = this.add.image(1550,675, this.mapX).setVisible(false).setScale(0.6).setDepth(1);
            const mapX9 = this.add.image(1400,750, this.mapX).setVisible(false).setScale(0.5).setDepth(1);
            const mapX10 = this.add.image(800,700, this.mapX).setVisible(false).setScale(0.8).setDepth(1);
            
            const mapicon = this.add
                .image(1850,470,this.map_icon)
                .setScale(0.4)
                .setInteractive({useHandCursor: true})
                .on("pointerdown",() => {
                    if(!this.mapAnimating){ // map is opening, so button not clickable
                    mapSound.play();
                    switch(this.mapState){
                        case(false): //open map
                        this.mapAnimating = true;
                        mapbase.setCrop(800, 0, 100, mapbase.height);
                        map1.setCrop(800, 0, 100, map1.height);
                        map2.setCrop(800, 0, 100, map2.height);
                        map3.setCrop(800, 0, 100, map3.height);
                        map4.setCrop(800, 0, 100, map4.height);
                        maprollLeft.setX(900);
                        maprollRight.setX(1000);
                            setTimeout(() => {
                                maprollLeft.setVisible(true);
                                maprollRight.setVisible(true);
                                mapbase.setVisible(true);
                                map1.setVisible(true);
                                map2.setVisible(WorldScene.part1);
                                map3.setVisible(WorldScene.part2);
                                map4.setVisible(WorldScene.part3);
                                setTimeout(() => {
                                    maprollLeft.setX(700);
                                    maprollRight.setX(1200);
                                    mapbase.setCrop(600, 0, 500, mapbase.height);
                                    map1.setCrop(600, 0, 500, map1.height);
                                    map2.setCrop(600, 0, 500, map2.height);
                                    map3.setCrop(600, 0, 500, map3.height);
                                    map4.setCrop(600, 0, 500, map4.height);
                                    setTimeout(() => {
                                        maprollLeft.setX(400);
                                        maprollRight.setX(1500);
                                        mapbase.setCrop(200, 0, 1300, mapbase.height);
                                        map1.setCrop(200, 0, 1300, map1.height);
                                        map2.setCrop(200, 0, 1300, map2.height);
                                        map3.setCrop(200, 0, 1300, map3.height);
                                        map4.setCrop(200, 0, 1300, map4.height);
                                        setTimeout(() => {
                                            maprollLeft.setX(250);
                                            maprollRight.setX(1750);
                                            mapbase.setCrop(0, 0, mapbase.width, mapbase.height);
                                            map1.setCrop(0, 0, map1.width, map1.height);
                                            map2.setCrop(0, 0, map2.width, map2.height);
                                            map3.setCrop(0, 0, map3.width, map3.height);
                                            map4.setCrop(0, 0, map4.width, map4.height);

                                            mapX1.setVisible(true);
                                            if(WorldScene.part1){
                                                mapX1.setVisible(false);
                                                mapX2.setVisible(!WorldScene.scenario2Fininshed);   
                                                mapX3.setVisible(!WorldScene.scenario3Fininshed);
                                            }
                                            if(WorldScene.part2){
                                                mapX4.setVisible(!WorldScene.scenario4Fininshed);
                                                mapX5.setVisible(!WorldScene.scenario5Fininshed);
                                                mapX6.setVisible(!WorldScene.scenario6Fininshed);
                                            }
                                            if(WorldScene.part3){
                                                mapX7.setVisible(!WorldScene.scenario7Fininshed);
                                                mapX8.setVisible(!WorldScene.scenario8Fininshed);
                                                mapX9.setVisible(!WorldScene.scenario9Fininshed);
                                                mapX10.setVisible(!WorldScene.scenario10Fininshed);
                                            }
                                            this.mapState = true;
                                            this.mapAnimating = false;
                                        }, 250);
                                    }, 250);
                                }, 250);
                            }, 250);

                            //fade in effect
                            this.add.tween({
                                targets: [mapbase, maprollLeft, maprollRight],
                                ease: 'Sine.easeInOut',
                                duration: 500,
                                delay: 0,
                                alpha: {
                                  getStart: () => 0,
                                  getEnd: () => 1
                                }
                              });
                            break;
                        case(true): //close map
                        setTimeout(() => {
                            this.mapAnimating = true;
                            mapX1.setVisible(false);
                            mapX2.setVisible(false);
                            mapX3.setVisible(false);
                            mapX4.setVisible(false);
                            mapX5.setVisible(false);
                            mapX6.setVisible(false);
                            mapX7.setVisible(false);
                            mapX8.setVisible(false);
                            mapX9.setVisible(false);
                            mapX10.setVisible(false);
                            setTimeout(() => {
                                maprollLeft.setX(400);
                                maprollRight.setX(1500);
                                mapbase.setCrop(200, 0, 1300, mapbase.height);
                                map1.setCrop(200, 0, 1300, map1.height);
                                map2.setCrop(200, 0, 1300, map2.height);
                                map3.setCrop(200, 0, 1300, map3.height);
                                map4.setCrop(200, 0, 1300, map4.height);
                                setTimeout(() => {
                                    maprollLeft.setX(700);
                                    maprollRight.setX(1200);
                                    mapbase.setCrop(600, 0, 500, mapbase.height);
                                    map1.setCrop(600, 0, 500, map1.height);
                                    map2.setCrop(600, 0, 500, map2.height);
                                    map3.setCrop(600, 0, 500, map3.height);
                                    map4.setCrop(600, 0, 500, map4.height);
                                    setTimeout(() => {
                                        maprollLeft.setX(900);           
                                        maprollRight.setX(1000);           
                                        mapbase.setVisible(false);
                                        map1.setVisible(false);
                                        map2.setVisible(false);
                                        map3.setVisible(false);
                                        map4.setVisible(false);

                                        // fadeout effect
                                        this.add.tween({
                                            targets: [maprollLeft, maprollRight],
                                            ease: 'Sine.easeInOut',
                                            duration: 500,
                                            delay: 0,
                                            alpha: {                                
                                            getStart: () => 1,
                                            getEnd: () => 0
                                            },
                                            onComplete: () => {
                                                this.mapState = false;
                                                maprollLeft.setVisible(false);
                                                maprollRight.setVisible(false);
                                                this.mapAnimating = false;
                                                }
                                            });
                                    }, 250);
                                }, 250);
                            }, 250);
                        }, 250);
                        break;
                    }
                }
            });

            if(this.scene.isSleeping("world-scene")){
                badge.destroy();
                mapicon.destroy();
                controls.destroy();
            }
        }
    }
}