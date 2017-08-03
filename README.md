# good-snag

`good-snag` is a transform stream for sending events to [Bugsnag](https://www.bugsnag.com/)

## Usage

```
plugin: {
  register: 'good',
  options: {
    ops: {
      interval: 1000,
    },
    reporters: {
      bugsnag: [
        {
          module: 'good-squeeze',
          name: 'Squeeze',
          args: [
            {
              log: 'error',
              error: '*',
              request: 'error',
            },
          ],
        },
        {
          module: 'good-snag',
          args: [
            {
              apiKey: 'API_KEY_HERE',
            },
          ],
        },
      ],
    },
  },
},
```
