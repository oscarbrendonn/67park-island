import * as T from 'three';
import {parcelPavingData as oldData} from './parcel-paving-data.js';
import {parcelCornersData as cornerData} from './parcel-corners-data.js';

// Only the offline-baked repair top faces need this small Float64 overlay.
// The original P6 sampler, global geometry and its tolerance stay unchanged.
export function wrapParcelRepairSampler(base,root){
 if(!base?.sample||!root.userData.parcelPaving||!root.userData.parcelCorners1)throw Error('Parcel precision: repairs must precede final sampler');
 const variant=root.userData.parcelCorners1.variant;
 if(!cornerData.variants[variant])throw Error('Parcel precision: reviewed variant required');
 root.updateMatrixWorld(true);const meshes=[],ranges=[];let total=0;
 for(const row of oldData.meshes){
  const mesh=root.getObjectByName(row.name),e=row.expected,g=mesh?.geometry,extra=row.name==='6_BORDUR'?cornerData:null;
  if(!mesh?.isMesh||Array.isArray(mesh.material)||!g?.index||g.attributes.position.count!==e.vertices+row.p.length/3+(extra?.p.length??0)/3||g.index.count!==e.indices+row.ix.length+(extra?.ix.length??0))throw Error('Parcel precision: geometry identity/count '+row.name);
  const owner=meshes.length;meshes.push(mesh);
  for(const spec of [{start:e.indices,count:row.topIndexCount,expected:row.ix,offset:e.vertices},...(extra?[{start:e.indices+row.ix.length,count:extra.topIndexCount,expected:extra.ix,offset:e.vertices+row.p.length/3}]:[])]){
   if(!Number.isInteger(spec.count)||spec.count<=0||spec.count%3)throw Error('Parcel precision: top range');
   for(let i=0;i<spec.count;i++)if(g.index.getX(spec.start+i)!==spec.offset+spec.expected[i])throw Error('Parcel precision: top index changed');
   ranges.push({mesh,owner,...spec});total+=spec.count/3;
  }
 }
 if(meshes.length!==5||total>1200)throw Error('Parcel precision: bounded five-target scope');
 const values=new Float64Array(total*10),owners=new Uint8Array(total),a=new T.Vector3(),b=new T.Vector3(),c=new T.Vector3();let n=0,minX=Infinity,minZ=Infinity,maxX=-Infinity,maxZ=-Infinity;
 for(const r of ranges){const p=r.mesh.geometry.attributes.position,ix=r.mesh.geometry.index;
  for(let i=r.start;i<r.start+r.count;i+=3){a.fromBufferAttribute(p,ix.getX(i)).applyMatrix4(r.mesh.matrixWorld);b.fromBufferAttribute(p,ix.getX(i+1)).applyMatrix4(r.mesh.matrixWorld);c.fromBufferAttribute(p,ix.getX(i+2)).applyMatrix4(r.mesh.matrixWorld);
   const bx=b.x-a.x,bz=b.z-a.z,cx=c.x-a.x,cz=c.z-a.z,det=bx*cz-bz*cx;
   if(!Number.isFinite(det))throw Error('Parcel precision: nonfinite top');
   // Match P6's exact determinant and material-side filter. The legacy curb
   // material is double-sided; do not treat it as a default FrontSide mesh.
   if(Math.abs(det)<1e-12||r.mesh.material.side===T.FrontSide&&det>=0||r.mesh.material.side===T.BackSide&&det<=0)continue;
   if(Math.min(a.y,b.y,c.y)<9.23||Math.max(a.y,b.y,c.y)>9.381)throw Error('Parcel precision: authored top height');
   values.set([a.x,a.z,a.y,bx,bz,cx,cz,b.y-a.y,c.y-a.y,1/det],n*10);owners[n++]=r.owner;
   minX=Math.min(minX,a.x,b.x,c.x);minZ=Math.min(minZ,a.z,b.z,c.z);maxX=Math.max(maxX,a.x,b.x,c.x);maxZ=Math.max(maxZ,a.z,b.z,c.z);
  }
 }
 const cell=8,columns=Math.max(1,Math.ceil((maxX-minX)/cell)),rows=Math.max(1,Math.ceil((maxZ-minZ)/cell));
 const gx=x=>Math.min(columns-1,Math.max(0,Math.floor((x-minX)/cell))),gz=z=>Math.min(rows-1,Math.max(0,Math.floor((z-minZ)/cell))),counts=new Uint32Array(columns*rows);
 function cells(k,visit){const xs=[values[k],values[k]+values[k+3],values[k]+values[k+5]],zs=[values[k+1],values[k+1]+values[k+4],values[k+1]+values[k+6]];for(let z=gz(Math.min(...zs));z<=gz(Math.max(...zs));z++)for(let x=gx(Math.min(...xs));x<=gx(Math.max(...xs));x++)visit(z*columns+x);}
 for(let k=0;k<n*10;k+=10)cells(k,id=>counts[id]++);
 const offsets=new Uint32Array(counts.length+1);for(let i=0;i<counts.length;i++)offsets[i+1]=offsets[i]+counts[i];
 const refs=new Uint16Array(offsets.at(-1)),cursor=offsets.slice(0,-1);for(let k=0;k<n*10;k+=10)cells(k,id=>refs[cursor[id]++]=k/10);
 let lastX=NaN,lastZ=NaN,last=null;
 return {stats:{...base.stats,parcelRepairPrecision:{version:1,variant,authoredTopFaces:total,triangles:n,skippedDegenerateOrBackfaces:total-n,meshes:meshes.map(m=>m.name),bytes:values.byteLength+owners.byteLength+offsets.byteLength+refs.byteLength,cells:counts.length,globalSamplerUnchanged:true}},sample(x,z){
  if(x===lastX&&z===lastZ)return last;lastX=x;lastZ=z;last=base.sample(x,z);
  if(!Number.isFinite(x)||!Number.isFinite(z)||x<minX||x>maxX||z<minZ||z>maxZ)return last;
  let height=last?.point.y??-Infinity;const cellId=gz(z)*columns+gx(x);
  for(let j=offsets[cellId];j<offsets[cellId+1];j++){const id=refs[j],k=id*10,dx=x-values[k],dz=z-values[k+1],u=(dx*values[k+6]-dz*values[k+5])*values[k+9],v=(values[k+3]*dz-values[k+4]*dx)*values[k+9];
   // Numerical seam tolerance is narrower than P6's 1e-6, never a global
   // expansion of roads/platforms. Outside the real cap triangles stays empty.
   if(u< -1e-8||v< -1e-8||u+v>1.00000001)continue;
   const y=values[k+2]+u*values[k+7]+v*values[k+8];if(y<=80&&y>height){height=y;last={object:meshes[owners[id]],point:{x,y,z}};}
  }
  return last;
 }};
}
