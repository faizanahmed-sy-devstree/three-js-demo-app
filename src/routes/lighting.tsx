
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/lighting')({
  component: () => (
    <div style={{ padding: "20px" }}>
      <h1 style={{ fontSize: "24px", fontWeight: "bold" }}>Lighting</h1>
      <p>This is the <strong>Lighting</strong> page.</p>
    </div>
  ),
})
