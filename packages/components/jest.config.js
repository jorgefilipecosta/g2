const { join } = require('path');
const { projects, ...baseConfig } = require('../../jest.config');
const pkg = require('./package.json');

module.exports = {
	...baseConfig,
	displayName: pkg.name,
	testMatch: [join(__dirname, 'src/**/__tests__/*.{js,ts,tsx}')],
	snapshotSerializers: ['@emotion/jest/serializer'],
};
