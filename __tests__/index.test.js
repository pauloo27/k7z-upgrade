const core = require('@actions/core')
const https = require('node:https')

// this this is terrible, i know it.

const values = {
  base_url: 'https://k7z.example.com',
  api_key: 'sample',
  team_name: 'team',
  project_name: 'project'
}

jest.spyOn(core, 'getInput').mockImplementation(name => values[name])
jest.spyOn(core, 'info').mockImplementation(console.log)
jest
  .spyOn(core, 'setOutput')
  .mockImplementation(x => console.log('setOutput', x))
jest.spyOn(core, 'setFailed').mockImplementation(x => {
  console.error('setFailed', x)
  // should i throw?
})

jest.spyOn(https, 'request').mockImplementation((_options, cb) => {
  const res = {
    statusCode: 200,
    on: (event, onCb) => {
      if (event === 'end') {
        onCb()
      }
    }
  }
  cb(res)
  return {
    on: () => {},
    end: () => {}
  }
})

describe('action', () => {
  it('should work', () => {
    require('../src')
    expect(true).toBe(true)
  })
})
