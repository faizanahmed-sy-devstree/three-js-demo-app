
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/r3f-useframe')({
  component: () => (
    <div style={{ padding: "20px" }}>
      <h1 style={{ fontSize: "24px", fontWeight: "bold" }}>r3f - useFrame</h1>
      <p>This is the <strong>r3f - useFrame</strong> page.</p>
    </div>
  ),
})
