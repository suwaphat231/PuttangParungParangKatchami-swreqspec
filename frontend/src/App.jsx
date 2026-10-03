import CreateAnnouncementPage from './pages/CreateAnnouncementPage.jsx'
import { announcementApi } from './api/client.js'

export default function App({ api = announcementApi } = {}) {
  return <CreateAnnouncementPage api={api} />
}
