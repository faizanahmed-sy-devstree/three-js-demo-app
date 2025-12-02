
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/drei-orbit-controls')({
  component: () => (
    <div style={{ padding: "20px" }}>
      <h1 style={{ fontSize: "24px", fontWeight: "bold" }}>r3 drei - orbit controls</h1>
      <p>This is the <strong>r3 drei - orbit controls</strong> page.</p>
    </div>
  ),
})
