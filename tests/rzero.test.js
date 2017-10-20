import React, { Component } from 'react'
import { UseStore } from '../src/rzero-tools'
import { createStore, Provider } from 'redux-zero'
import { configure, mount, shallow } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16';

configure({ adapter: new Adapter() });

describe('HOC correctly wraps the supplied Component', () => {

  const store = createStore({
    pages: {
      home: {
        name: "Example"
      }
    }
  })

  let propsUpdateStatePresent;
  let propsProperStateSlice;
  let propsStateSliceRenamed;
  let propsInitialValueReceived;
  let propsUpdatePropagates;

  @UseStore(store, 'pages.home')
  class Home extends Component {
    render() {
      propsUpdateStatePresent = !!this.props.updateState
      propsProperStateSlice = this.props.page.name == 'Example'

      let { page } = this.props

      return (
        <div>{page.name}</div>
      )
    }
  }

  @UseStore(store, 'pages.home', 'work')
  class Work extends Component {
    constructor(...args) {
      super(...args)

      propsInitialValueReceived = undefined;
      propsUpdatePropagates = {}
      propsUpdatePropagates.promise = new Promise((res, rej) => {
        propsUpdatePropagates.resolve = res;
        propsUpdatePropagates.reject = rej;
      })
    }

    componentDidMount() {
      setTimeout(() => {
        this.props.updateState({name: 'Example!'})
        setTimeout(() => propsUpdatePropagates.resolve(this.props.work), 0);
      }, 20)
    }

    render() {
      let { work } = this.props || {}

      if (propsInitialValueReceived == undefined)
        propsInitialValueReceived = work.name == 'Example'

      propsStateSliceRenamed = work.name == "Example" || work.name == "Example!"

      return (
        <div>{work.name}</div>
      )
    }
  }

  const stack = (
    <Provider store={store}><Home/></Provider>
  )

  const stack2 = (
    <Provider store={store}><Work/></Provider>
  )

  it('should generate output as expected after being decorated', () => {
    let wrapper = mount(stack);

    expect(wrapper.contains(<div>Example</div>)).toEqual(true)
  })

  it('should have injected values when component is mounted', () => {
    propsUpdateStatePresent = false;
    propsProperStateSlice = false;

    let wrapper = mount(stack);

    expect(propsUpdateStatePresent).toBe(true)
    expect(propsProperStateSlice).toBe(true)
  })

  it('should support renaming the props variable', () => {
    propsStateSliceRenamed = false

    let wrapper = mount(stack2)

    expect(propsStateSliceRenamed).toBe(true)
  })

  it('should support updating a value', async () => {
    let wrapper = mount(stack2)
    expect(propsInitialValueReceived).toBe(true)

    let work = await propsUpdatePropagates.promise;
    expect(work.name).toBe('Example!')
  })
})
