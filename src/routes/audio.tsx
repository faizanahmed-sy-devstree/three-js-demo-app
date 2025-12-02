
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/audio')({
  component: () => (
    <div style={{ padding: "20px" }}>
      <h1 style={{ fontSize: "24px", fontWeight: "bold" }}>Audio</h1>
      <p>This is the <strong>Audio</strong> page.</p>
    </div>
  ),
})
