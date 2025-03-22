/**
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
 */var d=(r=>(r.TRACE="TRACE",r.DEBUG="DEBUG",r.INFO="INFO",r.WARN="WARN",r.ERROR="ERROR",r.OFF="OFF",r))(d||{}),a="*",s=new Set,v=new Proxy({},{get(g,e){if(typeof e=="string"&&s.has(e))return e},ownKeys(){return Array.from(s)},getOwnPropertyDescriptor(){return{enumerable:!0,configurable:!0}}}),u=new Map([[1,"TRACE"],[2,"DEBUG"],[3,"INFO"],[4,"WARN"],[5,"ERROR"],[6,"OFF"]]),h=new Map([["TRACE",1],["DEBUG",2],["INFO",3],["WARN",4],["ERROR",5],["OFF",6]]),o=class{_defaultLevel=3;_tagToLevel=new Map;_levelCache=new Map;_callback;_enhancedCallback;init(e,t){if(this._levelCache.clear(),e)for(let n in e){let i=e[n];this._setTagLevel(n,i)}return t!==void 0&&(this._callback=t),this}_setTagLevel(e,t){let n=h.get(t);n!==void 0?e===a?this._defaultLevel=n:(this._tagToLevel.set(e,n),s.add(e)):(console.warn(`Invalid log level "${t}" for tag "${e}". Using default (${u.get(this._defaultLevel)}).`),this._tagToLevel.set(e,2),s.add(e))}setEnhancedCallback(e){return this._enhancedCallback=e,this}_shouldLog(e,t){let n=`${e}:${t||a}`;if(this._levelCache.has(n))return this._levelCache.get(n);let i=this._tagToLevel.get(t||a)??this._defaultLevel,l=e>=i;return this._levelCache.set(n,l),l}_log(e,t,...n){if(!this._callback&&!this._enhancedCallback||t===void 0)return;let i="",l;if(typeof t=="string"&&s.has(t)?(i=t,l=n[0]??"",n=n.slice(1)):l=t,l===void 0||l===""||!this._shouldLog(e,i))return;let r=n.filter(L=>L!==void 0),c=u.get(e);this._callback&&this._callback(c,i,l,r),this._enhancedCallback&&this._enhancedCallback({level:c,tag:i,message:l,params:r,timestamp:new Date})}debug(e,...t){return this._log(2,e,...t),this}error(e,...t){return this._log(5,e,...t),this}info(e,...t){return this._log(3,e,...t),this}log(e,...t){return this._log(3,e,...t),this}trace(e,...t){return this._log(1,e,...t),this}warn(e,...t){return this._log(4,e,...t),this}isLevelEnabled(e,t=a){let n=h.get(e);return n===void 0?!1:this._shouldLog(n,t)}reset(){return this._tagToLevel.clear(),this._levelCache.clear(),this._defaultLevel=3,this}},R=new o;export{a as DEFAULT_TAG,o as Log,d as LogLevel,R as log,v as tag};
//# sourceMappingURL=index.esm.js.map
