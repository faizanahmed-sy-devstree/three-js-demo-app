
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/textures')({
  component: () => (
    <div style={{ padding: "20px" }}>
      <h1 style={{ fontSize: "24px", fontWeight: "bold" }}>Textures</h1>
      <p>This is the <strong>Textures</strong> page.</p>
    </div>
  ),
})
