import Loading from 'components/shared/Loading'
import Project404 from 'components/shared/Project404'
import V2Dashboard from 'components/v2/V2Dashboard'
import useSubgraphQuery from 'hooks/SubgraphQuery'
import { useParams } from 'react-router-dom'

export default function V2DashboardGateway() {
  const { handle, projectId }: { handle?: string; projectId?: string } =
    useParams()

  const _projectId =
    projectId && !isNaN(parseInt(projectId)) ? parseInt(projectId) : undefined

  // IF handle AND no projectId, query graph for project with that handle.
  const { isLoading, data: projects } = useSubgraphQuery(
    handle && !_projectId
      ? {
          entity: 'project',
          keys: ['projectId'],
          where: [
            { key: 'cv', value: '2' },
            { key: 'handle', value: handle },
          ],
        }
      : null,
  )

  // IF projectId, return V2Dashboard with projectId.
  if (_projectId) return <V2Dashboard projectId={_projectId} />

  if (isLoading) return <Loading />

  if (!projects?.length) {
    return handle ? (
      <Project404 handle={handle} />
    ) : (
      <Project404 projectId={_projectId} />
    )
  }

  // If matching project found in query, return dashboard for that project.
  return <V2Dashboard projectId={projects[0].projectId} />
}
