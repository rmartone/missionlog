"use strict";var u=Object.defineProperty;var R=Object.getOwnPropertyDescriptor;var _=Object.getOwnPropertyNames;var f=Object.prototype.hasOwnProperty;var E=(r,e)=>{for(var t in e)u(r,t,{get:e[t],enumerable:!0})},p=(r,e,t,n)=>{if(e&&typeof e=="object"||typeof e=="function")for(let l of _(e))!f.call(r,l)&&l!==t&&u(r,l,{get:()=>e[l],enumerable:!(n=R(e,l))||n.enumerable});return r};var k=r=>p(u({},"__esModule",{value:!0}),r);var w={};E(w,{DEFAULT_TAG:()=>a,Log:()=>c,LogLevel:()=>d,log:()=>C,tag:()=>b});module.exports=k(w);/**
 * @module missionlog
 * @author Ray Martone
 * @copyright Copyright (c) 2019-2025 Ray Martone
 * @license MIT
 * @description A lightweight TypeScript logger providing level-based filtering and tagging capabilities.
 * missionlog is designed as a drop-in replacement for console.log with additional features for
 * categorizing and filtering logs by severity levels and custom tags.
 *
 * Key features:
 * - Type safety with LogMessage and LogConfig interfaces
 * - Performance optimizations with level caching
 * - Enhanced API with structured logging support via EnhancedLogCallback
 * - Fully chainable API with all methods returning the logger instance
 * - Level checking with isLevelEnabled() and configuration reset()
 * - Full backward compatibility with existing logging patterns
 */var d=(s=>(s.TRACE="TRACE",s.DEBUG="DEBUG",s.INFO="INFO",s.WARN="WARN",s.ERROR="ERROR",s.OFF="OFF",s))(d||{}),a="*",o=new Set,b=new Proxy({},{get(r,e){if(typeof e=="string"&&o.has(e))return e},ownKeys(){return Array.from(o)},getOwnPropertyDescriptor(){return{enumerable:!0,configurable:!0}}}),g=new Map([[1,"TRACE"],[2,"DEBUG"],[3,"INFO"],[4,"WARN"],[5,"ERROR"],[6,"OFF"]]),L=new Map([["TRACE",1],["DEBUG",2],["INFO",3],["WARN",4],["ERROR",5],["OFF",6]]),c=class{_defaultLevel=3;_tagToLevel=new Map;_levelCache=new Map;_callback;_enhancedCallback;init(e,t){if(this._levelCache.clear(),e)for(let n in e){let l=e[n];this._setTagLevel(n,l)}return t!==void 0&&(this._callback=t),this}_setTagLevel(e,t){let n=L.get(t);n!==void 0?e===a?this._defaultLevel=n:(this._tagToLevel.set(e,n),o.add(e)):(console.warn(`Invalid log level "${t}" for tag "${e}". Using default (${g.get(this._defaultLevel)}).`),this._tagToLevel.set(e,2),o.add(e))}setEnhancedCallback(e){return this._enhancedCallback=e,this}_shouldLog(e,t){let n=`${e}:${t||a}`;if(this._levelCache.has(n))return this._levelCache.get(n);let l=this._tagToLevel.get(t||a)??this._defaultLevel,i=e>=l;return this._levelCache.set(n,i),i}_log(e,t,...n){if(!this._callback&&!this._enhancedCallback||t===void 0)return;let l="",i;if(typeof t=="string"&&o.has(t)?(l=t,i=n[0]??"",n=n.slice(1)):i=t,i===void 0||i===""||!this._shouldLog(e,l))return;let s=n.filter(v=>v!==void 0),h=g.get(e);this._callback&&this._callback(h,l,i,s),this._enhancedCallback&&this._enhancedCallback({level:h,tag:l,message:i,params:s,timestamp:new Date})}debug(e,...t){return this._log(2,e,...t),this}error(e,...t){return this._log(5,e,...t),this}info(e,...t){return this._log(3,e,...t),this}log(e,...t){return this._log(3,e,...t),this}trace(e,...t){return this._log(1,e,...t),this}warn(e,...t){return this._log(4,e,...t),this}isLevelEnabled(e,t=a){let n=L.get(e);return n===void 0?!1:this._shouldLog(n,t)}reset(){return this._tagToLevel.clear(),this._levelCache.clear(),this._defaultLevel=3,this}},C=new c;0&&(module.exports={DEFAULT_TAG,Log,LogLevel,log,tag});
//# sourceMappingURL=index.cjs.js.map
