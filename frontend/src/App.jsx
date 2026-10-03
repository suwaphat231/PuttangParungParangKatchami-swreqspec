import PaymentTrackingPage from './pages/PaymentTrackingPage.jsx'
import { paymentTrackingApi } from './api/client.js'

export default function App({ api = paymentTrackingApi } = {}) {
  return <PaymentTrackingPage api={api} />
}
