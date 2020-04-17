import { FormuleCoeff } from '.'

let formuleCoeff

beforeEach(async () => {
  formuleCoeff = await FormuleCoeff.create({ env: 'test', comp: 'test', testAuto: 'test', testVocal: 'test', mask: 'test' })
})

describe('view', () => {
  it('returns simple view', () => {
    const view = formuleCoeff.view()
    expect(typeof view).toBe('object')
    expect(view.id).toBe(formuleCoeff.id)
    expect(view.env).toBe(formuleCoeff.env)
    expect(view.comp).toBe(formuleCoeff.comp)
    expect(view.testAuto).toBe(formuleCoeff.testAuto)
    expect(view.testVocal).toBe(formuleCoeff.testVocal)
    expect(view.mask).toBe(formuleCoeff.mask)
    expect(view.createdAt).toBeTruthy()
    expect(view.updatedAt).toBeTruthy()
  })

  it('returns full view', () => {
    const view = formuleCoeff.view(true)
    expect(typeof view).toBe('object')
    expect(view.id).toBe(formuleCoeff.id)
    expect(view.env).toBe(formuleCoeff.env)
    expect(view.comp).toBe(formuleCoeff.comp)
    expect(view.testAuto).toBe(formuleCoeff.testAuto)
    expect(view.testVocal).toBe(formuleCoeff.testVocal)
    expect(view.mask).toBe(formuleCoeff.mask)
    expect(view.createdAt).toBeTruthy()
    expect(view.updatedAt).toBeTruthy()
  })
})
