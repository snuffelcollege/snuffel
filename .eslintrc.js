module.exports = {
	env: {
		browser: true,
		es2021: true,
	},
	extends: [
		"airbnb-base",
		"airbnb-typescript/base",
		"plugin:@typescript-eslint/recommended",
		"plugin:@typescript-eslint/recommended-requiring-type-checking",
		"plugin:jest/style",
		"prettier",
	],
	parser: "@typescript-eslint/parser",
	parserOptions: {
		ecmaVersion: "browser",
		sourceType: "module",
		project: ["./tsconfig.json"],
	},
	plugins: ["@typescript-eslint", "eslint-plugin-tsdoc", "jest"],
	rules: {
		"no-lone-blocks": "off",
		"no-param-reassign": ["error", { props: false }],
		"class-methods-use-this": [
			"error",
			{ exceptMethods: ["update", "init", "create", "preload"] },
		],
	},
};
