# Responsive Design Rules

## Button Layouts
- **Side-by-Side Buttons**: If two buttons are displayed side-by-side in the application, they must remain side-by-side in a single row on mobile/smaller screen sizes rather than stacking vertically.
  - **No Text Wrapping (Nowrap)**: Side-by-side buttons must use the `whitespace-nowrap` class to ensure button text does not wrap or collapse onto multiple lines.
  - **Responsive Sizing**: Side-by-side buttons on mobile must scale down slightly to prevent overflow (e.g., using `px-5 py-3 text-base` on mobile and scaling up to `sm:px-8 sm:py-4 sm:text-lg` on larger viewports).
  - **Responsive Gaps**: The flex containers housing side-by-side buttons should use tighter gaps on mobile (e.g., `gap-2.5 sm:gap-4`) to maximize available horizontal space.

## Layout Padding
- **Mobile Page Padding**: Page containers and layouts must have exactly 16px (`px-4`) of padding on the left and right edges on mobile viewport sizes to ensure content matches standard spacing, is not cut off, and aligns cleanly.

## Responsive Dropdowns & Inputs
- **Side-by-Side Dropdowns (Filters)**: When displaying multiple custom dropdowns (Select triggers) and buttons horizontally on a single row (such as page filter bars), use responsive widths rather than hardcoded fixed sizes to prevent viewport clipping and horizontal overflow scrollbars.
  - **Fluid Sizing**: Use Tailwind classes like `flex-1 md:w-[140px] md:flex-none` on select triggers, letting the controls scale down proportionally on small viewports while maintaining their desktop widths.
  - **Flex Shrink**: Apply `flex-shrink-0` to adjacent buttons (e.g., "Clear Filters" or search actions) so they don't squash.

## Responsive Card & Empty State Padding
- **Viewport-Aware Padding**: Avoid large static padding values (e.g. `p-12` or `p-16`) on components like cards or empty states. Use responsive spacing (e.g. `p-6 sm:p-12`) to optimize text width and prevent layout clipping on mobile viewports.

## Viewport Contraction & Overflow Prevention
- **Flexbox Wrapper Constraints**: Main flex items (like `.dash-main`) must carry `max-width: 100%` and `min-width: 0` on mobile viewports to prevent them from expanding past the viewport boundary when holding wide children. This forces text to wrap and flex items to shrink correctly.
- **Header Search & Input Placeholders**: Text inputs (`<input>`) can prevent flex parent containers from shrinking below the length of their placeholder string.
  - **Short Mobile Placeholders**: Keep input placeholders short (e.g. `"Search..."`) on mobile to allow inputs to contract.
  - **Wrapper Width Constraints**: Enforce a `max-width` on the search wrapper (e.g. `max-width: 160px`) and `min-width: 0` directly on the input element.
- **Chart Wrapping**: Flex containers holding side-by-side charts and legends (e.g. donut charts) must wrap (using `flex-wrap: wrap`) on small viewports to prevent clipping.
