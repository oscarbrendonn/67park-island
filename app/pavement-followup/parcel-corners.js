import * as T from 'three';
import {parcelCornersData as data} from './parcel-corners-data.js';

function crc(a){let c=0xffffffff;for(const b of new Uint8Array(a.buffer,a.byteOffset,a.byteLength)){c^=b;for(let k=0;k<8;k++)c=c&1?0xedb88320^(c>>>1):c>>>1;}return ((c^0xffffffff)>>>0).toString(16).padStart(8,'0');}

// Run after the existing parcel paving and before shadow/sampler rebuilding.
// This adds no mesh/material/draw and keeps the original walkable mesh identity.
export function applyParcelCorners(root){
 if(root.userData.parcelCorners1)return root.userData.parcelCorners1;
 if(!root.userData.parcelPaving)throw Error('Parcel corners: existing paving must run first');
 root.updateMatrixWorld(true);const found=[];root.traverse(m=>{if(m.isMesh&&m.name==='6_BORDUR')found.push(m);});
 if(found.length!==1)throw Error('Parcel corners: unique curb required');
 const mesh=found[0],old=mesh.geometry,identity=crc(old.attributes.position.array);
 const match=Object.entries(data.variants).find(([,v])=>v.vertices===old.attributes.position.count&&v.indices===old.index?.count&&v.positionCRC===identity);
 if(!match)throw Error('Parcel corners: unreviewed source geometry');
 const [variant,e]=match;
 if(mesh.matrixWorld.elements.some((v,i)=>Math.abs(v-e.matrix[i])>1e-10)||Array.isArray(mesh.material)||Object.keys(old.attributes).sort().join()!=='normal,position'||old.groups.length||Object.keys(old.morphAttributes).length||old.drawRange.start!==0||Number.isFinite(old.drawRange.count))throw Error('Parcel corners: unsupported source contract');
 if(data.version!==1||data.family!=='5_PARSEL_ZEMIN-west-middle'||data.p.length!==data.n.length||data.p.length%9||data.ix.length!==data.p.length/3||data.topIndexCount%3||data.topIndexCount<=0||data.topIndexCount>=data.ix.length||!data.p.every(Number.isFinite)||!data.n.every(Number.isFinite)||data.ix.some((v,i)=>v!==i))throw Error('Parcel corners: invalid baked data');
 const allowed=p=>(p[0]>=-92&&p[0]<=-90&&p[2]>=-76.75&&p[2]<=-76.45)||(p[0]>=-19.5&&p[0]<=-16.17&&p[2]>=-76.75&&p[2]<=12.1);
 const inverse=mesh.matrixWorld.clone().invert(),p=new Float32Array(data.p.length),n=new Float32Array(data.n),v=new T.Vector3();
 for(let i=0;i<p.length;i+=3){const q=data.p.slice(i,i+3);if(!allowed(q)||q[1]<8.7968||q[1]>9.3801||Math.abs(Math.hypot(...data.n.slice(i,i+3))-1)>.002)throw Error('Parcel corners: scope/normal');v.fromArray(q).applyMatrix4(inverse);p.set(v.toArray(),i);}
 // Guard after real Float32 conversion too, not only the offline doubles.
 const a=new T.Vector3(),b=new T.Vector3(),c=new T.Vector3(),ab=new T.Vector3(),ac=new T.Vector3();
 for(let i=0;i<p.length;i+=9){a.fromArray(p,i);b.fromArray(p,i+3);c.fromArray(p,i+6);ab.subVectors(b,a).cross(ac.subVectors(c,a));if(ab.lengthSq()<=1e-30||ab.dot(v.fromArray(n,i))<=0||(i<data.topIndexCount*3&&ab.y<=0))throw Error('Parcel corners: degenerate/inverted converted solid');}
 const next=old.clone();for(const [name,extra]of [['position',p],['normal',n]]){const src=old.attributes[name],values=new src.array.constructor(src.array.length+extra.length);values.set(src.array);values.set(extra,src.array.length);const attribute=new T.BufferAttribute(values,3,src.normalized);attribute.name=src.name;attribute.setUsage(src.usage);attribute.gpuType=src.gpuType;next.setAttribute(name,attribute);}
 const ix=new Uint32Array(old.index.count+data.ix.length);ix.set(old.index.array);for(let i=0;i<data.ix.length;i++)ix[old.index.count+i]=e.vertices+i;next.setIndex(new T.BufferAttribute(ix,1));next.computeBoundingBox();next.computeBoundingSphere();
 mesh.geometry=next;
 return root.userData.parcelCorners1={version:1,variant,family:data.family,area:data.metrics.area,triangleDelta:data.ix.length/3,addedMeshes:0,addedDrawCalls:0,originalMaterial:true,originalMesh:true,sourceCRC:identity,components:data.metrics.components};
}
