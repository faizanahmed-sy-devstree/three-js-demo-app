
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/geometry-materials')({
  component: () => (
    <div style={{ padding: "20px" }}>
      <h1 style={{ fontSize: "24px", fontWeight: "bold" }}>Geometry, Materials</h1>
      <p>This is the <strong>Geometry, Materials</strong> page.</p>
    </div>
  ),
})
