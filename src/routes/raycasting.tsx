
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/raycasting')({
  component: () => (
    <div style={{ padding: "20px" }}>
      <h1 style={{ fontSize: "24px", fontWeight: "bold" }}>Raycasting</h1>
      <p>This is the <strong>Raycasting</strong> page.</p>
    </div>
  ),
})
