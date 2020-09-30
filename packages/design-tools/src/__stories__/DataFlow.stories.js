import {
	Badge,
	Button,
	Card,
	CardBody,
	Container,
	FormGroup,
	Grid,
	Heading,
	ListGroup,
	ListGroupHeader,
	Spacer,
	Surface,
	Text,
	TextInput,
	View,
	VStack,
} from '@wp-g2/components';
import { css, styled, ui } from '@wp-g2/styles';
import { createStore } from '@wp-g2/substate';
import { is, noop } from '@wp-g2/utils';
import React from 'react';
import * as yup from 'yup';

export default {
	title: 'DesignTools/DataFlow',
};

const dataStore = createStore((set) => ({
	height: 0,
	width: 0,
	x: 0,
	y: 0,
	z: 0,
}));

const AppContext = React.createContext({ dataStore });
const useAppContext = () => React.useContext(AppContext);

const useSubState = (fn) => {
	return React.useRef(createStore(fn)).current;
};

const TextControl = React.memo(
	({ onChange = noop, onUpdate = noop, validate, value: initialValue }) => {
		const textControl = useTextControl({
			onChange,
			validate,
			onUpdate,
			value: initialValue,
		});

		return (
			<TextInput {...textControl} autoComplete="off" spellCheck={false} />
		);
	},
);

function useTextControl({
	onBlur = noop,
	onChange = noop,
	validate,
	value: initialValue,
	onKeyDown = noop,
	onUpdate = noop,
}) {
	const store = useSubState((set) => ({
		value: initialValue,
		setValue: (next) => set({ value: next }),
	}));

	const { setValue, value } = store();
	const undoTimeoutRef = React.useRef();

	React.useEffect(() => {
		if (initialValue !== store.getState().value) {
			onUpdate(initialValue, store.getState().value);
			store.setState({ value: initialValue });
		}
	}, [initialValue, onUpdate, store]);

	React.useEffect(() => {
		return () => {
			if (undoTimeoutRef.current) {
				clearTimeout(undoTimeoutRef.curremt);
			}
		};
	}, []);

	const handleOnChange = React.useCallback(() => {
		const next = store.getState().value;
		if (next === initialValue) return;

		if (validate) {
			try {
				const regex = new RegExp(validate);

				if (is.function(validate)) {
					if (validate(next)) {
						onChange(next);
					} else {
						store.setState({ value: initialValue });
					}
					return;
				}

				if (regex.test(next)) {
					onChange(next);
				} else {
					store.setState({ value: initialValue });
				}
			} catch (err) {
				store.setState({ value: initialValue });
			}
		} else {
			onChange(next);
		}
	}, [initialValue, onChange, store, validate]);

	const handleOnKeyDown = React.useCallback(
		(event) => {
			// Enter press
			if (event.keyCode === 13) {
				event.preventDefault();
				handleOnChange();
			}
			// Undo press
			if (event.keyCode === 90 && (event.metaKey || event.ctrlKey)) {
				if (undoTimeoutRef.current) {
					clearTimeout(undoTimeoutRef.current);
				}
				event.persist();
				undoTimeoutRef.current = setTimeout(() => {
					onChange(event.target.value);
				}, 60);
			}

			onKeyDown(event);
		},
		[handleOnChange, onChange, onKeyDown],
	);

	const handleOnBlur = React.useCallback(
		(event) => {
			handleOnChange();
			onBlur(event);
		},
		[handleOnChange, onBlur],
	);

	return {
		onBlur: handleOnBlur,
		onKeyDown: handleOnKeyDown,
		onChange: setValue,
		value,
	};
}

const RenderedValues = () => {
	const { dataStore } = useAppContext();
	const data = dataStore();

	return (
		<View>
			<pre style={{ margin: 0 }}>
				<code>{JSON.stringify(data, null, 2)}</code>
			</pre>
		</View>
	);
};

const useDataStoreValue = ({ prop }) => {
	const { dataStore } = useAppContext();
	const value = dataStore(React.useCallback((state) => state[prop], [prop]));

	return [value, dataStore];
};

const DataControl = React.memo(
	({ label = 'Label', prop, validate, onUpdate = noop }) => {
		const [value, dataStore] = useDataStoreValue({ prop });

		const handleOnChange = React.useCallback(
			(next) => {
				dataStore.setState({ [prop]: next });
			},
			[dataStore, prop],
		);

		return (
			<FormGroup label={label}>
				<Grid templateColumns="1fr auto">
					<TextControl
						onChange={handleOnChange}
						onUpdate={onUpdate}
						validate={validate}
						value={value}
					/>
				</Grid>
			</FormGroup>
		);
	},
);

const ChangeNotification = React.memo(({ store }) => {
	const { count, visible } = store();
	const timeoutRef = React.useRef();

	React.useEffect(() => {
		if (count) {
			if (timeoutRef.current) {
				clearTimeout(timeoutRef.current);
			}
			timeoutRef.current = setTimeout(() => {
				store.setState({ visible: false });
			}, 600);
		}
		return () => {
			if (timeoutRef.current) {
				clearTimeout(timeoutRef.current);
			}
		};
	}, [count, store]);

	return (
		<Badge
			color="green"
			css={[
				ui.opacity(visible ? 1 : 0),
				ui.animation.default,
				{ maxWidth: '100%' },
			]}
		>
			Incoming Change
		</Badge>
	);
});

const useChangeStore = () => {
	return useSubState((set) => ({
		count: 0,
		visible: false,
		increment: () => {
			set((state) => ({ count: state.count + 1, visible: true }));
		},
	}));
};

const DataStoreLayer = React.memo(() => {
	const store = useChangeStore();
	const increment = store(React.useCallback((state) => state.increment, []));

	return (
		<VStack>
			<ChangeNotification store={store} />
			<Card>
				<CardBody>
					<ListGroup>
						<ListGroupHeader>Data Store (WP Data)</ListGroupHeader>
						<DataControl
							label="Height"
							onUpdate={increment}
							prop="height"
							validate={/^[0-9]*$/gi}
						/>
						<DataControl
							label="Width"
							onUpdate={increment}
							prop="width"
							validate={/^[0-9]*$/gi}
						/>
						<DataControl
							label="X"
							onUpdate={increment}
							prop="x"
							validate={/^[0-9]*$/gi}
						/>
						<DataControl
							label="Y"
							onUpdate={increment}
							prop="y"
							validate={/^[0-9]*$/gi}
						/>
						<DataControl
							label="Z"
							onUpdate={increment}
							prop="z"
							validate={/^[0-9]*$/gi}
						/>
					</ListGroup>
				</CardBody>
			</Card>
		</VStack>
	);
});

const ControlsLayer = React.memo(() => {
	const store = useChangeStore();
	const increment = store(React.useCallback((state) => state.increment, []));

	return (
		<VStack>
			<ChangeNotification store={store} />
			<Card>
				<CardBody>
					<ListGroup>
						<ListGroupHeader>
							Controls (Editor Controls)
						</ListGroupHeader>
						<DataControl
							label="Height"
							onUpdate={increment}
							prop="height"
							validate={/^[0-9]*$/gi}
						/>
						<DataControl
							label="Width"
							onUpdate={increment}
							prop="width"
							validate={/^[0-9]*$/gi}
						/>
						<DataControl
							label="X"
							onUpdate={increment}
							prop="x"
							validate={/^[0-9]*$/gi}
						/>
						<DataControl
							label="Y"
							onUpdate={increment}
							prop="y"
							validate={/^[0-9]*$/gi}
						/>
						<DataControl
							label="Z"
							onUpdate={increment}
							prop="z"
							validate={/^[0-9]*$/gi}
						/>
					</ListGroup>
				</CardBody>
			</Card>
		</VStack>
	);
});

const RenderedLayer = React.memo(() => {
	const { dataStore } = useAppContext();
	const store = useChangeStore();

	React.useEffect(() => {
		const unsub = dataStore.subscribe(store.getState().increment);

		return unsub;
	}, [dataStore, store]);

	return (
		<VStack>
			<ChangeNotification store={store} />
			<Card>
				<CardBody>
					<ListGroup>
						<ListGroupHeader>Rendered (Attributes)</ListGroupHeader>
						<RenderedValues />
					</ListGroup>
				</CardBody>
			</Card>
		</VStack>
	);
});

const Example = () => {
	return (
		<Grid columns={3}>
			<View>
				<DataStoreLayer />
			</View>
			<View>
				<ControlsLayer />
			</View>
			<View>
				<RenderedLayer />
			</View>
		</Grid>
	);
};

export const _default = () => {
	return (
		<AppContext.Provider value={{ dataStore }}>
			<Container>
				<Spacer mb={8} py={4}>
					<VStack>
						<Heading>Data Synchronization + Rendering</Heading>
						<Text>
							This example demonstrates the flow of data within
							the Editor.
						</Text>
						<Text>
							Data flows in multiple directions between the Data
							Store and Controls layer.
						</Text>
						<Text>
							The rendered layer only accepts incoming data only.
						</Text>
					</VStack>
				</Spacer>
				<Example />
			</Container>
		</AppContext.Provider>
	);
};