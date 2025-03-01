"use strict";var a=Object.defineProperty;var v=Object.getOwnPropertyDescriptor;var w=Object.getOwnPropertyNames;var k=Object.prototype.hasOwnProperty;var f=(i,e)=>{for(var n in e)a(i,n,{get:e[n],enumerable:!0})},E=(i,e,n,t)=>{if(e&&typeof e=="object"||typeof e=="function")for(let l of w(e))!k.call(i,l)&&l!==n&&a(i,l,{get:()=>e[l],enumerable:!(t=v(e,l))||t.enumerable});return i};var _=i=>E(a({},"__esModule",{value:!0}),i);var O={};f(O,{Log:()=>s,LogLevel:()=>c,log:()=>F,tag:()=>h});module.exports=_(O);/**
 * @author Ray Martone
 * @copyright Copyright (c) 2019-2025 Ray Martone
 * @license MIT
 * @description Log adapter providing level-based filtering and tagging.
 */var c=(o=>(o.TRACE="TRACE",o.DEBUG="DEBUG",o.INFO="INFO",o.WARN="WARN",o.ERROR="ERROR",o.OFF="OFF",o))(c||{}),g="default",r=new Set,h=new Proxy({},{get(i,e){if(typeof e=="string"&&r.has(e))return e},ownKeys(){return Array.from(r)},getOwnPropertyDescriptor(){return{enumerable:!0,configurable:!0}}}),R=new Map([[1,"TRACE"],[2,"DEBUG"],[3,"INFO"],[4,"WARN"],[5,"ERROR"],[6,"OFF"]]),s=class{_defaultLevel=3;_tagToLevel=new Map;_callback;init(e,n){if(e)for(let t in e){let l=e[t];R.has(l)?t===g?this._defaultLevel=l:(this._tagToLevel.set(t,l),r.add(t)):(console.warn(`Invalid log level "${l}" for tag "${t}". Using default (${R.get(this._defaultLevel)}).`),this._tagToLevel.set(t,this._defaultLevel),r.add(t))}return n!==void 0&&(this._callback=n),this}_log(e,n,...t){if(!this._callback)return;let l,u,o;typeof n=="string"&&r.has(n)?(l=n,u=t.length>0?t[0]:void 0,o=t.slice(1)):(l=g,u=n,o=t);let d=this._tagToLevel.get(l)??this._defaultLevel;e<d||this._callback(R.get(e),l,u,o)}log(e,...n){this._log(3,e,...n)}debug(e,...n){this._log(2,e,...n)}error(e,...n){this._log(5,e,...n)}info(e,...n){this._log(3,e,...n)}trace(e,...n){this._log(1,e,...n)}warn(e,...n){this._log(4,e,...n)}},F=new s;0&&(module.exports={Log,LogLevel,log,tag});
//# sourceMappingURL=index.cjs.js.map
