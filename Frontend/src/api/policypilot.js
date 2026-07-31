const BASE_URL = 'http://localhost:8000'

export async function askQuestion(question) {
  const res = await fetch(`${BASE_URL}/ask`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ question }),
  })

  if (!res.ok) {
    throw new Error('Failed to get answer')
  }

  return res.json()
}

export async function runSimulation(systemDescription) {
  const res = await fetch(`${BASE_URL}/simulate`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(systemDescription),
  })

  if (!res.ok) {
    throw new Error('Failed to run simulation')
  }

  return res.json()
}
