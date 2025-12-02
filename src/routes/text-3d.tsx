
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/text-3d')({
  component: () => (
    <div style={{ padding: "20px" }}>
      <h1 style={{ fontSize: "24px", fontWeight: "bold" }}>3D Text</h1>
      <p>This is the <strong>3D Text</strong> page.</p>
    </div>
  ),
})
