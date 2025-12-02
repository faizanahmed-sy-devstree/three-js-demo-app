
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/loaders')({
  component: () => (
    <div style={{ padding: "20px" }}>
      <h1 style={{ fontSize: "24px", fontWeight: "bold" }}>Loaders</h1>
      <p>This is the <strong>Loaders</strong> page.</p>
    </div>
  ),
})
