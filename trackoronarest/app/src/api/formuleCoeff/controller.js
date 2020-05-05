import { success, notFound } from '../../services/response/'
import { FormuleCoeff } from '.'

export const create = ({ bodymen: { body } }, res, next) =>
  FormuleCoeff.create(body)
    .then((formuleCoeff) => formuleCoeff.view(true))
    .then(success(res, 201))
    .catch(next)

export const index = ({ querymen: { query, select, cursor } }, res, next) =>
  FormuleCoeff.count(query)
    .then(count => FormuleCoeff.find(query, select, cursor)
      .then((formuleCoeffs) => ({
        count,
        rows: formuleCoeffs.map((formuleCoeff) => formuleCoeff.view())
      }))
    )
    .then(success(res))
    .catch(next)

export const show = ({ params }, res, next) =>
  FormuleCoeff.findById(params.id)
    .then(notFound(res))
    .then((formuleCoeff) => formuleCoeff ? formuleCoeff.view() : null)
    .then(success(res))
    .catch(next)

export const update = ({ bodymen: { body }, params }, res, next) =>
  FormuleCoeff.findById(params.id)
    .then(notFound(res))
    .then((formuleCoeff) => formuleCoeff ? Object.assign(formuleCoeff, body).save() : null)
    .then((formuleCoeff) => formuleCoeff ? formuleCoeff.view(true) : null)
    .then(success(res))
    .catch(next)

export const destroy = ({ params }, res, next) =>
  FormuleCoeff.findById(params.id)
    .then(notFound(res))
    .then((formuleCoeff) => formuleCoeff ? formuleCoeff.remove() : null)
    .then(success(res, 204))
    .catch(next)
