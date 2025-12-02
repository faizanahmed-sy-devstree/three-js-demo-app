
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/math')({
  component: () => (
    <div style={{ padding: "20px" }}>
      <h1 style={{ fontSize: "24px", fontWeight: "bold" }}>Math</h1>
      <p>This is the <strong>Math</strong> page.</p>
    </div>
  ),
})
