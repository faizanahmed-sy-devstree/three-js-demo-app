
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/mesh')({
  component: () => (
    <div style={{ padding: "20px" }}>
      <h1 style={{ fontSize: "24px", fontWeight: "bold" }}>Mesh</h1>
      <p>This is the <strong>Mesh</strong> page.</p>
    </div>
  ),
})
