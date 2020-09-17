import { PopoverDisclosure, usePopoverState } from '@wp-g2/a11y';
import { connect } from '@wp-g2/context';
import { noop, useUpdateEffect } from '@wp-g2/utils';
import React from 'react';

import { PopoverContext } from './Popover.Context';
import PopoverContent from './PopoverContent';

function Popover({
	animated = true,
	animationDuration = 160,
	children,
	elevation = 5,
	forwardedRef,
	label,
	maxWidth = 360,
	modal = true,
	onVisibleChange = noop,
	placement,
	trigger,
	visible,
	...props
}) {
	const popover = usePopoverState({
		animated: animated ? animationDuration : undefined,
		modal,
		placement,
		visible,
		...props,
	});
	const uniqueId = `popover-${popover.baseId}`;
	const contextProps = {
		label: label || uniqueId,
		popover,
	};

	useUpdateEffect(() => {
		onVisibleChange(popover.visible);
	}, [popover.visible]);

	return (
		<PopoverContext.Provider value={contextProps}>
			{trigger && (
				<PopoverDisclosure
					{...popover}
					ref={trigger.ref}
					{...trigger.props}
				>
					{(triggerProps) =>
						React.cloneElement(trigger, triggerProps)
					}
				</PopoverDisclosure>
			)}
			<PopoverContent
				ref={forwardedRef}
				{...props}
				elevation={elevation}
				maxWidth={maxWidth}
			>
				{children}
			</PopoverContent>
		</PopoverContext.Provider>
	);
}

export default connect(Popover, 'Popover');
