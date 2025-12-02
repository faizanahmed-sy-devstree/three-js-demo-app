
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/r3f-canvas')({
  component: () => (
    <div style={{ padding: "20px" }}>
      <h1 style={{ fontSize: "24px", fontWeight: "bold" }}>r3f - canvas</h1>
      <p>This is the <strong>r3f - canvas</strong> page.</p>
    </div>
  ),
})
