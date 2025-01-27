import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

// 1. Define the variant styles with class-variance-authority (cva)
const typographyVariants = cva("", {
	variants: {
		variant: {
			h1: "scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl",
			h2: "scroll-m-20 text-3xl font-semibold tracking-tight",
			h3: "scroll-m-20 text-2xl font-semibold tracking-tight",
			h4: "scroll-m-20 text-xl font-semibold tracking-tight",
			// Add more heading sizes if you like (h5, h6, etc.)

			p: "leading-7 [&:not(:first-child)]:mt-6",
			lead: "text-xl text-muted-foreground",
			large: "text-lg font-semibold",
			small: "text-sm font-medium leading-none",
			subtle: "text-sm text-muted-foreground",
			// etc.
		},
	},
	defaultVariants: {
		variant: "p", // Default to paragraph styling
	},
});

// 2. Map each variant to an actual HTML tag
const variantTagMap = {
	h1: "h1",
	h2: "h2",
	h3: "h3",
	h4: "h4",
	p: "p",
	lead: "p",
	large: "p",
	small: "p",
	subtle: "p",
	// If you add more variants, map them to tags here
} as const;

export interface TypographyProps
	extends React.HTMLAttributes<HTMLHeadingElement | HTMLParagraphElement>,
		VariantProps<typeof typographyVariants> {}

// 3. Create the <Typography> component
export function Typography({
	variant,
	children,
	className,
	...props
}: TypographyProps) {
	// Use the variant to decide which HTML tag to render
	const Component = variantTagMap[variant ?? "p"] ?? "p";

	return (
		<Component
			className={cn(typographyVariants({ variant }), className)}
			{...props}
		>
			{children}
		</Component>
	);
}
