module.exports.datasources = {
  github: {
    measurements: {
      commit: {
        filter: {
          required: [
            'repo'
          ],
          optional: [
            'author'
          ]
        }
      }
    }
  }
}
