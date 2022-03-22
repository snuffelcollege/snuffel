/*  This file houses the custom type declarations required by webpack. */

declare module "*.svg" {
	const content: unknown;
	export default content;
}

declare module "*.gif" {
	const content: unknown;
	export default content;
}

declare module "*.css" {
	const styles: { [className: string]: string };
	export default styles;
}

declare module "*.png" {
	const value: string;
	export default value;
}

declare module "*.json" {
	const value: string;
	export default value;
}

declare module "*.mp3" {
	const value: string;
	export default value;
}

declare module "*.ogg" {
	const value: string;
	export default value;
}
