import * as THREE from 'three';

// Replace one existing support mesh, retaining its material, transform and
// draw call. Only the small-island sand-facing component has been remodelled.
export function applyRoundedShore(root,meta,buffer){
  if(root.userData.roundedShore37)return root.userData.roundedShore37;
  if(meta?.version!==37||meta.variant!=='codex'||buffer.byteLength!==meta.byteLength)
    throw Error('Rounded shore data does not match this island');
  const mesh=root.getObjectByName(meta.mesh);
  if(!mesh?.isMesh||mesh.geometry.attributes.position.count!==meta.expectedVertices||mesh.geometry.index?.count!==meta.expectedIndices)
    throw Error('Rounded shore source changed');
  const read=(key,Type)=>{
    const p=meta[key];
    if(!p||p.offset%4||p.bytes%4||p.offset<0||p.offset+p.bytes>buffer.byteLength)
      throw Error('Invalid rounded shore buffer');
    return new Type(buffer,p.offset,p.bytes/4);
  };
  const position=read('position',Float32Array),normal=read('normal',Float32Array),index=read('index',Uint32Array);
  if(position.length!==meta.vertices*3||normal.length!==position.length||index.length!==meta.indices||
      !position.every(Number.isFinite)||!normal.every(Number.isFinite)||!index.every(i=>i<meta.vertices))
    throw Error('Invalid rounded shore geometry');
  const geometry=new THREE.BufferGeometry();
  geometry.setAttribute('position',new THREE.BufferAttribute(position,3));
  geometry.setAttribute('normal',new THREE.BufferAttribute(normal,3));
  geometry.setIndex(new THREE.BufferAttribute(index,1));
  geometry.computeBoundingBox();geometry.computeBoundingSphere();
  const old=mesh.geometry;mesh.geometry=geometry;old.dispose();
  const report={version:37,mesh:meta.mesh,width:meta.roundWidth,triangleDelta:meta.triangleDelta,
    addedArea:meta.addedArea,roadOverlapArea:meta.roadOverlapArea,waterOutsideArea:meta.waterOutsideArea};
  root.userData.roundedShore37=report;
  return report;
}
