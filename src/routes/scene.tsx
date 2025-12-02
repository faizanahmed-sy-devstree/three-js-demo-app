
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/scene')({
  component: () => (
    <div style={{ padding: "20px" }}>
      <h1 style={{ fontSize: "24px", fontWeight: "bold" }}>Scene</h1>
      <p>This is the <strong>Scene</strong> page.</p>
    </div>
  ),
})
