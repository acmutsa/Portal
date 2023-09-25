## 0.7.5 (future)

- #27
  - A bunch of comments, reorganized imports, documentation, and TODO marks over a myriad of files.
  - Improved toasting logic in `/events/[id]` with proper types, better logical flow.
  - Lightly improved formatting of TOS page. Improved types.
  - Updated `prettier` to v3 (`prettier-plugin-tailwindcss` requires it). Reload VSCode if it breaks during yarn dependency install.
  - Updated `prisma` to 4.16.2, matching `prisma` & `@prisma/client` dependencies.
  - Disable `NewMemberView` page component (admin)
  - Fixed `OpenGraph` component array-key error, reworked transformation logic.
  - Removed a couple of unused dependencies (tested, no changes or usages anywhere).
  - Remove unused Tanstack Table components (`RowActions`, `VisibilityDropdown`) - very old & unused.