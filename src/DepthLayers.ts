/**
 * Use this to define depths for game objects. New layers may be added at any time provided it doesn't break
 * any of the existing code.
 */
const enum DepthLayers {
	Water,
	Grass,	
	Concrete,	
	Fences,
	Road,
	Road_lines,	
	Collision_houses,
	Bushes,	
	Treeline_1,
	Treeline_2,	
	Treeline_3,
	Treeline_4,
	Treeline_5,	
	PLAYER,		
	Lanterns,
	Roofs
}

export default DepthLayers;
