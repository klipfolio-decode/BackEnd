module.exports.datasources = {
  github: {
    measurements: {
      commit: {
        filter: {
          required: [
            'username',
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
