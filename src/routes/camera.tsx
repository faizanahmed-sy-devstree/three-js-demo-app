
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/camera')({
  component: () => (
    <div style={{ padding: "20px" }}>
      <h1 style={{ fontSize: "24px", fontWeight: "bold" }}>Camera</h1>
      <p>This is the <strong>Camera</strong> page.</p>
    </div>
  ),
})
