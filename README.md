# Merdux

> Opinionated Redux abstraction

- Composable with classic actions, reducers and middlewares (thunk, saga, etc). Can be integrated into existing architecture without breaking anything
- Fully typed
- Actions and reducers are replaced by "effects" that are easier to write
- Hooks and types for use with react-redux

## Installation

```bash
npm install merdux
```

## Prepare a store

### Initial state

### Effects

### Add to redux store

### Connect to components

## Know drawbacks

- Actions are isolated to their local stores and cannot be intercepted by other reducers. To do that, you can use good old Redux actions and reducers.
