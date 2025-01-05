import { PickingManager } from '../../PickingManager.js';
import { State } from '../State.js';

class InitialState extends State {
    constructor(app, gameStateManager, interactableObjects) {
        super(app, gameStateManager);
        this.interactableObjects = interactableObjects;

        this.pickingManager = null;

        this.playerBalloonColor = "Not chosen";
        this.opponentBalloonColor = "Not chosen";
        this.playerNameString = "Not chosen";

        this.isTypingName = false;

        this.laps = 1;
        this.startPoint = "A";
    }

    init() {
        this.buildMainMenu();
        this.pickingManager = new PickingManager(this.app.activeCamera, this.handleSelection.bind(this));
        this.interactableObjects.forEach(obj => { this.pickingManager.addInteractableObject(obj); });

        window.addEventListener('keydown', (event) => {
            if (this.isTypingName) {

                if (event.key === 'Backspace') {
                    this.playerNameString = this.playerNameString.slice(0, -1);
                } 
                
                else if (event.key === 'Enter') {
                    this.isTypingName = false;

                    if (this.playerNameString.trim() === "") {
                        this.playerNameString = "Not chosen";
                    }
                }
                
                else if (event.key.length === 1) {
                    this.playerNameString += event.key;
                }

                this.updateTextMesh(this.playerName, this.playerNameString, 0xb0b0b0);
            }
        });
    }

    buildMainMenu() {

        this.playRaceText = this.createTextMesh("Play Hot Race!", 24, 7.5, -7.5, 0xffff00);
        this.playRaceText.scale.set(2, 2, 2);
        this.playRaceText.rotation.y = Math.PI / 2;
        this.addObject(this.playRaceText, true);
        
        this.topMesh2 = this.createTextMesh("Player Balloon: ", 24.7, 4.5, -21.5, 0xb0b0b0); 
        this.topMesh2.scale.set(1.8, 1.8, 1.8);
        this.topMesh2.rotation.y = Math.PI / 2;
        this.addObject(this.topMesh2);
    
        this.topMesh3 = this.createTextMesh("Opponent Balloon: ", 24.7, 2, -21.5, 0xb0b0b0);
        this.topMesh3.scale.set(1.8, 1.8, 1.8);
        this.topMesh3.rotation.y = Math.PI / 2;
        this.addObject(this.topMesh3);
    
        this.playerBalloon = this.createTextMesh(this.playerBalloonColor, 24.7, 4.5, 6, 0xb0b0b0);
        this.playerBalloon.name = 'playerBalloon';
        this.playerBalloon.scale.set(1.8, 1.8, 1.8);
        this.playerBalloon.rotation.y = Math.PI / 2;
        this.addObject(this.playerBalloon, true);
    
        this.opponentBalloon = this.createTextMesh(this.opponentBalloonColor, 24.7, 2, 6, 0xb0b0b0); 
        this.opponentBalloon.name = 'opponentBalloon';
        this.opponentBalloon.scale.set(1.8, 1.8, 1.8);
        this.opponentBalloon.rotation.y = Math.PI / 2;
        this.addObject(this.opponentBalloon, true);

        this.lapsMesh = this.createTextMesh("Laps:", 24.7, 0, -21.5, 0xb0b0b0);
        this.lapsMesh.scale.set(1.8, 1.8, 1.8);
        this.lapsMesh.rotation.y = Math.PI / 2;
        this.addObject(this.lapsMesh);

        this.selectLaps = this.createTextMesh("1", 24.7, 0, 6, 0xb0b0b0);
        this.selectLaps.name = 'laps';
        this.selectLaps.scale.set(1.8, 1.8, 1.8);
        this.selectLaps.rotation.y = Math.PI / 2;
        this.addObject(this.selectLaps, true);

        this.startPointMesh = this.createTextMesh("Start Point:", 24.7, -2, -21.5, 0xb0b0b0);
        this.startPointMesh.scale.set(1.8, 1.8, 1.8);
        this.startPointMesh.rotation.y = Math.PI / 2;
        this.addObject(this.startPointMesh);

        this.selectStartPoint = this.createTextMesh(this.startPoint, 24.7, -2, 6, 0xb0b0b0);
        this.selectStartPoint.name = 'startPoint';
        this.selectStartPoint.scale.set(1.8, 1.8, 1.8);
        this.selectStartPoint.rotation.y = Math.PI / 2;
        this.addObject(this.selectStartPoint, true);
    
        this.gameMesh = this.createTextMesh("Game made by:", 24.7, -4, -6.5, 0xffffe0); 
        this.gameMesh.scale.set(1.5, 1.5, 1.5);
        this.gameMesh.rotation.y = Math.PI / 2;
        this.addObject(this.gameMesh);
    
        this.gameMesh2 = this.createTextMesh("João Alves & José Francisco Veiga", 24.7, -6, -14, 0xffffe0); 
        this.gameMesh2.scale.set(1.5, 1.5, 1.5);
        this.gameMesh2.rotation.y = Math.PI / 2;
        this.addObject(this.gameMesh2);

        this.playerNameMesh = this.createTextMesh("Player Name: ", -18.5, -9.9, -12, 0x000000); 
        this.playerNameMesh.scale.set(1.8, 1.8, 1.8);
        this.playerNameMesh.rotation.x = - Math.PI / 2;
        this.playerNameMesh.rotation.z = - Math.PI / 2;
        this.addObject(this.playerNameMesh);

        this.playerName = this.createTextMesh(this.playerNameString, -18.5, -9.9, 2, 0xb0b0b0); 
        this.playerName.name = 'playerName';
        this.playerName.scale.set(1.8, 1.8, 1.8);
        this.playerName.rotation.x = - Math.PI / 2;
        this.playerName.rotation.z = - Math.PI / 2;
        this.addObject(this.playerName, true);
    }

    handleSelection(clickedObject, color) {
        this.colorHex = null;

        if(color === 'pink') {
            this.colorHex = 0xffb5c2;
        } else if(color === 'blue') {
            this.colorHex = 0x87cfff;
        } else if(color === 'orange') {
            this.colorHex = 0xff8000;
        } else if(color === 'green') {
            this.colorHex = 0x00cc00;
        }

        if (clickedObject === 'playerBalloon') {
            this.playerBalloonColor = color;
            this.updateTextMesh(this.playerBalloon, color, this.colorHex);
        } 

        else if (clickedObject === 'opponentBalloon') {
            this.opponentBalloonColor = color;
            this.updateTextMesh(this.opponentBalloon, color, this.colorHex);
        }

        else if (clickedObject === 'laps') {
            this.laps = (this.laps % 3) + 1;
            this.updateTextMesh(this.selectLaps, this.laps.toString(), 0xb0b0b0);
        }

        else if (clickedObject === "startPoint") {
            this.startPoint = this.startPoint === "A" ? "B" : "A";
            this.updateTextMesh(this.selectStartPoint, this.startPoint, 0xb0b0b0);
        }

        else if (clickedObject === 'playButton') {
            if (this.playerBalloonColor === "Not chosen" || this.opponentBalloonColor === "Not chosen" || this.playerNameString === "Not chosen") {
                console.warn('Please select both balloons and a player name before starting the game.');
            }

            else this.gameStateManager.startGame(this.playerBalloonColor, this.opponentBalloonColor, this.laps);
        }

        else if (clickedObject === 'playerName') {

            this.isTypingName = true;
            this.playerNameString = "";
            this.updateTextMesh(this.playerName, this.playerNameString, 0xb0b0b0);
        }
    }
}

export { InitialState };
