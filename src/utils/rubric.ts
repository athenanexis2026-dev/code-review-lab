import type { ReviewTask } from '../data/tasks'

export function getRubricAverage(rubric: ReviewTask['rubric']) {
  const scores = Object.values(rubric)
  return Math.round(scores.reduce((sum, score) => sum + score, 0) / scores.length)
}
