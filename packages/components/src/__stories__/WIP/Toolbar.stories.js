import {
	Menu,
	MenuButton,
	MenuItem,
	MenuSeparator,
	Toolbar as ReakitToolbar,
	ToolbarItem as ReakitToolbarItem,
	useMenuState,
	useToolbarState,
} from '@wp-g2/a11y';
import * as IconSet from '@wp-g2/icons';
import { get, styled } from '@wp-g2/styles';
import { is } from '@wp-g2/utils';
import React from 'react';

import { Icon, Tooltip, TooltipContent, TooltipTrigger } from '../../index';

export default {
	title: 'Examples/WIP/Toolbar',
};

const ToolbarContext = React.createContext({});
const useToolbarContext = () => React.useContext(ToolbarContext);

const ToolbarView = styled.div`
	background: ${get('surfaceColor')};
	border: 1px solid ${get('colorText')};
	border-radius: 2px;
	display: inline-flex;
	padding: 0;
`;

const ToolbarButtonView = styled.button`
	align-items: center;
	appearance: none;
	background: ${get('surfaceColor')};
	border: none;
	color: ${get('colorText')};
	cursor: pointer;
	display: flex;
	height: 48px;
	justify-content: center;
	min-width: 36px;
	outline: none;
	padding: 6px;
	position: relative;

	&:first-of-type {
    border-bottom-left-radius: 3px;
    border-top-left-radius: 3px;
    min-width: 42px;
		padding-left: 12px;
	}

  &:last-of-type {
    border-bottom-right-radius: 3px;
    border-top-right-radius: 3px;
		min-width: 42px;
    padding-right: 12px;
	}

  &:first-of-type::last-of-type {
		min-width: 42px;
    padding-left: 12px;
	  padding-right: 12px;
	}

  &:hover {
    color: ${get('colorAdmin')};
  }

	&::before {
		border-radius: 2px;
		content: '';
		height: 30px;
		left: 0;
		pointer-events: none;
		position: absolute;
		top: 50%;
		transform: translate(3px, -50%);
		width: calc(100% - 6px);
	}

	&:first-of-type {
    &::before {
      transform: translate(10px, -50%);
		  width: calc(100% - 14px);
    }
  }

  &:last-of-type {
    &::before {
      transform: translate(4px, -50%);
		  width: calc(100% - 14px);
    }
  }

  &:first-of-type:last-of-type {
    &::before {
      transform: translate(8px, -50%);
		  width: calc(100% - 16px);
    }
  }

	&:focus {
		/* color: ${get('colorTextInverted')};

		&::before {
			background: black;
		} */
    &::before {
      box-shadow: 0 0 0 2px ${get('colorAdmin')};
    }
	}
`;

const ToolbarGroupView = styled.div`
	border-right: 1px solid ${get('colorText')};
	display: flex;

	&:last-of-type {
		border-right: none;
	}
`;

const ToolbarButtonContentView = styled.span`
	position: relative;
	z-index: 1;
`;

const ToolbarDropdownView = styled.div`
	background: ${get('surfaceColor')};
	border: 1px solid ${get('colorText')};
	border-radius: 2px;
	min-width: 200px;
	outline: none;
	padding: 8px;
`;

const ToolbarDropdownItemView = styled.button`
	appearance: none;
	background: none;
	border: none;
	border-radius: 2px;
	color: ${get('colorText')};
	cursor: pointer;
	display: block;
	outline: none;
	padding: 8px 16px;
	text-align: left;
	width: 100%;

	&:hover {
		color: ${get('colorAdmin')};
	}

	&:focus {
		box-shadow: 0 0 0 2px ${get('colorAdmin')};
	}
`;

const ToolbarSeparatorView = styled.div`
	border-top: 1px solid ${get('colorText')};
	margin: 8px -8px;
`;

const MoreItems = React.forwardRef((props, ref) => {
	const menu = useMenuState({
		placement: 'bottom-start',
		gutter: 4,
		loop: true,
	});
	return (
		<>
			<Tooltip>
				<TooltipTrigger>
					<MenuButton
						{...menu}
						{...props}
						aria-label="More items"
						as={BaseToolbarItem}
						icon={<IconSet.FiMoreVertical />}
						ref={ref}
					/>
				</TooltipTrigger>
				<TooltipContent>More options</TooltipContent>
			</Tooltip>

			<Menu {...menu} aria-label="More items" as={ToolbarDropdownView}>
				<MenuItem {...menu} as={ToolbarDropdownItemView}>
					Show Block Settings
				</MenuItem>
				<MenuItem {...menu} as={ToolbarDropdownItemView}>
					Copy
				</MenuItem>
				<MenuItem {...menu} as={ToolbarDropdownItemView}>
					Duplicate
				</MenuItem>
				<MenuItem {...menu} as={ToolbarDropdownItemView}>
					Insert Before
				</MenuItem>
				<MenuItem {...menu} as={ToolbarDropdownItemView}>
					Insert After
				</MenuItem>
				<MenuItem {...menu} as={ToolbarDropdownItemView}>
					Move To
				</MenuItem>
				<MenuItem {...menu} as={ToolbarDropdownItemView}>
					Edit as HTML
				</MenuItem>
				<MenuSeparator {...menu} as={ToolbarSeparatorView} />
				<MenuItem {...menu} as={ToolbarDropdownItemView}>
					Group
				</MenuItem>
				<MenuSeparator {...menu} as={ToolbarSeparatorView} />
				<MenuItem {...menu} as={ToolbarDropdownItemView}>
					Remove Block
				</MenuItem>
			</Menu>
		</>
	);
});

function iconStringToToolbarComponents(icons) {
	return (items, mapIndex) => {
		if (!is.array(items)) return null;

		return (
			<ToolbarGroup key={mapIndex}>
				{items.map((icon, index) => {
					const ToolbarIcon = icons[icon];
					if (!ToolbarIcon) return null;
					return <ToolbarItem icon={<ToolbarIcon />} key={index} />;
				})}
			</ToolbarGroup>
		);
	};
}

const templateToIconString = (item) => {
	if (is.string(item)) {
		const next = item.replace(/ /g, '');
		return `Fi${next}`;
	}

	if (is.array(item)) return item.map(templateToIconString).filter(Boolean);

	return undefined;
};

function generateToolbarComponentsFromTemplate(template, icons) {
	if (!is.string(template)) return null;

	const items = template
		.split('|')
		.map((chunk) => chunk.split('-'))
		.map(templateToIconString)
		.map(iconStringToToolbarComponents(icons));

	return items;
}

function Toolbar({ children, icons = {}, template }) {
	const toolbar = useToolbarState({ loop: true });
	const iconSet = { ...IconSet, ...icons };

	const content = template
		? generateToolbarComponentsFromTemplate(template, iconSet)
		: null;

	return (
		<ToolbarContext.Provider value={{ toolbar }}>
			<ReakitToolbar
				{...toolbar}
				aria-label="My toolbar"
				as={ToolbarView}
			>
				{content}
				{children}
			</ReakitToolbar>
		</ToolbarContext.Provider>
	);
}

const BaseToolbarItem = React.forwardRef(({ icon, ...props }, ref) => {
	return (
		<ToolbarButtonView ref={ref} {...props}>
			<ToolbarButtonContentView>
				<Icon icon={icon} />
			</ToolbarButtonContentView>
		</ToolbarButtonView>
	);
});

const ToolbarItem = React.forwardRef(({ icon }, ref) => {
	const { toolbar } = useToolbarContext();

	return (
		<ReakitToolbarItem
			{...toolbar}
			as={BaseToolbarItem}
			icon={icon}
			ref={ref}
		/>
	);
});

function ToolbarGroup({ children }) {
	return <ToolbarGroupView>{children}</ToolbarGroupView>;
}

function MoreExample() {
	const { toolbar } = useToolbarContext();
	return <ReakitToolbarItem {...toolbar} as={MoreItems} />;
}

function Example() {
	return (
		<Toolbar template="Activity | AlignLeft - AlignCenter - AlignRight | Bell">
			<ToolbarGroup>
				<ToolbarItem icon={<IconSet.FiArrowUp />} />
			</ToolbarGroup>
			<MoreExample />
		</Toolbar>
	);
}

export const _default = () => <Example />;
