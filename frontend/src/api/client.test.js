import { afterEach, vi } from 'vitest'
import { workerStatusApi } from './client.js'

afterEach(() => vi.unstubAllGlobals())

test('T-15 calls UC-13 routes without sending role as user input', async () => {
  const fetchMock = vi.fn().mockResolvedValue({ ok: true, json: async () => [] })
  vi.stubGlobal('fetch', fetchMock)

  await workerStatusApi.listWorkers({ student_id: '001', department_id: 'department-b' })

  expect(fetchMock).toHaveBeenCalledWith(
    '/api/uc13/workers?student_id=001&department_id=department-b',
  )
})