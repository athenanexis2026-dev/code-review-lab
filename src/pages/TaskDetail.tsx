import { CodeBlock } from '../components/CodeBlock'
import {
  CodeEditorForm,
  type CodeEditorSubmission,
} from '../components/CodeEditorForm'
import { TaskInfoPanel } from '../components/TaskInfoPanel'
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
  const taskTests = taskTestsById[task.id] ?? []
  const showReferenceImplementation = Boolean(savedSubmission)
  const submitTask = (submission: CodeEditorSubmission) => {
    onSubmitComplete(task.id, submission)
  }

  return (
    <main className="page-shell">
      <button type="button" className="back-link" onClick={onBack}>
        Back to dashboard
      </button>

      <section className="detail-header detail-header--full">
        <div>
          <p className="eyebrow">{task.category}</p>
          <h1>{task.title}</h1>
          <p>{task.description}</p>
        </div>
      </section>

      <section className="detail-grid">
        <TaskInfoPanel title="Expected behavior" items={task.expectedBehavior} />
        <TaskInfoPanel title="Edge cases" items={task.edgeCases} />
      </section>

      <section className="code-grid code-grid--single">
        <CodeBlock title="Starter buggy implementation" code={task.buggyCode} />
      </section>

      <CodeEditorForm
        key={task.id}
        initialCode={task.buggyCode}
        taskId={task.id}
        testCases={taskTests}
        savedSubmission={savedSubmission}
        onSubmitComplete={submitTask}
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
