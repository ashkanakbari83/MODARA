import { useNavigate, useParams } from 'react-router-dom'
import { PageHeader } from '@/components/ui/PageHeader'
import { projectRepository } from '@/data/repositories/projectRepository'
import { useLiveData } from '@/data/useLiveData'
import { messages as m } from '@/locales'
import { ProjectEditor } from './ProjectEditor'
import { emptyProjectInput } from './projectFormModel'
import styles from './ProjectsPage.module.css'

function CreateProject() {
  const navigate = useNavigate()

  return (
    <>
      <PageHeader title={m.projects.form.createTitle} />
      <ProjectEditor
        initial={emptyProjectInput()}
        submitLabel={m.form.save}
        onSubmit={async (input) => {
          const project = await projectRepository.create(input)
          navigate(`/projects/${project.id}`)
        }}
        onCancel={() => navigate('/projects')}
      />
    </>
  )
}

function EditProject({ projectId }: { projectId: string }) {
  const navigate = useNavigate()
  const { data, error } = useLiveData(
    async () => ({ project: await projectRepository.getById(projectId) }),
    [projectId],
  )

  if (error) {
    return (
      <p className={styles.message} role="alert">
        {m.data.loadFailed}
      </p>
    )
  }
  if (!data) {
    return (
      <p className={styles.message} role="status">
        {m.data.loading}
      </p>
    )
  }
  const { project } = data
  if (!project) {
    return (
      <p className={styles.message} role="alert">
        {m.projects.detail.notFoundBody}
      </p>
    )
  }

  return (
    <>
      <PageHeader title={m.projects.form.editTitle} description={project.name} />
      <ProjectEditor
        key={project.id}
        initial={project}
        submitLabel={m.form.save}
        onSubmit={async (input) => {
          await projectRepository.update(project.id, input)
          navigate(`/projects/${project.id}`)
        }}
        onCancel={() => navigate(`/projects/${project.id}`)}
      />
    </>
  )
}

/** One page for both "new project" and "edit project". */
export function ProjectFormPage() {
  const { projectId } = useParams()
  return projectId ? <EditProject projectId={projectId} /> : <CreateProject />
}
