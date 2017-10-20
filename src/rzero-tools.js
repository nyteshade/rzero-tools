import React, { Component } from 'react'

import { connect } from 'redux-zero'
import { merge } from 'lodash'

/**
 * The decorator specifies the path to the portion of a given store using
 * dot notation. Currently it does not support that value being anything
 * other than a object. Values within the object in question can be of
 * any type.
 *
 * The object referenced in the store will be injected as a prop into the
 * component being wrapped. By default this prop will have the name "page" but
 * if another property name is preferred, it can be specified as a second
 * parameter.
 *
 * Example:
 * ```
 * import React, { Component } from 'react'
 * import { UseStore } from 'rzero-tools'
 * import { createStore } from 'redux-zero'
 *
 * const store = createStore({
 *   pages: {
 *     home: {
 *       name: "Example Home Page Title"
 *     }
 *   }
 * })
 *
 * @UseStore(store, 'pages.home')
 * export class Home extends Component {
 *   render() {
 *     let { page } = this.props
 *
 *     return (
 *       <div>{page.name}</div>
 *     )
 *   }
 * }
 *
 * export default Home
 * ```
 *
 * @export
 * @param {Object} store a data store created with `createStore` imported from
 * 'redux-zero'
 * @param {string} [path=''] a dot separated notation, all of which should be
 * nested objects
 * @param {string} [propName='page'] an optional, alternate, property name
 * under which the portion of the state should be exposed.
 * @returns
 */
export function UseStore(store, path = '', propName = 'page') {
  return (Class) => {
    let _Class = RZeroWrapper(Class, store)

    _Class[Symbol.for('state.path')] = path

    Object.assign(_Class, {
      get selector() {
        return (state, props, ...args) => {
          if (Class.selector) {
            return Class.selector(state, props, ...args)
          }
          else {
            if (!path.length) {
              return state;
            }

            // eslint-disable-next-line
            return eval(`(state.${path})`)
          }
        }
      }
    })

    return connect(
      (...args) => { return { [propName]: _Class.selector(...args) } }
    )(_Class)
  }
}

/**
 * Given a string path, it creates a new object with the appropriate nested
 * structures indicated by the path string.
 *
 * @export
 * @param {any} path a path of "some.thing" would create an object like
 * `{some: { thing: {}}}`
 * @param {any} [o={}] by default the object with the new structures is a
 * new object literal, but if another object is provide, the structures are
 * added to the supplied object instead
 * @returns {Object} either a new object with the new structures supplied or
 * the supplied object that was modified
 */
export function buildBase(path, o = {}) {
  let parts = (path || '').split('.');

  parts.forEach((_,i,a) => {
    let code = `(o.${a.slice(0, i + 1).join('.')} = {})`

    // eslint-disable-next-line
    return eval(code)
  });
  return o;
}

/**
 * A high order component (HOC) wrapper that receives an `updateState()` prop
 * function and the portion of the store as specified by the `path` variable
 * supplied in the decorator.
 *
 * @export
 * @param {Function} Child the class that should be wrapped
 * @param {Object} store a store created by `redux-zero`'s `createStore`
 * method
 * @returns {class<RZeroWrapper>} the class that renders whats inside
 */
export function RZeroWrapper(Child, store) {
  return class WrappedReactZeroComponent extends Component {
    render() {
      return (
        <Child
          {...this.props}
          {...this.state}
          updateState={(changes) => {
            let state = this.props.store.getState();
            let obase = buildBase(this.constructor[Symbol.for('state.path')])
            let delta;

            Object.assign(this.constructor.selector(obase), changes);
            delta = merge({}, state, obase)

            store.setState(delta)
          }}
        >{this.props.children}</Child>
      )
    }
  }
}

export default {
  UseStore,
  buildBase,
  RZeroWrapper
}
