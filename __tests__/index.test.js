const core = require('@actions/core')
const { main } = require('../src')

const values = {
  base_url: 'https://k7z.example.com',
  api_key: 'sample',
  team_name: 'team',
  project_name: 'project',
  ref: 'main'
}

jest.spyOn(core, 'getInput').mockImplementation(name => values[name])
jest.spyOn(core, 'info').mockImplementation(jest.fn())
jest.spyOn(core, 'setOutput').mockImplementation(jest.fn())
jest.spyOn(core, 'setFailed').mockImplementation(jest.fn())

global.fetch = jest.fn()

describe('GitHub Action', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should make a request and succeed', async () => {
    fetch.mockResolvedValue({
      ok: true,
      status: 200,
      json: jest.fn().mockResolvedValue({ success: true })
    })

    await main()

    expect(fetch).toHaveBeenCalledWith(
      `${values.base_url}/teams/${values.team_name}/projects/${values.project_name}/upgrade`,
      {
        method: 'POST',
        headers: {
          'X-API-Key': values.api_key,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ ref: values.ref })
      }
    )

    expect(core.setOutput).toHaveBeenCalledWith('status', 200)
  })

  it('should fail when API returns an error', async () => {
    fetch.mockResolvedValue({
      ok: false,
      status: 401,
      statusText: 'Unauthorized'
    })

    await main()

    expect(core.setFailed).toHaveBeenCalledWith(
      'Failed to upgrade install: Unauthorized'
    )
  })
})
