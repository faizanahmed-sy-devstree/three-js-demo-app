
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/physics')({
  component: () => (
    <div style={{ padding: "20px" }}>
      <h1 style={{ fontSize: "24px", fontWeight: "bold" }}>Physics</h1>
      <p>This is the <strong>Physics</strong> page.</p>
    </div>
  ),
})
