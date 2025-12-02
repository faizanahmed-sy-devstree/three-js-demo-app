
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/helpers')({
  component: () => (
    <div style={{ padding: "20px" }}>
      <h1 style={{ fontSize: "24px", fontWeight: "bold" }}>Helpers</h1>
      <p>This is the <strong>Helpers</strong> page.</p>
    </div>
  ),
})
