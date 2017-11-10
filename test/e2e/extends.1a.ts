export const input = {
  title: 'Extends',
  type: 'object',
  extends: {
    $ref: 'test/resources/BaseType.1.json'
  },
  properties: {
    foo: {
      type: 'string'
    }
  },
  required: ['foo'],
  additionalProperties: false
}

export const options = {
  declareExternallyReferenced: true
}
