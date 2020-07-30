import { connect } from '@wp-g2/provider';
import React from 'react';
import { TabPanel as ReakitTabPanel } from 'reakit/Tab';

import * as styles from './Tabs.styles';
import { useTabsContext } from './Tabs.utils';
const { TabPanelView } = styles;

function TabPanel({ forwardedRef, ...props }) {
	const { tab } = useTabsContext();

	return (
		<ReakitTabPanel
			as={TabPanelView}
			ref={forwardedRef}
			{...tab}
			{...props}
		/>
	);
}

export default connect(TabPanel);