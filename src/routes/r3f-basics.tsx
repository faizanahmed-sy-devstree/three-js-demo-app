
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/r3f-basics')({
  component: () => (
    <div style={{ padding: "20px" }}>
      <h1 style={{ fontSize: "24px", fontWeight: "bold" }}>React Three Fiber Basics</h1>
      <p>This is the <strong>React Three Fiber Basics</strong> page.</p>
    </div>
  ),
})
