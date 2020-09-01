import * as compiler from '../compiler';
import { createCoreElement } from './createCoreElement';
import { createCoreElements } from './createCoreElements';
import { createStyledComponents } from './createStyledComponents';
import { generateTheme } from './generateTheme';
import { DEFAULT_STYLE_SYSTEM_OPTIONS, get } from './utils';

const defaultOptions = DEFAULT_STYLE_SYSTEM_OPTIONS;

/**
 * @typedef CreateStyleSystemOptions
 * @property {object} baseStyles Base styles for the Style system.
 * @property {object} config Default variables for the Style system.
 * @property {object} darkModeConfig Dark mode variables for the Style system.
 * @property {object} highContrastModeConfig High contrast mode variables for the Style system.
 * @property {object} darkHighContrastModeConfig Dark high contrast variables for the Style system.
 */

/**
 * @typedef CreateStyleSystemObjects
 * @property {object} core A set of coreElements.
 * @property {object} compiler The Style system compiler (a custom Emotion instance).
 * @property {function} createCoreElement A function to create a coreElement (with settings from the Style system).
 * @property {function} css A function to compile CSS styles.
 * @property {function} cx A function to resolve + combine classNames.
 * @property {function} get The primary function to retrieve Style system variables.
 * @property {object} styled A set of styled components.
 * @property {React.Component} View The base <View /> component.
 */

/**
 * Creates a Style system using a set of baseStyles and configs.
 *
 * @example
 * ```js
 * const baseStyles = { background: 'blue' };
 * const blueStyleSystem = createStyleSystem({ baseStyles });
 * ```
 *
 * @param {CreateStyleSystemOptions} options Options to create a Style system with.
 * @returns {CreateStyleSystemObjects} A collection of functions and elements from the generated Style system.
 */
export function createStyleSystem(options = defaultOptions) {
	const {
		baseStyles,
		config,
		darkHighContrastModeConfig,
		darkModeConfig,
		highContrastModeConfig,
	} = {
		...defaultOptions,
		...options,
	};

	const globalStyles = generateTheme({
		config,
		darkHighContrastModeConfig,
		darkModeConfig,
		highContrastModeConfig,
	});

	/**
	 * Core elements.
	 *
	 * @example
	 * ```jsx
	 * <core.div />
	 * ```
	 */
	const core = createCoreElements({ baseStyles, globalStyles });

	/**
	 * Styled components.
	 *
	 * @example
	 * ```jsx
	 * const StyledDiv = styled.div``
	 *
	 * <StyledDiv />
	 * ```
	 */
	const styled = createStyledComponents({ compiler, core });

	/**
	 * Export prebound createCoreElement factory.
	 */
	const _createCoreElement = (tagName) =>
		createCoreElement(tagName, { baseStyles, globalStyles });

	const View = core.div;

	const { css, cx } = compiler;

	return {
		compiler,
		core,
		createCoreElement: _createCoreElement,
		css,
		cx,
		get,
		styled,
		View,
	};
}

export default createStyleSystem;