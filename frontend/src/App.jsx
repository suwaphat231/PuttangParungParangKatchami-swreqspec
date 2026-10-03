import ReviewStudentDocumentsPage from './pages/ReviewStudentDocumentsPage.jsx'
import { reviewDocumentApi } from './api/client.js'

export default function App({ api = reviewDocumentApi } = {}) {
  return <ReviewStudentDocumentsPage api={api} />
}
