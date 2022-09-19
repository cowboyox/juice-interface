import { AppWrapper } from 'components/common'
import { VeNft } from 'components/veNft/VeNft'
import { ProjectMetadataV5 } from 'models/project-metadata'
import { GetServerSideProps } from 'next'
import { TransactionProvider } from 'providers/TransactionProvider'
import { V2ContractsProvider } from 'providers/v2/V2ContractsProvider'
import V2ProjectMetadataProvider from 'providers/v2/V2ProjectMetadataProvider'
import V2ProjectProvider from 'providers/v2/V2ProjectProvider'
import { VeNftProvider } from 'providers/v2/VeNftProvider'
import { getProjectProps, ProjectPageProps } from '../utils/props'

export const getServerSideProps: GetServerSideProps<
  ProjectPageProps
> = async context => {
  if (!context.params) throw new Error('params not supplied')

  const projectId = parseInt(context.params.projectId as string)
  return getProjectProps(projectId)
}

export default function V2ProjectSettingsPage({
  projectId,
  metadata,
}: {
  projectId: number
  metadata: ProjectMetadataV5
}) {
  return (
    <AppWrapper>
      <V2ContractsProvider>
        <TransactionProvider>
          <V2ProjectMetadataProvider projectId={projectId} metadata={metadata}>
            <V2ProjectProvider projectId={projectId}>
              <VeNftProvider projectId={projectId}>
                <VeNft />
              </VeNftProvider>
            </V2ProjectProvider>
          </V2ProjectMetadataProvider>
        </TransactionProvider>
      </V2ContractsProvider>
    </AppWrapper>
  )
}
