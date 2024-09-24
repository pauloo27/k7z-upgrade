const core = require('@actions/core')
const https = require('node:https')

try {
  const teamName = core.getInput('team_name')
  const projectName = core.getInput('project_name')
  const apiKey = core.getInput('api_key')
  const baseURL = core.getInput('base_url')
  const apiKeyHeader = 'X-API-Key'

  const url = new URL(
    `${baseURL}/teams/${teamName}/projects/${projectName}/upgrade`
  )

  core.info(`Upgrading install ${teamName}/${projectName} at ${url}`)

  const req = https.request(
    {
      method: 'POST',
      hostname: url.hostname,
      path: url.pathname,
      headers: {
        [apiKeyHeader]: apiKey
      }
    },

    res => {
      const statusCode = res.statusCode
      if (statusCode === 200) {
        core.setOutput('status', statusCode)
      } else {
        core.setFailed(`Request failed with status code ${statusCode}`)
      }
    }
  )

  req.on('error', error => {
    core.setFailed(error.message)
  })

  req.end()
} catch (error) {
  core.setFailed(error.message)
}
