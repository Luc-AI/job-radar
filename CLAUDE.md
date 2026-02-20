# Job Radar — Development Conventions

## UI Component Changes

**Before making any UI or frontend design change, always consult the shadcn MCP tools first:**

1. Use `search_items_in_registries` to find relevant components
2. Use `view_items_in_registries` to see component source and API
3. Use `get_item_examples_from_registries` to check usage examples and demos
4. Follow established patterns in `src/components/ui/`

When adding new shadcn components:
```bash
npx shadcn@latest add <component-name>
```

## Icon Library — Feather Icons

This project uses **react-feather**. Do NOT use lucide-react or @phosphor-icons/react.

### Usage

```tsx
import { MapPin, ChevronDown, LogOut } from "react-feather";

// Sizing — use className to match surrounding text size
<MapPin className="size-4" />      // 16px — for text-sm contexts
<MapPin className="size-5" />      // 20px — for text-base contexts

// Filled variant (e.g. bookmarks)
<Bookmark fill={isActive ? "currentColor" : "none"} />

// Loading spinner
<Loader className="size-4 animate-spin" />
```

### Sizing guidelines

Icons should feel naturally proportional to their surrounding text:
- **text-xs / text-sm context** → `className="size-3.5"` or `className="size-4"` (14–16px)
- **text-base context** → `className="size-4"` or `className="size-5"` (16–20px)
- **headings / hero** → `className="size-5"` or `className="size-6"` (20–24px)

### Common icons

| Purpose | Icon |
|---|---|
| Loading spinner | `Loader` (with `animate-spin`) |
| Chevrons | `ChevronDown`, `ChevronUp`, `ChevronRight`, `ChevronLeft` |
| Close | `X` |
| External link | `ExternalLink` |
| Eye off / hidden | `EyeOff` |
| Log out | `LogOut` |
| Search | `Search` |
| Filter | `Filter` |
| Email | `Mail` |
| Vertical dots menu | `MoreVertical` |
| Trending up | `TrendingUp` |
| Warning | `AlertTriangle` |

## Project Conventions

- **Framework:** Next.js with App Router
- **Styling:** Tailwind CSS v4 with semantic color tokens (globals.css), dark mode via next-themes
- **Components:** shadcn/ui (new-york style), source in `src/components/ui/`
- **Naming:** PascalCase for components/files, camelCase for functions/variables, snake_case for DB columns
- **Data:** Supabase (server actions for mutations, server components for data fetching)
