import { hello } from './hello'

test('can say hello', () => {
  expect(hello()).toBe('Hello from dummy!')
})
