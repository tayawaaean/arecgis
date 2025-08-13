const path = require('path')
let mod = require('jest-openapi')
const jestOpenAPI = mod && mod.default ? mod.default : mod

const specPath = path.join(__dirname, '..', 'openapi.yaml')
jestOpenAPI(specPath)


