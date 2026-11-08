import { newId } from '@/data/ids'
import type {
  ContractType,
  ProjectInput,
  ProjectService,
  ProjectStatus,
  ServiceType,
} from '@/data/models'
import { formatInteger } from '@/lib/format'
import { parseNumberInput } from '@/lib/numbers'
import { messages as m } from '@/locales'

/** Editable copy of a service line. Numbers stay as text while the user types. */
export interface ServiceDraft {
  id: string
  serviceType: ServiceType
  customName: string
  quantity: string
  unit: string
  price: string
  responsible: string
  delivery: string
}

export interface ProjectFormState {
  name: string
  brandName: string
  category: string
  description: string
  brandColors: string[]
  contactPerson: string
  phone: string
  email: string
  instagram: string
  startDate: string
  contractEndDate: string
  budget: string
  contractType: ContractType
  status: ProjectStatus
  notes: string
  services: ServiceDraft[]
}

/** Error messages keyed by field ("name", "email", "budget", "contractEndDate", "service-<id>-price" ...). */
export type FormErrors = Record<string, string>

export function emptyProjectInput(): ProjectInput {
  return {
    name: '',
    brandName: '',
    description: '',
    category: '',
    brandColors: [],
    contactPerson: '',
    phone: '',
    email: '',
    instagram: '',
    startDate: null,
    contractEndDate: null,
    monthlyBudgetToman: 0,
    contractType: 'monthly',
    status: 'active',
    notes: '',
    services: [],
    teamMemberIds: [],
  }
}

export function newServiceDraft(): ServiceDraft {
  return {
    id: newId(),
    serviceType: 'video-production',
    customName: '',
    quantity: '',
    unit: m.projects.form.unitDefault,
    price: '',
    responsible: '',
    delivery: '',
  }
}

function numberToText(value: number): string {
  return value > 0 ? formatInteger(value) : ''
}

export function toFormState(input: ProjectInput): ProjectFormState {
  return {
    name: input.name,
    brandName: input.brandName,
    category: input.category,
    description: input.description,
    brandColors: [...input.brandColors],
    contactPerson: input.contactPerson,
    phone: input.phone,
    email: input.email,
    instagram: input.instagram,
    startDate: input.startDate ?? '',
    contractEndDate: input.contractEndDate ?? '',
    budget: numberToText(input.monthlyBudgetToman),
    contractType: input.contractType,
    status: input.status,
    notes: input.notes,
    services: input.services.map((service) => ({
      id: service.id,
      serviceType: service.serviceType,
      customName: service.customName,
      quantity: numberToText(service.quantity),
      unit: service.unit,
      price: numberToText(service.priceToman),
      responsible: service.responsible,
      delivery: service.deliveryRequirements,
    })),
  }
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

/** Validates the form. Returns the cleaned input when valid, otherwise null plus the errors. */
export function parseProjectForm(
  state: ProjectFormState,
  teamMemberIds: string[],
): { input: ProjectInput | null; errors: FormErrors } {
  const errors: FormErrors = {}
  const copy = m.projects.form.errors

  const name = state.name.trim()
  if (!name) errors.name = copy.nameRequired

  const email = state.email.trim()
  if (email && !EMAIL_PATTERN.test(email)) errors.email = copy.invalidEmail

  const budget = parseNumberInput(state.budget)
  if (Number.isNaN(budget)) errors.budget = copy.invalidNumber

  if (state.startDate && state.contractEndDate && state.contractEndDate < state.startDate) {
    errors.contractEndDate = copy.endBeforeStart
  }

  const services: ProjectService[] = state.services.map((draft) => {
    const quantity = parseNumberInput(draft.quantity)
    const price = parseNumberInput(draft.price)
    const customName = draft.customName.trim()

    if (Number.isNaN(quantity)) errors[`service-${draft.id}-quantity`] = copy.invalidNumber
    if (Number.isNaN(price)) errors[`service-${draft.id}-price`] = copy.invalidNumber
    if (draft.serviceType === 'custom' && !customName) {
      errors[`service-${draft.id}-name`] = copy.customNameRequired
    }

    return {
      id: draft.id,
      serviceType: draft.serviceType,
      customName: draft.serviceType === 'custom' ? customName : '',
      quantity: quantity ?? 0,
      unit: draft.unit.trim(),
      priceToman: price ?? 0,
      responsible: draft.responsible.trim(),
      deliveryRequirements: draft.delivery.trim(),
    }
  })

  if (Object.keys(errors).length > 0) return { input: null, errors }

  return {
    errors,
    input: {
      name,
      brandName: state.brandName.trim(),
      description: state.description.trim(),
      category: state.category.trim(),
      brandColors: state.brandColors,
      contactPerson: state.contactPerson.trim(),
      phone: state.phone.trim(),
      email,
      instagram: state.instagram.trim(),
      startDate: state.startDate || null,
      contractEndDate: state.contractEndDate || null,
      monthlyBudgetToman: budget ?? 0,
      contractType: state.contractType,
      status: state.status,
      notes: state.notes.trim(),
      services,
      teamMemberIds,
    },
  }
}
