const request = require('supertest')
const app = require('../app')

describe('System probes', () => {
  test('GET /livez returns 200', async () => {
    const res = await request(app).get('/livez')
    expect(res.statusCode).toBe(200)
  })

  test('GET /readyz returns 200 or 503', async () => {
    const res = await request(app).get('/readyz')
    expect([200, 503]).toContain(res.statusCode)
  })

  test('GET /healthz returns 200 or 503', async () => {
    const res = await request(app).get('/healthz')
    expect([200, 503]).toContain(res.statusCode)
  })
})


