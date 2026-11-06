import { LEVELS } from '../api/types'
import type { Level } from '../api/types'

interface LevelPickerProps {
  value: Level[]
  onChange: (levels: Level[]) => void
  error?: string
  disabled?: boolean
}

export function LevelPicker({ value, onChange, error, disabled }: LevelPickerProps) {
  const toggle = (level: Level) =>
    onChange(value.includes(level) ? value.filter((l) => l !== level) : [...value, level])

  return (
    <fieldset className="field" aria-invalid={error ? true : undefined}>
      <legend>Niveles</legend>
      <div className="checks">
        {LEVELS.map((level) => (
          <label key={level.value} className="check">
            <input
              type="checkbox"
              checked={value.includes(level.value)}
              onChange={() => toggle(level.value)}
              disabled={disabled}
            />
            {level.label}
          </label>
        ))}
      </div>
      {error && <span className="field__error">{error}</span>}
    </fieldset>
  )
}
