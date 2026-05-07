# AttendX Engineering Guidelines

## General Engineering Rules
- Keep files focused: target under 200 lines for route files and under 120 lines for UI components when possible.
- Prefer extracting reusable UI blocks and typed data objects over duplicating markup/classes.
- Build mobile-first and scale up with breakpoints (`sm`, `md`, `lg`, `xl`).
- Avoid one-off style hacks; use layout primitives (`flex`, `grid`, `gap`, `max-w`) and semantic spacing.
- Preserve accessibility: keyboard support, `aria-*` attributes on interactive controls, and sufficient contrast.

## Theming and Tokens
- Use `theme.css` as the source of truth for design tokens.
- Use semantic Tailwind tokens (`bg-background`, `text-foreground`, `border-border`, `text-muted-foreground`, `bg-primary`) instead of hardcoded colors.
- Only introduce project-specific CSS variables in `app/globals.css` when semantic tokens cannot express the requirement.
- Keep light/dark behavior token-driven; do not hardcode mode-specific class lists in components.

## shadcn and Component Usage
- Prefer shadcn components (`Button`, `Card`, etc.) before custom primitives.
- Wrap repeated action groups into reusable components (example: nav actions).
- Keep component props typed and minimal; expose behavior through props rather than duplicating components.

## Responsive UX Standards
- Navigation must support both desktop and mobile (hamburger + collapsible menu for small screens).
- Primary CTAs are full-width on small screens and auto-width on larger screens unless product requirements differ.
- Prevent text overflow at narrow widths using sensible `max-w`, `clamp`, and line-height values.
- Validate key breakpoints during implementation: `320`, `375`, `390`, `768`, `1024`, `1280`, `1440`.

## Motion and Interaction
- Use subtle motion only where it improves clarity (entrance, hover affordance).
- Respect reduced motion preferences (`useReducedMotion`).
- Keep transitions short and consistent (generally 150-350ms).
