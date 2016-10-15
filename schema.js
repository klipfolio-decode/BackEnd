module.exports.datasources = {
  github: {
    measurements: {
      commitLength: {
        filter: {
          required: [
            'repo'
          ],
          optional: [
            'author'
          ]
        }
      }
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
