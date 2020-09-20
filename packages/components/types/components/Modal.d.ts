import { PolymorphicComponent } from './_shared';
import { BaseModalProps } from './BaseModal';
import { CardHeaderProps, CardBodyProps, CardFooterProps } from './Card';

export declare type ModalProps = BaseModalProps & {};

/**
 * `Modal` is an overlay component that renders a focused dialog with content and actions.
 */
export declare const Modal: PolymorphicComponent<ModalProps>;

export declare type ModalTriggerProps = {
	/**
	 * When an element is disabled, it may still be focusable. It works similarly to readOnly on form elements.
	 * In this case, only aria-disabled will be set.
	 *
	 * @see https://reakit.io/docs/dialog/#usedialogstate
	 */
	focusable?: boolean;
};

/**
 * `ModalTrigger` is a component that toggles the open/close state of a `Modal`.
 *
 * @example
 * ```jsx
 * <Modal renderTrigger={<Button>Open Modal</Button>}>
 *   ...
 * </Modal>
 * ```
 */
export declare const ModalTrigger: PolymorphicComponent<
	ModalTriggerProps,
	'button'
>;

export declare type ModalHeaderProps = CardHeaderProps & {
	/**
	 * The (HTML) title of the `CloseButton` of `ModalHeader`.
	 *
	 * @default 'Close'
	 */
	closeLabel?: string;
	/**
	 * Determines if the `CloseButton` should render.
	 *
	 * @default true
	 */
	showCloseLabel?: boolean;
	/**
	 * The title of `ModalHeader`.
	 */
	title?: string;
};

/**
 * `ModalHeader` is a component that displays the header content and actions of a `Modal`.
 *
 * @example
 * ```jsx
 * <Modal renderTrigger={<Button>Open Modal</Button>}>
 *   <ModalHeader title="Hello" />
 *   ...
 * </Modal>
 * ```
 */
export declare const ModalHeader: PolymorphicComponent<ModalHeaderProps>;

export declare type ModalBodyProps = CardBodyProps & {};
/**
 * `ModalBody` is a component that displays the main contents a `Modal`.
 *
 * @example
 * ```jsx
 * <Modal renderTrigger={<Button>Open Modal</Button>}>
 *   <ModalHeader>...</ModalHeader>
 *   <ModalBody>...</ModalBody>
 *   <ModalFooter>...</ModalFooter>
 * </Modal>
 * ```
 */

export declare const ModalBody: PolymorphicComponent<ModalBodyProps>;

export declare type ModalFooterProps = CardFooterProps & {};

/**
 * `ModalFooter` is a component that displays the footer content and actions of a `Modal`.
 *
 * @example
 * ```jsx
 * <Modal renderTrigger={<Button>Open Modal</Button>}>
 *   ...
 *   <ModalFooter>
 *     <Button>Save Changes</Button>
 *   </ModalFooter>
 * </Modal>
 * ```
 */
export declare const ModalFooter: PolymorphicComponent<ModalFooterProps>;