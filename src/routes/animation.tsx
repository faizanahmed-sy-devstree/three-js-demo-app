
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/animation')({
  component: () => (
    <div style={{ padding: "20px" }}>
      <h1 style={{ fontSize: "24px", fontWeight: "bold" }}>Animation</h1>
      <p>This is the <strong>Animation</strong> page.</p>
    </div>
  ),
})
