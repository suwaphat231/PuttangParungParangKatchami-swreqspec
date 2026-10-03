import WorkerStatusPage from './pages/WorkerStatusPage.jsx'
import { workerStatusApi } from './api/client.js'

export default function App({ api = workerStatusApi } = {}) {
  return <WorkerStatusPage api={api} />
}
