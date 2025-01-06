# SGI 2024/2025 - TP3

## Group T04G07
| Name                                      | Number    | E-Mail             |
| ----------------------------------------- | --------- | ------------------ |
| João Brandão Alves                        | 202108670 | up202108670@up.pt  |
| José Francisco Reis Pedreiras Neves Veiga | 202108753 | up202108753@up.pt  |

----

## Project information

This project, **Hot Race!**, is a balloon race game, implemented as a 3D graphics application using [Three.js](https://threejs.org/). The 3D objects of the game are loaded in a hybrid approach, using both the **YASF** format implemented in [TP2](./tp2) and standard JavaScript files. The main features of the game are described below.

### Features

1. **YASF Integration**:
    - This format from TP2 was reused to load a good portion of the game's objects.
    - The parser was optimized in terms of code quality.

2. **GameStateManager**:
    - This singleton is essential to manage the *GameStates*, which are:
        - *INITIAL*: The Main Menu and MyInitialScene is displayed;
        - *RUNNING*: The game is running, MyRunningScene is displayed;
        - *FINAL*: The Final Menu and MyFinalScene is displayed.
    - Functions are implemented to handle the transition between states. When a new state is set, a callback is sent to MyContents, as explained below.

3. **MyContents**:
    - This singleton is created in main.js and is responsible for managing the game's contents, adding and removing objects from the scene.
    - It receives callbacks from the **GameStateManager**, and proceeds to clean the current objects and add a new Scene.
    - It creates the YASF parser with the respective scene file and, regarding the objects that are not in the YASF json, these are created in a MyScene class, as explained below.

4. **MyScene**:
    - This class is necessary due to the new requirements of the game, where the YASF format is not able to cover all the game's features.
    - This is a base class with some common functions and properties, like the App and GameStateManager references.
    - It is extended by 3 classes reflecting the 3 main states of the game:
        - **MyInitialScene**: The Main Menu objects are modeled here, involving some buttons and updatable text.
        - **MyRunningScene**: The game's running scene. Most of the game logic is implemented here, such as the balloon movement, collision detection, animations, shaders, etc. More details are provided below.
        - **MyFinalScene**: The Final Menu scene, where the player can restart the game with the same options or go back to the Main Menu.

5. **PickingManager**:
    - This singleton is responsible for handling the picking of objects in the Initial and Final Menu scenes.
    - Using the Raycaster, it detects the intersections between the mouse and objects, implementing hovering and clicking effects.
    - When a click occurs, a callback is sent to the respective running scene class, which handles the event.

6. **MyInitialScene**:
    - The game starts with a main menu scene, where the player can set the following options:
        - Player name;
        - The colors of the player's and opponent's balloons. The color of the opponent's balloon reflects its speed and difficulty of the game;
        - The number of laps, between 1 and 3;
        - The start point of the player's balloon, "A" or "B", which in turn determines the opponent's starting point and route;
        - A play button to start the game, which takes the player to the Running State scene.

7. **MyRunningScene**:
    - The gameplay starts here, showcasing all the requested features:
      - An outdoor display which starts counting the time right from the beginning. It also shows the current lap, air layer, and available vouchers. The status, either "Running" or "Paused", is also displayed;
    - Another outdoor display with a 3D mountain using a bas-relief shader. Around the track, there is a skybox and mountains all around, implemented with NURBS surfaces;
    - A balloons' park;
    - A MyReader object, which instantiates the objects necessary for the race, including the 2 balloons, the track, the opponent balloon's route, the obstacles and power-ups. The opponent's balloon follows along the route automatically, and the obstacles and power-ups are animated using shaders.

8. **MyFinalScene**:
    - A Final Menu scene is displayed, showing:
      - The winner's name and time;
      - The loser's name;
      - A "Rematch" button to restart the game with the same options;
      - A "Return to Main Menu" button to go back to the Main Menu;
      - Animated fireworks enlighten the scene.

9. **First Person Camera**:
    - By pressing the "C" key, the player can switch between the third person camera and the first person camera, which follows the player's balloon.
    - While in first person mode, the GUI is hidden and PointerLockControls are enabled, allowing the player to look around using the mouse.
    - Techniques were used to keep the camera smooth while accompanying the balloon's movement and ensure a smooth transition between cameras.

10. **Pausing the Game**:
    - By pressing the "space" key, the player can pause the game. The balloons stop moving, and the timer is paused. The animations of the obstacles and power-ups are also paused.
    - The player can resume the game by pressing the "space" key again.
    - Techniques were used to keep the timer and balloons' positions consistent after resuming the game.

11. **Shaders**:
---

## Screenshots

Below are some screenshots of the main implemented features:


---

## Issues/Problems

During the development of the project, the following issues were encountered:

1. **Tracking the player balloon's position**:
    - Problem: To implement the first person camera, its position needed to be updated every frame to follow the player's balloon. Functions such as balloon.position or balloon.group.position were not working, as the balloon was scaled.
    - Solution: Use the balloon.group.getWorldPosition() function to get the balloon's position in the world coordinates.

2. **Pausing the game**:
    - Problem: When pausing the game and then resuming it, the balloons would have a sudden jump in their positions, and the timer would go back to 0.
    - Solution: When pausing the game, we saved the total time passed by summing the app.clock.getElapsedTime(), and only then app.clock.stop(). To have smooth transitions when resuming the game, balloon.group.position.lerp() was used to interpolate the balloon's position. A time offset was also added to the delta time of the update functions in order to keep the balloons' positions consistent after resuming the game.
