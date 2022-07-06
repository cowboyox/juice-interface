import { PaymentMemoSticker } from './paymentMemoSticker'

export const AttachableSticker = ({
  sticker,
  onClick,
}: {
  sticker: PaymentMemoSticker
  onClick: VoidFunction
}) => {
  return (
    <div
      role="button"
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'middle',
        padding: '20px 0',
        cursor: 'pointer',
      }}
      className="hover-bg-l2"
      onClick={onClick}
    >
      <img src={sticker.filepath} alt={sticker.alt} height="75px" />
    </div>
  )
}
