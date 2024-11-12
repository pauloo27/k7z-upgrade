const core = require('@actions/core')

async function main() {
  try {
    const teamName = core.getInput('team_name')
    const projectName = core.getInput('project_name')
    const apiKey = core.getInput('api_key')
    const baseURL = core.getInput('base_url')
    const ref = core.getInput('ref')

    const apiKeyHeader = 'X-API-Key'

    const url = new URL(
      `${baseURL}/teams/${encodeURIComponent(teamName)}/projects/${encodeURIComponent(projectName)}/upgrade`
    )

    core.info(
      `Upgrading install ${teamName}/${projectName} at ${url} for ${ref}`
    )

    const res = await fetch(url, {
      method: 'POST',
      headers: {
        [apiKeyHeader]: apiKey,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ ref })
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

main()
