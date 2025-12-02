
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/renderer')({
  component: () => (
    <div style={{ padding: "20px" }}>
      <h1 style={{ fontSize: "24px", fontWeight: "bold" }}>Renderer</h1>
      <p>This is the <strong>Renderer</strong> page.</p>
    </div>
  ),
})
