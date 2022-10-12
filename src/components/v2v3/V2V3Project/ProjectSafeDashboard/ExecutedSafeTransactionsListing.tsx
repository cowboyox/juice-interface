import { useExecutedSafeTransactions } from 'hooks/safe/ExecutedSafeTransaction'
import { GnosisSafe, SafeTransactionType } from 'models/safe'
import { getUniqueNonces } from 'utils/safe'
import { SafeNonceRow } from './SafeNonceRow'

export function ExecutedSafeTransactionsListing({
  safe,
  selectedTx,
}: {
  safe: GnosisSafe
  selectedTx: string | undefined
}) {
  const { data: executedSafeTransactions, isLoading } =
    useExecutedSafeTransactions({
      safeAddress: safe.address,
    })

  const uniqueNonces = getUniqueNonces(executedSafeTransactions)

  if (isLoading) {
    return <div style={{ marginTop: 20 }}>Loading...</div>
  }

  return (
    <>
      {uniqueNonces?.map((nonce: number, idx: number) => {
        const transactionsOfNonce: SafeTransactionType[] =
          executedSafeTransactions.filter(
            (tx: SafeTransactionType) => tx.nonce === nonce && tx.dataDecoded,
          )

        if (!transactionsOfNonce.length) return

        return (
          <SafeNonceRow
            key={`safe-${nonce}-${idx}`}
            nonce={nonce}
            transactions={transactionsOfNonce}
            safeThreshold={safe.threshold}
            selectedTx={selectedTx}
          />
        )
      })}
    </>
  )
}
