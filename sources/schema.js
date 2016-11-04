module.exports.datasources = {
  github: {
    measurements: {
      commitLength: {
        filter: {
          required: [
            'repo',
            'owner'
          ],
          optional: [
            'author'
          ]
        }
      },
      commit: {
        filter: {
          required: [
            'repo',
            'owner'
          ],
          optional: [
            'author'
          ]
        }
      }
    }
  }
}
