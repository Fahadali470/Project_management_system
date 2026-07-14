import { Profiler } from 'react'
import type { ProfilerOnRenderCallback, ReactNode } from 'react'

interface PerformanceProfilerProps {
  id: string
  children: ReactNode
}

const handleRender: ProfilerOnRenderCallback = (
  id,
  phase,
  actualDuration,
  baseDuration,
  startTime,
  commitTime
) => {
  if (!import.meta.env.DEV) return

  console.info('[TaskFlow Pro profiler]', {
    id,
    phase,
    actualDuration: Number(actualDuration.toFixed(2)),
    baseDuration: Number(baseDuration.toFixed(2)),
    startTime: Number(startTime.toFixed(2)),
    commitTime: Number(commitTime.toFixed(2)),
  })
}

export default function PerformanceProfiler({ id, children }: PerformanceProfilerProps) {
  if (!import.meta.env.DEV) {
    return <>{children}</>
  }

  return (
    <Profiler id={id} onRender={handleRender}>
      {children}
    </Profiler>
  )
}
