
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/shaders')({
  component: () => (
    <div style={{ padding: "20px" }}>
      <h1 style={{ fontSize: "24px", fontWeight: "bold" }}>Shaders (GLSL)</h1>
      <p>This is the <strong>Shaders (GLSL)</strong> page.</p>
    </div>
  ),
})
