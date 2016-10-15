module.exports.datasources = [
  {
    datasource: 'github',
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
]
