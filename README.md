# Wolves and Rabbits
This project produces a virtual environment consisting of a grid populated by  
tiles representing the ground, trees, wolves, and rabbits. Upon user adjustment  
of starting parameters, starting the simulation will begin the hunt!  
  
**Link to project:** https://bluevelocity.github.io/wolves-and-rabbits/  
  
## How It's Made:  
  
**Tech used:** HTML, CSS, & JavaScript
  
The HTML was quickly generated using emmet and represents the least amount of  
work on this project. Within the body, an empty div is generated in the DOM  
where the simulation will be targeted by, and ran, by JavaScript. Following  
the grid div is a series of buttons and sliders to provide interactivity to  
the user. Sliders were used in preference to text or number input as the  
limiting values are more clearly illustrated and easily enforced.  

The CSS incorporates responsize web design. It is coded using a mix of grid  
and flex displays with grid being used predominantly for site layout and  
flex being used to center information and make it responsive within the grid  
between the assigned gutters. A Meyer's CSS reset has been applied to ensure  
consistent interaction between elements. Through the @font-face API, the  
'Roboto' font-styling has been oaded into the webpage.

The JavaScript portion of this project dictates the logic for the generation  
of the simulation field, running the simulation, and interaction between the  
user-agent and the application. The JavaScript starts out by declaring the  
variables to capture the DOM elements to be used throughout the project.  
Objects containing the variables representing user options and data storage  
are then instantiated. These values will update dynamically as the user-agent  
manpulates data defining the simulation. The board is constructed to the  
predefined variables and control is then handed to the user-agent.

When the sliders and buttons are manipulated, the board size updates as each  
value is updated. Three values can be manipulated: the quantity of trees,  
the quantity of "wolves", and the quantity of "rabbits", the limits of each  
being defined as a ratio of board size, this is to prevent crashing and  
visual clutter. The program can only be run if there are both "wolf" and  
"rabbit" objects represented within the simulation. Randomizing the animals  
will instantiate "wolf" or "rabbit" objects using the "Wolf" and "Rabbit"  
constructors respectively, inheriting functions and properties through  
prototypal inheritence from the "Animal" prototype. Upon running the  
simulation the controls will be disabled until all "rabbits" are eaten.  
  
The program runs through an asyncronous clock running at 500ms intervals.  
When each clock cycle is run, the positions of the "wolves" are updated  
based on a simpified version of the A* pathfinding algorithm. The algorithm  
will check the validity of movement for the evaluated "wolf" in the surrounding  
grid spaces, excluding tiles inhabited by another "wolf", "tree" tiles, and  
previously calculated tiles, then assign a value as the sum of the distance  
from the original starting position and a heuristic. The "wolf" objects  
position, along with supporting values, will then update to be the position  
with the lowest calculated value. Upon reaching a position where no moves  
are possible, the "wolf" objects starting position values and previously  
calculated position values are reset in order to prevent the "wolf" from  
getting stuck. This repeats until there are no more "rabbits" in the  
"rabbitData.rabbits" array. Upon completion of the simulation the user-agent  
controls are re-enabled.
  
## Optimizations

Currently there are no performance issues that can be seen on modern machines,  
though this is artificially limited by the limit set on the maximum grid size.  
during testing allowing too many "wolves" or allowing the grid size to get  
too large posed a significant drag on performance.  
  
Optimizations can be made to the A* algorithm to calculate the optimal path  
prior to animal movement, though this was avoided as the more dynamic nature  
of the implemented solution allows for real time simulation with analysis  
of other tile states in real time. Though, this solution could be explored to  
reduce the usage of client side resources needed to update the DO through every  
clock cycle.  
  
Optimizations to how the DOM is updated could also be implemented by selecting  
and updating only the tiles inhabited by the wolves and the adjacent tile that  
will be inhabited. This could be accomplished by assigning id values to each  
"tile" corresponding the animals next move with said tile in the DOM, only  
updating the required tile.  
  
Further optimization for code readability could also occur by restructuring  
the code into distinct handlers of the updating the DOM, animal creation, and  
animal movement.  
  
## Lessons Learned:  
  
Setting out on this project, the initial purpose was to cement the concept of  
prototypal inheritence, though the scope of the project overeached that goal. 
Instead, the project cemented a number of previously learned ideas along  
with some new lessons in algorithms (A*) and code stucture.  