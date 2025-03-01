const core = require('@actions/core')

async function main() {
  try {
    const teamName = core.getInput('team_name')
    const projectName = core.getInput('project_name')
    const apiKey = core.getInput('api_key')
    const baseURL = core.getInput('base_url')
    const ref = core.getInput('ref')
    const dataStr = core.getInput('data')
    const data = dataStr ? JSON.parse(dataStr) : undefined

    const apiKeyHeader = 'X-API-Key'

    const url = new URL(
      `${baseURL}/teams/${encodeURIComponent(teamName)}/projects/${encodeURIComponent(projectName)}/upgrade`
    )

    core.info(
      `Upgrading install ${teamName}/${projectName} at ${url} for ${ref} with ${dataStr}`
    )

    const res = await fetch(url.toString(), {
      method: 'POST',
      headers: {
        [apiKeyHeader]: apiKey,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ ref, data })
    })

    if (!res.ok) {
      throw new Error(`Failed to upgrade install: ${res.statusText}`)
    }

    core.info(`Install ${teamName}/${projectName} upgrade started`)

    core.setOutput('status', res.status)
  } catch (error) {
    core.setFailed(error.message)
  }
}

if (require.main === module) {
  main()
}

module.exports = { main }
