import request from 'supertest'
import { masterKey, apiRoot } from '../../config'
import express from '../../services/express'
import routes, { FormuleCoeff } from '.'

const app = () => express(apiRoot, routes)

let formuleCoeff

beforeEach(async () => {
  formuleCoeff = await FormuleCoeff.create({})
})

test('POST /formuleCoeffs 201 (master)', async () => {
  const { status, body } = await request(app())
    .post(`${apiRoot}`)
    .send({ access_token: masterKey, env: 'test', comp: 'test', testAuto: 'test', testVocal: 'test', mask: 'test' })
  expect(status).toBe(201)
  expect(typeof body).toEqual('object')
  expect(body.env).toEqual('test')
  expect(body.comp).toEqual('test')
  expect(body.testAuto).toEqual('test')
  expect(body.testVocal).toEqual('test')
  expect(body.mask).toEqual('test')
})

test('POST /formuleCoeffs 401', async () => {
  const { status } = await request(app())
    .post(`${apiRoot}`)
  expect(status).toBe(401)
})

test('GET /formuleCoeffs 200 (master)', async () => {
  const { status, body } = await request(app())
    .get(`${apiRoot}`)
    .query({ access_token: masterKey })
  expect(status).toBe(200)
  expect(Array.isArray(body.rows)).toBe(true)
  expect(Number.isNaN(body.count)).toBe(false)
})

test('GET /formuleCoeffs 401', async () => {
  const { status } = await request(app())
    .get(`${apiRoot}`)
  expect(status).toBe(401)
})

test('GET /formuleCoeffs/:id 200 (master)', async () => {
  const { status, body } = await request(app())
    .get(`${apiRoot}/${formuleCoeff.id}`)
    .query({ access_token: masterKey })
  expect(status).toBe(200)
  expect(typeof body).toEqual('object')
  expect(body.id).toEqual(formuleCoeff.id)
})

test('GET /formuleCoeffs/:id 401', async () => {
  const { status } = await request(app())
    .get(`${apiRoot}/${formuleCoeff.id}`)
  expect(status).toBe(401)
})

test('GET /formuleCoeffs/:id 404 (master)', async () => {
  const { status } = await request(app())
    .get(apiRoot + '/123456789098765432123456')
    .query({ access_token: masterKey })
  expect(status).toBe(404)
})

test('PUT /formuleCoeffs/:id 200 (master)', async () => {
  const { status, body } = await request(app())
    .put(`${apiRoot}/${formuleCoeff.id}`)
    .send({ access_token: masterKey, env: 'test', comp: 'test', testAuto: 'test', testVocal: 'test', mask: 'test' })
  expect(status).toBe(200)
  expect(typeof body).toEqual('object')
  expect(body.id).toEqual(formuleCoeff.id)
  expect(body.env).toEqual('test')
  expect(body.comp).toEqual('test')
  expect(body.testAuto).toEqual('test')
  expect(body.testVocal).toEqual('test')
  expect(body.mask).toEqual('test')
})

test('PUT /formuleCoeffs/:id 401', async () => {
  const { status } = await request(app())
    .put(`${apiRoot}/${formuleCoeff.id}`)
  expect(status).toBe(401)
})

test('PUT /formuleCoeffs/:id 404 (master)', async () => {
  const { status } = await request(app())
    .put(apiRoot + '/123456789098765432123456')
    .send({ access_token: masterKey, env: 'test', comp: 'test', testAuto: 'test', testVocal: 'test', mask: 'test' })
  expect(status).toBe(404)
})

test('DELETE /formuleCoeffs/:id 204 (master)', async () => {
  const { status } = await request(app())
    .delete(`${apiRoot}/${formuleCoeff.id}`)
    .query({ access_token: masterKey })
  expect(status).toBe(204)
})

test('DELETE /formuleCoeffs/:id 401', async () => {
  const { status } = await request(app())
    .delete(`${apiRoot}/${formuleCoeff.id}`)
  expect(status).toBe(401)
})

test('DELETE /formuleCoeffs/:id 404 (master)', async () => {
  const { status } = await request(app())
    .delete(apiRoot + '/123456789098765432123456')
    .query({ access_token: masterKey })
  expect(status).toBe(404)
})
