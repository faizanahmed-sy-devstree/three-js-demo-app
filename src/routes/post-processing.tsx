
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/post-processing')({
  component: () => (
    <div style={{ padding: "20px" }}>
      <h1 style={{ fontSize: "24px", fontWeight: "bold" }}>Post-processing</h1>
      <p>This is the <strong>Post-processing</strong> page.</p>
    </div>
  ),
})
