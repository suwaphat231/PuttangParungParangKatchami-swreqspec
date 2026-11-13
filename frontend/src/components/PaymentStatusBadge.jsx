export default function PaymentStatusBadge({ status, flagged = false }) {
  const variant = status === 'จ่ายแล้ว' ? 'paid' : flagged ? 'flagged' : 'normal'

  return (
    <span
      className={`payment-status payment-status-${variant}`}
      data-flagged={flagged ? 'true' : 'false'}
      aria-label={status}
    >
      {status}
    </span>
  )
}
