import { t, Trans } from '@lingui/macro'
import { Form, Modal } from 'antd'
import { Split } from 'models/v2/splits'
import { useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { FormItems } from 'components/shared/formItems'

import { toMod, toSplit } from 'utils/v2/splits'

import { V2ProjectContext } from 'contexts/v2/projectContext'

import { useSetProjectSplits } from 'hooks/v2/transactor/SetProjectSplits'

import { preciseFormatSplitPercent } from 'utils/v2/math'

import { RESERVED_TOKEN_SPLIT_GROUP } from 'constants/v2/splits'

export const EditTokenAllocationModal = ({
  visible,
  onOk,
  onCancel,
}: {
  visible: boolean
  onOk: VoidFunction
  onCancel: VoidFunction
}) => {
  const { reservedTokensSplits, fundingCycleMetadata, fundingCycle } =
    useContext(V2ProjectContext)
  const reservedRate = fundingCycleMetadata?.reservedRate

  const setProjectSplits = useSetProjectSplits({
    domain: fundingCycle?.configuration?.toString(),
  })

  const [editingReservedTokensSplits, setEditingReservedTokensSplits] =
    useState<Split[]>([])
  const [modalLoading, setModalLoading] = useState<boolean>(false)

  useEffect(() => {
    if (!reservedTokensSplits) return
    setEditingReservedTokensSplits(reservedTokensSplits)
  }, [reservedTokensSplits])

  const totalPercentage = useMemo(
    () =>
      editingReservedTokensSplits
        ?.map(s => preciseFormatSplitPercent(s.percent))
        .reduce((a, b) => a + b, 0) ?? 0,
    [editingReservedTokensSplits],
  )
  const totalPercentagesInvalid = totalPercentage > 100

  const onSaveTokenAllocation = useCallback(async () => {
    if (totalPercentagesInvalid) return
    setModalLoading(true)
    const tx = await setProjectSplits(
      {
        groupedSplits: {
          group: RESERVED_TOKEN_SPLIT_GROUP,
          splits: editingReservedTokensSplits ?? [],
        },
      },
      {
        onConfirmed: () => {
          setModalLoading(false)
          onOk()
        },
        onError: () => setModalLoading(false),
      },
    )
    if (!tx) {
      setModalLoading(false)
    }
  }, [
    editingReservedTokensSplits,
    onOk,
    setProjectSplits,
    totalPercentagesInvalid,
  ])

  return (
    <Modal
      visible={visible}
      confirmLoading={modalLoading}
      title={t`Edit reserved token allocation`}
      okText={t`Save token allocation`}
      cancelText={modalLoading ? t`Close` : t`Cancel`}
      width={720}
      onOk={() => onSaveTokenAllocation()}
      onCancel={onCancel}
      okButtonProps={{ disabled: totalPercentagesInvalid }}
    >
      <Form layout="vertical">
        <FormItems.ProjectTicketMods
          mods={editingReservedTokensSplits.map(toMod)}
          onModsChanged={mods =>
            setEditingReservedTokensSplits(mods.map(toSplit))
          }
          formItemProps={{
            label: <Trans>Reserved token allocation (optional)</Trans>,
            extra: (
              <Trans>
                Allocate a portion of your project's reserved tokens to other
                Ethereum wallets or Juicebox projects.
              </Trans>
            ),
          }}
          reservedRate={reservedRate?.toNumber() ?? 0}
        />
      </Form>
    </Modal>
  )
}
