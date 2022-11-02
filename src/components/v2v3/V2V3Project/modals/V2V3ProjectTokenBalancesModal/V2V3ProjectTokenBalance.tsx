import { Trans } from '@lingui/macro'
import V2V3ProjectHandle from 'components/v2v3/shared/V2V3ProjectHandle'
import { V2V3ProjectContext } from 'contexts/v2v3/V2V3ProjectContext'
import useSymbolOfERC20 from 'hooks/SymbolOfERC20'
import useProjectHandle from 'hooks/v2v3/contractReader/ProjectHandle'
import useProjectToken from 'hooks/v2v3/contractReader/ProjectToken'
import useTotalBalanceOf from 'hooks/v2v3/contractReader/TotalBalanceOf'
import { CSSProperties, useContext } from 'react'
import { formatWad } from 'utils/format/formatNumber'
import { tokenSymbolText } from 'utils/tokenSymbolText'

export const V2V3ProjectTokenBalance = ({
  projectId,
  style,
  precision,
}: {
  projectId: number
  style?: CSSProperties
  precision?: number
}) => {
  const { projectOwnerAddress } = useContext(V2V3ProjectContext)
  const { data: handle } = useProjectHandle({ projectId })
  const { data: tokenAddress } = useProjectToken({ projectId })
  const tokenSymbol = useSymbolOfERC20(tokenAddress)
  const { data: balance } = useTotalBalanceOf(projectOwnerAddress, projectId)
  const formattedBalance = formatWad(balance, { precision: precision ?? 0 })

  return (
    <div style={{ ...style }}>
      {tokenSymbol ? (
        <span>
          {formattedBalance} {tokenSymbolText({ tokenSymbol, plural: true })}
        </span>
      ) : (
        <span>
          <Trans>
            {formattedBalance} tokens for{' '}
            <V2V3ProjectHandle projectId={projectId} handle={handle} />
          </Trans>
        </span>
      )}
    </div>
  )
}
