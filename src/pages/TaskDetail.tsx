import { useState } from 'react'
import { CodeBlock } from '../components/CodeBlock'
import {
  CodeEditorForm,
  type CodeEditorSubmission,
} from '../components/CodeEditorForm'
import type { ReviewTask } from '../data/tasks'
import { taskTestsById } from '../tests/taskTests'

type TaskDetailProps = {
  task: ReviewTask
  savedSubmission?: CodeEditorSubmission | null
  onBack: () => void
  onSubmitComplete: (taskId: string, submission: CodeEditorSubmission) => void
}

export function TaskDetail({
  task,
  savedSubmission,
  onBack,
  onSubmitComplete,
}: TaskDetailProps) {
  const [revealedReferenceTaskId, setRevealedReferenceTaskId] = useState<
    string | null
  >(null)
  const showReferenceImplementation =
    revealedReferenceTaskId === task.id || Boolean(savedSubmission)

  return (
    <main className="page-shell">
      <button type="button" className="back-link" onClick={onBack}>
        Back to dashboard
      </button>

      <section className="detail-header">
        <div>
          <p className="eyebrow">{task.category}</p>
          <h1>{task.title}</h1>
          <p>{task.description}</p>
        </div>
        <aside className="status-panel">
          <span>{task.difficulty}</span>
          <strong>{task.testResults.failed} failure modes</strong>
        </aside>
      </section>

      <section className="detail-grid">
        <article className="info-panel">
          <h2>Expected behavior</h2>
          <ul>
            {task.expectedBehavior.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </article>
        <article className="info-panel">
          <h2>Edge cases</h2>
          <ul>
            {task.edgeCases.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </article>
      </section>

      <section className="code-grid code-grid--single">
        <CodeBlock title="Starter buggy implementation" code={task.buggyCode} />
      </section>

      <CodeEditorForm
        key={task.id}
        initialCode={task.buggyCode}
        taskId={task.id}
        testCases={taskTestsById[task.id] ?? []}
        savedSubmission={savedSubmission}
        onSubmitComplete={(submission) => {
          setRevealedReferenceTaskId(task.id)
          onSubmitComplete(task.id, submission)
        }}
      />

      {showReferenceImplementation && (
        <section className="revealed-reference">
          <CodeBlock
            title="Corrected reference implementation"
            code={task.fixedCode}
            allowCopy
          />
        </section>
      )}
    </main>
  )
}
