import mongoose, { Schema } from 'mongoose'

const formuleCoeffSchema = new Schema({
  env: {
    type: Number
  },
  comp: {
    type: Number
  },
  testAuto: {
    type: Number
  },
  testVocal: {
    type: Number
  },
  mask: {
    type: Number
  }
}, {
  timestamps: true,
  toJSON: {
    virtuals: true,
    transform: (obj, ret) => { delete ret._id }
  }
})

formuleCoeffSchema.methods = {
  view (full) {
    const view = {
      // simple view
      id: this.id,
      env: this.env,
      comp: this.comp,
      testAuto: this.testAuto,
      testVocal: this.testVocal,
      mask: this.mask,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    }

    return full ? {
      ...view
      // add properties for a full view
    } : view
  }
}

const model = mongoose.model('FormuleCoeff', formuleCoeffSchema)

export const schema = model.schema
export default model
