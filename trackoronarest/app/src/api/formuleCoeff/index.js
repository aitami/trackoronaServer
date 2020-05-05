import { Router } from 'express'
import { middleware as query } from 'querymen'
import { middleware as body } from 'bodymen'
import { master } from '../../services/passport'
import { create, index, show, update, destroy } from './controller'
import { schema } from './model'
export FormuleCoeff, { schema } from './model'

const router = new Router()
const { env, comp, testAuto, testVocal, mask } = schema.tree

/**
 * @api {post} /formuleCoeffs Create formule coeff
 * @apiName CreateFormuleCoeff
 * @apiGroup FormuleCoeff
 * @apiPermission master
 * @apiParam {String} access_token master access token.
 * @apiParam env Formule coeff's env.
 * @apiParam comp Formule coeff's comp.
 * @apiParam testAuto Formule coeff's testAuto.
 * @apiParam testVocal Formule coeff's testVocal.
 * @apiParam mask Formule coeff's mask.
 * @apiSuccess {Object} formuleCoeff Formule coeff's data.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 404 Formule coeff not found.
 * @apiError 401 master access only.
 */
router.post('/',
  master(),
  body({ env, comp, testAuto, testVocal, mask }),
  create)

/**
 * @api {get} /formuleCoeffs Retrieve formule coeffs
 * @apiName RetrieveFormuleCoeffs
 * @apiGroup FormuleCoeff
 * @apiPermission master
 * @apiParam {String} access_token master access token.
 * @apiUse listParams
 * @apiSuccess {Number} count Total amount of formule coeffs.
 * @apiSuccess {Object[]} rows List of formule coeffs.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 401 master access only.
 */
router.get('/',
  master(),
  query(),
  index)

/**
 * @api {get} /formuleCoeffs/:id Retrieve formule coeff
 * @apiName RetrieveFormuleCoeff
 * @apiGroup FormuleCoeff
 * @apiPermission master
 * @apiParam {String} access_token master access token.
 * @apiSuccess {Object} formuleCoeff Formule coeff's data.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 404 Formule coeff not found.
 * @apiError 401 master access only.
 */
router.get('/:id',
  master(),
  show)

/**
 * @api {put} /formuleCoeffs/:id Update formule coeff
 * @apiName UpdateFormuleCoeff
 * @apiGroup FormuleCoeff
 * @apiPermission master
 * @apiParam {String} access_token master access token.
 * @apiParam env Formule coeff's env.
 * @apiParam comp Formule coeff's comp.
 * @apiParam testAuto Formule coeff's testAuto.
 * @apiParam testVocal Formule coeff's testVocal.
 * @apiParam mask Formule coeff's mask.
 * @apiSuccess {Object} formuleCoeff Formule coeff's data.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 404 Formule coeff not found.
 * @apiError 401 master access only.
 */
router.put('/:id',
  master(),
  body({ env, comp, testAuto, testVocal, mask }),
  update)

/**
 * @api {delete} /formuleCoeffs/:id Delete formule coeff
 * @apiName DeleteFormuleCoeff
 * @apiGroup FormuleCoeff
 * @apiPermission master
 * @apiParam {String} access_token master access token.
 * @apiSuccess (Success 204) 204 No Content.
 * @apiError 404 Formule coeff not found.
 * @apiError 401 master access only.
 */
router.delete('/:id',
  master(),
  destroy)

export default router
