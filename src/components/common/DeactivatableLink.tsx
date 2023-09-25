import { FunctionComponent } from "react";
import Link, { LinkProps } from "next/link";
import { classNames } from "@/utils/helpers";

export type DeactivatableLinkProps = {
	disabled?: boolean;
};

/**
 * A link that can be disabled. This is required because Next.js does not support the 'disabled' attribute on Links by default.
 */
const DeactivatableLink: FunctionComponent<
	Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, keyof LinkProps> &
		LinkProps &
		DeactivatableLinkProps
> = ({disabled, ...props}) => {
    // Return an anchor tag without an href if the link is disabled.
	if (disabled) {
        const { className, href, ...otherProps } = props;
		return (
			<a
				aria-disabled={true}
				tabIndex={-1}
				// Is cursor: not-allowed or pointer-events: disabled better?
				className={classNames("select-none cursor-not-allowed", className)}
				{...otherProps}
			/>
		);
    }

	// For some reason, passing the `as` prop interferes with the `href` prop. It's extremely weird.
	// If you pass as="button" with href="/events/mginioa/check-in", the href will point to /events/button". It's extremely bizarre.
    // This isn't really relevant with how I've built this component, but it's worth noting.
	return <Link {...props} />;
};

export default DeactivatableLink;
