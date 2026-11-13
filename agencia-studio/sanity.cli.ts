import { defineCliConfig } from 'sanity/cli'

export default defineCliConfig({
  api: {
    projectId: 'tu-project-id', // dejá el que ya tenés
    dataset: 'production',
  },
  deployment: {
    appId: 'pbqpqckskbvqdbwbwdsqn29u',
  },
})