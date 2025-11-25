import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/demo2')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/demo2"!</div>
}
