import * as React from 'react';
import { ConnectedProps } from './_shared';
import { SurfaceProps, SurfaceVariant } from './Surface';

export declare type BackgroundProps = SurfaceProps & {
	/**
	 * @default 'secondary'
	 */
	variant?: SurfaceVariant;
};

/**
 * `Background` is a core component that renders a `Surface` with a secondary background color.
 */
export declare const Background: React.FC<BackgroundProps & ConnectedProps>;