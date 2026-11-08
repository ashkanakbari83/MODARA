import { Plus, Trash2 } from 'lucide-react'
import { useRef, useState } from 'react'
import type { FormEvent } from 'react'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { JalaliDateField } from '@/components/ui/JalaliDateField'
import { SelectField, TextAreaField, TextField } from '@/components/ui/FormFields'
import type { SelectOption } from '@/components/ui/FormFields'
import { CONTRACT_TYPES, PROJECT_STATUSES, SERVICE_TYPES } from '@/data/models'
import type { ContractType, ProjectInput, ProjectStatus, ServiceType } from '@/data/models'
import { messages as m } from '@/locales'
import { newServiceDraft, parseProjectForm, toFormState } from './projectForm'
import type { FormErrors, ProjectFormState, ServiceDraft } from './projectForm'
import styles from './ProjectForm.module.css'

const copy = m.projects.form

const STATUS_OPTIONS: SelectOption[] = PROJECT_STATUSES.map((value) => ({
  value,
  label: m.projects.status[value],
}))
const CONTRACT_OPTIONS: SelectOption[] = CONTRACT_TYPES.map((value) => ({
  value,
  label: m.projects.contractTypes[value],
}))
const SERVICE_OPTIONS: SelectOption[] = SERVICE_TYPES.map((value) => ({
  value,
  label: m.projects.serviceTypes[value],
}))

const MAX_COLORS = 4
const DEFAULT_COLOR = '#2b4fb0'

interface ProjectFormProps {
  initial: ProjectInput
  submitLabel: string
  onSubmit: (input: ProjectInput) => Promise<void>
  onCancel: () => void
}

export function ProjectForm({ initial, submitLabel, onSubmit, onCancel }: ProjectFormProps) {
  const [state, setState] = useState<ProjectFormState>(() => toFormState(initial))
  const [errors, setErrors] = useState<FormErrors>({})
  const [saving, setSaving] = useState(false)
  const [saveFailed, setSaveFailed] = useState(false)
  const summaryRef = useRef<HTMLDivElement>(null)

  function setField<K extends keyof ProjectFormState>(key: K, value: ProjectFormState[K]) {
    setState((previous) => ({ ...previous, [key]: value }))
  }

  function updateService(id: string, patch: Partial<ServiceDraft>) {
    setState((previous) => ({
      ...previous,
      services: previous.services.map((service) =>
        service.id === id ? { ...service, ...patch } : service,
      ),
    }))
  }

  function removeService(id: string) {
    setState((previous) => ({
      ...previous,
      services: previous.services.filter((service) => service.id !== id),
    }))
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (saving) return

    const result = parseProjectForm(state, initial.teamMemberIds)
    setErrors(result.errors)
    setSaveFailed(false)

    if (!result.input) {
      requestAnimationFrame(() => summaryRef.current?.focus())
      return
    }

    setSaving(true)
    try {
      await onSubmit(result.input)
    } catch {
      setSaveFailed(true)
      setSaving(false)
      requestAnimationFrame(() => summaryRef.current?.focus())
    }
  }

  const hasErrors = Object.keys(errors).length > 0

  return (
    <form className={styles.form} onSubmit={handleSubmit} noValidate>
      {hasErrors || saveFailed ? (
        <div ref={summaryRef} className={styles.summary} role="alert" tabIndex={-1}>
          {saveFailed ? m.form.saveFailed : m.form.fixErrors}
        </div>
      ) : null}

      <Card as="section" padding="lg" className={styles.section}>
        <h2 className={styles.sectionTitle}>{copy.sections.basics}</h2>
        <div className={styles.grid}>
          <TextField
            label={copy.name}
            hint={copy.nameHint}
            required
            value={state.name}
            error={errors.name}
            onChange={(value) => setField('name', value)}
          />
          <TextField
            label={copy.brandName}
            value={state.brandName}
            onChange={(value) => setField('brandName', value)}
          />
          <TextField
            label={copy.category}
            hint={copy.categoryHint}
            value={state.category}
            onChange={(value) => setField('category', value)}
          />
          <SelectField
            label={copy.status}
            value={state.status}
            options={STATUS_OPTIONS}
            onChange={(value) => setField('status', value as ProjectStatus)}
          />
        </div>
        <TextAreaField
          label={copy.description}
          value={state.description}
          onChange={(value) => setField('description', value)}
        />
      </Card>

      <Card as="section" padding="lg" className={styles.section}>
        <h2 className={styles.sectionTitle}>{copy.sections.brand}</h2>
        <div>
          <p className={styles.groupLabel}>{copy.brandColors}</p>
          <ul className={styles.colorList}>
            {state.brandColors.map((color, index) => (
              <li key={index} className={styles.colorItem}>
                <input
                  type="color"
                  className={styles.colorInput}
                  value={color}
                  aria-label={`${copy.color} ${index + 1}`}
                  onChange={(event) =>
                    setField(
                      'brandColors',
                      state.brandColors.map((item, position) =>
                        position === index ? event.target.value : item,
                      ),
                    )
                  }
                />
                <Button
                  variant="ghost"
                  aria-label={`${copy.removeColor} ${index + 1}`}
                  onClick={() =>
                    setField(
                      'brandColors',
                      state.brandColors.filter((_, position) => position !== index),
                    )
                  }
                >
                  <Trash2 size={18} aria-hidden="true" />
                </Button>
              </li>
            ))}
          </ul>
          {state.brandColors.length < MAX_COLORS ? (
            <Button
              variant="secondary"
              onClick={() => setField('brandColors', [...state.brandColors, DEFAULT_COLOR])}
            >
              <Plus size={18} aria-hidden="true" />
              {copy.addColor}
            </Button>
          ) : null}
        </div>
      </Card>

      <Card as="section" padding="lg" className={styles.section}>
        <h2 className={styles.sectionTitle}>{copy.sections.contact}</h2>
        <div className={styles.grid}>
          <TextField
            label={copy.contactPerson}
            value={state.contactPerson}
            onChange={(value) => setField('contactPerson', value)}
          />
          <TextField
            label={copy.phone}
            type="tel"
            inputMode="tel"
            dir="ltr"
            autoComplete="off"
            value={state.phone}
            onChange={(value) => setField('phone', value)}
          />
          <TextField
            label={copy.email}
            type="email"
            inputMode="email"
            dir="ltr"
            autoComplete="off"
            value={state.email}
            error={errors.email}
            onChange={(value) => setField('email', value)}
          />
          <TextField
            label={copy.instagram}
            dir="ltr"
            autoComplete="off"
            value={state.instagram}
            onChange={(value) => setField('instagram', value)}
          />
        </div>
      </Card>

      <Card as="section" padding="lg" className={styles.section}>
        <h2 className={styles.sectionTitle}>{copy.sections.contract}</h2>
        <div className={styles.grid}>
          <JalaliDateField
            label={copy.startDate}
            value={state.startDate}
            onChange={(value) => setField('startDate', value)}
          />
          <JalaliDateField
            label={copy.endDate}
            value={state.contractEndDate}
            error={errors.contractEndDate}
            onChange={(value) => setField('contractEndDate', value)}
          />
          <TextField
            label={copy.budget}
            inputMode="numeric"
            dir="ltr"
            value={state.budget}
            error={errors.budget}
            onChange={(value) => setField('budget', value)}
          />
          <SelectField
            label={copy.contractType}
            value={state.contractType}
            options={CONTRACT_OPTIONS}
            onChange={(value) => setField('contractType', value as ContractType)}
          />
        </div>
      </Card>

      <Card as="section" padding="lg" className={styles.section}>
        <h2 className={styles.sectionTitle}>{copy.sections.services}</h2>
        <p className={styles.sectionHint}>{copy.servicesHint}</p>

        {state.services.map((service, index) => (
          <fieldset key={service.id} className={styles.service}>
            <legend className={styles.serviceLegend}>
              {copy.serviceN} {index + 1}
            </legend>
            <div className={styles.grid}>
              <SelectField
                label={copy.serviceType}
                value={service.serviceType}
                options={SERVICE_OPTIONS}
                onChange={(value) =>
                  updateService(service.id, { serviceType: value as ServiceType })
                }
              />
              {service.serviceType === 'custom' ? (
                <TextField
                  label={copy.customName}
                  required
                  value={service.customName}
                  error={errors[`service-${service.id}-name`]}
                  onChange={(value) => updateService(service.id, { customName: value })}
                />
              ) : null}
              <TextField
                label={copy.quantity}
                inputMode="numeric"
                dir="ltr"
                value={service.quantity}
                error={errors[`service-${service.id}-quantity`]}
                onChange={(value) => updateService(service.id, { quantity: value })}
              />
              <TextField
                label={copy.unit}
                value={service.unit}
                onChange={(value) => updateService(service.id, { unit: value })}
              />
              <TextField
                label={copy.price}
                inputMode="numeric"
                dir="ltr"
                value={service.price}
                error={errors[`service-${service.id}-price`]}
                onChange={(value) => updateService(service.id, { price: value })}
              />
              <TextField
                label={copy.responsible}
                value={service.responsible}
                onChange={(value) => updateService(service.id, { responsible: value })}
              />
            </div>
            <TextAreaField
              label={copy.delivery}
              rows={2}
              value={service.delivery}
              onChange={(value) => updateService(service.id, { delivery: value })}
            />
            <div>
              <Button variant="ghost" onClick={() => removeService(service.id)}>
                <Trash2 size={18} aria-hidden="true" />
                {copy.removeService}
              </Button>
            </div>
          </fieldset>
        ))}

        <div>
          <Button
            variant="secondary"
            onClick={() => setField('services', [...state.services, newServiceDraft()])}
          >
            <Plus size={18} aria-hidden="true" />
            {copy.addService}
          </Button>
        </div>
      </Card>

      <Card as="section" padding="lg" className={styles.section}>
        <h2 className={styles.sectionTitle}>{copy.sections.notes}</h2>
        <TextAreaField
          label={copy.notes}
          rows={5}
          value={state.notes}
          onChange={(value) => setField('notes', value)}
        />
      </Card>

      <div className={styles.actions}>
        <Button type="submit" disabled={saving}>
          {saving ? m.form.saving : submitLabel}
        </Button>
        <Button variant="secondary" onClick={onCancel} disabled={saving}>
          {m.form.cancel}
        </Button>
      </div>
    </form>
  )
}
