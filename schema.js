module.exports.datasources = {
  github: {
    measurements: [
      {
        name: 'commit',
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
    ]
  }
}
