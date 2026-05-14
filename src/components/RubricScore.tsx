import type { ReviewTask } from '../data/tasks'
import { getRubricAverage } from '../utils/rubric'

type RubricScoreProps = {
  rubric: ReviewTask['rubric']
}

const rubricLabels: Record<keyof ReviewTask['rubric'], string> = {
  correctness: 'Correctness',
  tests: 'Test Coverage',
  edgeCases: 'Edge Cases',
  codeQuality: 'Code Quality',
  clarity: 'Specification Clarity',
}

export function RubricScore({ rubric }: RubricScoreProps) {
  const average = getRubricAverage(rubric)

  return (
    <section className="rubric-card">
      <div className="rubric-card__summary">
        <span>Rubric score</span>
        <strong>{average}</strong>
      </div>

      <div className="rubric-list">
        {Object.entries(rubric).map(([key, score]) => (
          <div className="rubric-row" key={key}>
            <div>
              <span>{rubricLabels[key as keyof ReviewTask['rubric']]}</span>
              <strong>{score}/100</strong>
            </div>
            <meter min="0" max="100" value={score}>
              {score}
            </meter>
          </div>
        ))}
      </div>
    </section>
  )
}
