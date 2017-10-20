'use strict';Object.defineProperty(exports,'__esModule',{value:true});var _extends=Object.assign||function(target){for(var i=1;i<arguments.length;i++){var source=arguments[i];for(var key in source){if(Object.prototype.hasOwnProperty.call(source,key)){target[key]=source[key]}}}return target};var _createClass=function(){function defineProperties(target,props){for(var i=0;i<props.length;i++){var descriptor=props[i];descriptor.enumerable=descriptor.enumerable||false;descriptor.configurable=true;if('value'in descriptor)descriptor.writable=true;Object.defineProperty(target,descriptor.key,descriptor)}}return function(Constructor,protoProps,staticProps){if(protoProps)defineProperties(Constructor.prototype,protoProps);if(staticProps)defineProperties(Constructor,staticProps);return Constructor}}();exports.UseStore=UseStore;exports.buildBase=buildBase;exports.RZeroWrapper=RZeroWrapper;var _react=require('react');var _react2=_interopRequireDefault(_react);var _reduxZero=require('redux-zero');var _lodash=require('lodash');function _interopRequireDefault(obj){return obj&&obj.__esModule?obj:{default:obj}}function _classCallCheck(instance,Constructor){if(!(instance instanceof Constructor)){throw new TypeError('Cannot call a class as a function')}}function _possibleConstructorReturn(self,call){if(!self){throw new ReferenceError('this hasn\'t been initialised - super() hasn\'t been called')}return call&&(typeof call==='object'||typeof call==='function')?call:self}function _inherits(subClass,superClass){if(typeof superClass!=='function'&&superClass!==null){throw new TypeError('Super expression must either be null or a function, not '+typeof superClass)}subClass.prototype=Object.create(superClass&&superClass.prototype,{constructor:{value:subClass,enumerable:false,writable:true,configurable:true}});if(superClass)Object.setPrototypeOf?Object.setPrototypeOf(subClass,superClass):subClass.__proto__=superClass}function _defineProperty(obj,key,value){if(key in obj){Object.defineProperty(obj,key,{value:value,enumerable:true,configurable:true,writable:true})}else{obj[key]=value}return obj}/**
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
 */function UseStore(store){var path=arguments.length>1&&arguments[1]!==undefined?arguments[1]:'';var propName=arguments.length>2&&arguments[2]!==undefined?arguments[2]:'page';return function(Class){var _Class=RZeroWrapper(Class,store);_Class[Symbol.for('state.path')]=path;Object.assign(_Class,{get selector(){return function(state,props){for(var _len=arguments.length,args=Array(_len>2?_len-2:0),_key=2;_key<_len;_key++){args[_key-2]=arguments[_key]}if(Class.selector){return Class.selector.apply(Class,[state,props].concat(args))}else{if(!path.length){return state}// eslint-disable-next-line
return eval('(state.'+path+')')}}}});return(0,_reduxZero.connect)(function(){return _defineProperty({},propName,_Class.selector.apply(_Class,arguments))})(_Class)}}/**
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
 */function buildBase(path){var o=arguments.length>1&&arguments[1]!==undefined?arguments[1]:{};var parts=(path||'').split('.');parts.forEach(function(_,i,a){var code='(o.'+a.slice(0,i+1).join('.')+' = {})';// eslint-disable-next-line
return eval(code)});return o}/**
 * A high order component (HOC) wrapper that receives an `updateState()` prop
 * function and the portion of the store as specified by the `path` variable
 * supplied in the decorator.
 *
 * @export
 * @param {Function} Child the class that should be wrapped
 * @param {Object} store a store created by `redux-zero`'s `createStore`
 * method
 * @returns {class<RZeroWrapper>} the class that renders whats inside
 */function RZeroWrapper(Child,store){return function(_Component){_inherits(WrappedReactZeroComponent,_Component);function WrappedReactZeroComponent(){_classCallCheck(this,WrappedReactZeroComponent);return _possibleConstructorReturn(this,(WrappedReactZeroComponent.__proto__||Object.getPrototypeOf(WrappedReactZeroComponent)).apply(this,arguments))}_createClass(WrappedReactZeroComponent,[{key:'render',value:function render(){var _this2=this;return _react2.default.createElement(Child,_extends({},this.props,this.state,{updateState:function updateState(changes){var state=_this2.props.store.getState();var obase=buildBase(_this2.constructor[Symbol.for('state.path')]);var delta=void 0;Object.assign(_this2.constructor.selector(obase),changes);delta=(0,_lodash.merge)({},state,obase);store.setState(delta)}}),this.props.children)}}]);return WrappedReactZeroComponent}(_react.Component)}exports.default={UseStore:UseStore,buildBase:buildBase,RZeroWrapper:RZeroWrapper};
//# sourceMappingURL=rzero-tools.js.map