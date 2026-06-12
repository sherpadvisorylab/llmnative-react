---
title: Column formatters
group: Core patterns
order: 50
path: /docs/patterns/formatters
description: Custom formatters and renderers for turning raw data into readable, actionable cells.
---

# Column formatters

Columns can transform values before rendering.

```tsx
<Grid
  path="/orders"
  columns={[
    {
      key: 'total',
      label: 'Total',
      render: ({ value }) => new Intl.NumberFormat('en', {
        style: 'currency',
        currency: 'USD',
      }).format(Number(value ?? 0)),
    },
  ]}
/>;
```

Use small, pure formatters; for complex cells, prefer dedicated React components.
