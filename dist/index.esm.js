/**
 * @author Ray Martone
 * @copyright Copyright (c) 2019-2025 Ray Martone
 * @license MIT
 * @description Log adapter providing level-based filtering and tagging.
 */var a=(n=>(n[n.TRACE=1]="TRACE",n[n.DEBUG=2]="DEBUG",n[n.INFO=3]="INFO",n[n.WARN=4]="WARN",n[n.ERROR=5]="ERROR",n[n.OFF=6]="OFF",n))(a||{}),c=(n=>(n.TRACE="TRACE",n.DEBUG="DEBUG",n.INFO="INFO",n.WARN="WARN",n.ERROR="ERROR",n.OFF="OFF",n))(c||{}),u="default",r=new Set,v=new Proxy({},{get(d,e){if(typeof e=="string"&&r.has(e))return e},ownKeys(){return Array.from(r)},getOwnPropertyDescriptor(){return{enumerable:!0,configurable:!0}}}),R=new Map([[1,"TRACE"],[2,"DEBUG"],[3,"INFO"],[4,"WARN"],[5,"ERROR"],[6,"OFF"]]),s=class{_defaultLevel=3;_tagToLevel=new Map;_callback;init(e,t){if(e)for(let l in e){let o=e[l];if(Object.values(c).includes(o)){let i=a[o];l===u?this._defaultLevel=i:(this._tagToLevel.set(l,i),r.add(l))}else console.warn(`Invalid log level "${o}" for tag "${l}". Using default (${R.get(this._defaultLevel)}).`),this._tagToLevel.set(l,2),r.add(l)}return t!==void 0&&(this._callback=t),this}_log(e,t,...l){if(!this._callback||!t)return;let o,i;if(typeof t=="string"&&r.has(t)?(o=t,i=l[0]??"",l=l.slice(1)):(o="",i=t),!i)return;let n=this._tagToLevel.get(o||u)??this._defaultLevel;e<n||this._callback(R.get(e),o,i,l.filter(g=>g!==void 0))}debug(e,...t){this._log(2,e,...t)}error(e,...t){this._log(5,e,...t)}info(e,...t){this._log(3,e,...t)}log(e,...t){this._log(3,e,...t)}trace(e,...t){this._log(1,e,...t)}warn(e,...t){this._log(4,e,...t)}},w=new s;export{s as Log,c as LogLevel,w as log,v as tag};
//# sourceMappingURL=index.esm.js.map
