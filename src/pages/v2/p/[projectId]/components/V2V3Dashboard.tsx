import Loading from 'components/Loading'
import { V2V3Project } from 'components/v2v3/V2V3Project'
import { AnnouncementLauncher } from 'contexts/Announcements/AnnouncementLauncher'
import { ProjectMetadataContext } from 'contexts/shared/ProjectMetadataContext'
import { TransactionProvider } from 'contexts/Transaction/TransactionProvider'
import { VeNftProvider } from 'contexts/VeNft/VeNftProvider'
import { useContext } from 'react'

export function V2V3Dashboard() {
  const { projectId, projectMetadata } = useContext(ProjectMetadataContext)

  if (!projectMetadata) return <Loading />

  return (
    <TransactionProvider>
      <VeNftProvider projectId={projectId}>
        <AnnouncementLauncher>
          <V2V3Project />
        </AnnouncementLauncher>
      </VeNftProvider>
    </TransactionProvider>
  )
}
