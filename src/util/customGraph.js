export class CustomGraph {
  constructor(provider) {
    this.provider = provider
  }

  async api(path) {
    if (path.endsWith('/photo')) {
      try {
        return await this.provider.graph.client.api(path).get()
      } catch (err) {
        if (err.statusCode === 404) {
          // Suppress the error or return a default
          return null
        }
        throw err
      }
    }

    return this.provider.graph.client.api(path)
  }
}
