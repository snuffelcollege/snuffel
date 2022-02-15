/**
 * Use this to define depths for game objects. New layers may be added at any time provided it doesn't break
 * any of the existing code.
 */
const enum DepthLayers {
	BACKGROUND,
	DECOR,
	COLLISION,
	PLAYER,
	OVERLAY,
}

export default DepthLayers;
