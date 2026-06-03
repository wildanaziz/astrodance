# src/layouts/ — Global Layout

The layout shell that wraps every page.

## `Layout.astro`

The root layout component providing the global HTML structure for all pages.

### Structure

```
<html>
  <head>
    └── CSS custom properties (design tokens)
    └── Global styles (buttons, cards, modals, tables, forms, badges, nav, animations)
    └── Google Fonts (DM Serif Display + Plus Jakarta Sans)
  <body>
    └── Navigation bar (role-aware: admin/student/guest links)
    └── <slot /> for page content
    └── Session expiry modal
    └── Inline scripts for nav toggle, session countdown
```

### Design Tokens

CSS custom properties define the visual language:
- Colors: primary, accent, surface, text, border, success/error tones
- Spacing scale
- Border radius tokens
- Font families: DM Serif Display (headings), Plus Jakarta Sans (body)
- Transition durations

### Navigation

The navbar renders different links based on user role:
- **Guest**: Login, Register
- **Admin**: Dashboard, Classes, Logout
- **Student**: Dashboard, Attendance History, Logout

### Session Expiry Modal

A modal dialog that appears when the user's JWT session is about to expire. Shows a countdown and provides a "Refresh Session" option, or redirects to login on expiry.

### Usage

Every page wraps its content with `Layout`:

```astro
---
import Layout from '@/layouts/Layout.astro';
---

<Layout title="Page Title">
  <!-- page content -->
</Layout>
```

The `title` prop sets the `<title>` tag and is passed through the component.
