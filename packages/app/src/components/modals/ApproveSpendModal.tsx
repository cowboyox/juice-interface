import { BigNumber } from '@ethersproject/bignumber'
import { formatEther, parseEther } from '@ethersproject/units'
import { Descriptions, Input, Modal } from 'antd'
import { UserContext } from 'contexts/userContext'
import { useContext, useEffect, useState } from 'react'

export default function ApproveSpendModal({
  visible,
  initialWeiAmt,
  allowance,
  onSuccess,
  onCancel,
}: {
  visible?: boolean
  initialWeiAmt?: BigNumber
  allowance?: BigNumber
  onSuccess?: VoidFunction
  onCancel?: VoidFunction
}) {
  const { weth, transactor, contracts } = useContext(UserContext)

  const [approveAmount, setApproveAmount] = useState<BigNumber>()

  useEffect(() => setApproveAmount(initialWeiAmt ?? BigNumber.from(0)), [
    initialWeiAmt,
  ])

  function approve() {
    if (!transactor || !contracts || !weth?.contract) return

    transactor(
      weth.contract,
      'approve',
      [contracts.Juicer?.address, approveAmount?.toHexString()],
      {
        onConfirmed: () => {
          if (onSuccess) onSuccess()
        },
      },
    )
  }

  return (
    <Modal
      title={`Approve ETH spending allowance`}
      visible={visible}
      onOk={approve}
      onCancel={onCancel}
      width={600}
      okText="Approve"
    >
      <Descriptions>
        <Descriptions.Item label="Current allowance">
          {allowance ? formatEther(allowance) : undefined} {weth?.symbol}
        </Descriptions.Item>
      </Descriptions>
      <Input
        defaultValue={initialWeiAmt ? formatEther(initialWeiAmt) : '0'}
        onChange={e => setApproveAmount(parseEther(e.target.value || '0'))}
        suffix={weth?.symbol}
      />
    </Modal>
  )
}
