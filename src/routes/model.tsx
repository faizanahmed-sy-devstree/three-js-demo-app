
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/model')({
  component: () => (
    <div style={{ padding: "20px" }}>
      <h1 style={{ fontSize: "24px", fontWeight: "bold" }}>Model</h1>
      <p>This is the <strong>Model</strong> page.</p>
    </div>
  ),
})
