/**
 * Use this to define depths for game objects. New layers may be added at any time provided it doesn't break
 * any of the existing code.
 */
const enum DepthLayers {
	Water,
	Grass,	
	Concrete_dirt,	
	Fences,
	Road,
	Road_lines,	
	Collision_houses,
	Flowers,
	Treeline_1,
	Treeline_2,	
	Treeline_3,
	Treeline_4,
	Flowers_bushes,	
	PLAYER,		
	Lanterns,
	Roofs
}

export default DepthLayers;
