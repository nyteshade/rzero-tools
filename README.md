# Redux-Zero Tools (rzero-tools) [![MIT license](https://img.shields.io/badge/License-MIT-blue.svg)](https://lbesson.mit-license.org/) ![package version](https://img.shields.io/badge/dynamic/json.svg?label=version&uri=https%3A%2F%2Fraw.githubusercontent.com%2Fnyteshade%2Frzero-tools%2Fmaster%2Fpackage.json&query=version&colorB=1d7ebe)

## Overview
I was recently reviewing `redux-zero` and the tool seems to seriously take the
strain off using `redux` given the massive amount of boiler plate that tool
requests its users provide.
Though redux-zero was a breath of fresh air, as are many tools that cut out the
cruft, it was also missing some convenience that once achieves when finally
getting redux setup in your project.
The biggest missing part was being able to receive only the slice of your store
that you need and being able to update that piece as easily.

### Installation
Add the module as a dependency to your application

```bash
npm install --save rzero-tools
```

### Usage
As a fan of using ES7 style decorators, I felt that it might make more sense
to provide a single decorator to solve this issue. The decorator goes before
your react component and takes a reference to your store, and a dot separated
string denoting the path to your slice of the store.

A complete example can be shown here:

```javascript
import React, { Component } from 'react'
import { render } from 'react-dom'
import { UseStore } from 'rzero-tools'
import { createStore, Provider } from 'redux-zero/react'

const store = createStore({
  pages: {
    home: {
      name: "Example Home Page Title"
    }
  }
})

@UseStore(store, 'pages.home', 'page')
class Home extends Component {
  changeName() {
    this.props.updateState({name: 'A contrived title'})
  }

  render() {
    // The default injected variable is called page, so the third parameter
    // to the decorator can be omitted if the property name "page" is
    // acceptable. Otherwise, modify this to be what you want.
    let { page } = this.props

    // Note that if you invoked this.changeName() via a timeout or click,
    // it would fire an update that only modified the state.pages.home object
    // as specified in the path of the @UseStore decorator.

    return (
      {/* As you might imagine this is "Example Home Page Title" */}
      <div>{page.name}</div>
    )
  }
}

render(
  <Provider store={store}><Home/></Provider>,
  document.querySelector('#react-root')
)
```

The important bit above is the decorator, `@UseStore()`, used to connect the
component to the store as well as being able to read and write to specific part
of the store.

A noteworthy callout is the fact that by simply specifying `'pages.home'`, the
component is given the part of the store that maps to
`store.getState().pages.home`.

If the path is left off or is supplied as an empty string, then the entire
state is supplied.

#### Caveats / TODOs
**Important**

 1. Currently, due to the way this was built, the path specified in the store should all consist of objects or **bad** things will happen to your store.
 2. There may be a way to refactor things in the future, perhaps in a 2.0 release, where the store does not have to be passed to the decorator.

These would be ideal and if I continue to use `redux-zero` I'll focus on these
two points as my primay next steps.
