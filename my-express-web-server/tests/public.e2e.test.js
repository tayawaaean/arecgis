const request = require('supertest')
const app = require('../app')

describe('Public APIs', () => {
  test('GET /publicBlogs returns 200 or 400', async () => {
    const res = await request(app).get('/publicBlogs')
    expect([200, 400]).toContain(res.statusCode)
  })

  test('GET /publicInventories returns 200 or 400', async () => {
    const res = await request(app).get('/publicInventories')
    expect([200, 400]).toContain(res.statusCode)
  })
})


