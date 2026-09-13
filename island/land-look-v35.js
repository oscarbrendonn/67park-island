import * as THREE from 'three';

// One restrained land palette. These are material inputs, not JPEG swatches.
export const LAND_LOOK=Object.freeze({grass:0xd8dd9f,darkGrass:0xaebc8f,
  sand:0xf4dcbc,body:0xe5ceb4,grassEnvironment:0.28,sandEnvironment:0.36,
  exposure:1.62});

export function applyLandFinish(root,exposure){
  const materials=new Set();
  root.traverse(o=>{
    if(!o.isMesh||!o.material||Array.isArray(o.material))return;
    const grass=/^3_.*CIMEN|^8_(?:CIM_STUB_DOLGU|D10_CIM_DESTEK)(?:$|[._-])/i.test(o.name);
    const sand=/^(?:4_(?:ANA_)?KUMTABAN|1_KUM_TABAN|67D_KIYI_KUM_OMUZ|67F_ANA_ADA_ALT_KOPRU_KUM_OMUZ)(?:$|[._-])|KIYI_TOPRAK/i.test(o.name);
    if(!grass&&!sand)return;
    const m=o.material;m.envMapIntensity=grass?LAND_LOOK.grassEnvironment:LAND_LOOK.sandEnvironment;
    materials.add(m);
    if(m.userData.landFinish35)return;
    m.userData.landFinish35=true;
    const previous=m.onBeforeCompile;
    const key=m.customProgramCacheKey.bind(m);
    m.onBeforeCompile=shader=>{
      previous?.(shader);shader.uniforms.uLandExposure35=exposure;
      shader.fragmentShader=shader.fragmentShader
        .replace('#include <common>','#include <common>\nuniform float uLandExposure35;')
        .replace('#include <opaque_fragment>','outgoingLight *= uLandExposure35;\n#include <opaque_fragment>');
    };
    m.customProgramCacheKey=()=>key()+'-land-finish-35';m.needsUpdate=true;
  });
  return materials.size;
}

export function applyRoundedGrass(root,meta,buffer){
  if(root.userData.roundedGrass35)return root.userData.roundedGrass35;
  if(meta?.version!==35||meta.variant!=='codex'||buffer.byteLength!==meta.byteLength)
    throw Error('Rounded grass data does not match this island');
  const prepared=[];
  for(const [name,spec] of Object.entries(meta.meshes)){
    const mesh=root.getObjectByName(name);
    if(!mesh?.isMesh||mesh.geometry.attributes.position.count!==spec.expectedVertices||
        mesh.geometry.index?.count!==spec.expectedIndices)
      throw Error('Rounded grass source changed: '+name);
    const read=(key,Type)=>{
      const part=spec[key];
      if(part.offset%4||part.bytes%4||part.offset<0||part.offset+part.bytes>buffer.byteLength)
        throw Error('Invalid rounded grass buffer: '+name);
      return new Type(buffer,part.offset,part.bytes/4);
    };
    const position=read('position',Float32Array),normal=read('normal',Float32Array),index=read('index',Uint32Array);
    if(position.length!==spec.vertices*3||normal.length!==position.length||index.length!==spec.indices||
       !position.every(Number.isFinite)||!normal.every(Number.isFinite)||!index.every(i=>i<spec.vertices))
      throw Error('Invalid rounded grass geometry: '+name);
    const geometry=new THREE.BufferGeometry();
    geometry.setAttribute('position',new THREE.BufferAttribute(position,3));
    geometry.setAttribute('normal',new THREE.BufferAttribute(normal,3));
    geometry.setIndex(new THREE.BufferAttribute(index,1));
    geometry.computeBoundingBox();geometry.computeBoundingSphere();
    prepared.push({mesh,geometry});
  }
  for(const {mesh,geometry} of prepared){const old=mesh.geometry;mesh.geometry=geometry;old.dispose();}
  const report={version:35,meshes:prepared.map(p=>p.mesh.name),triangleDelta:meta.triangleDelta,
    crownHeight:.22,shoulderWidth:1.15,footprint:'preserved',dataBytes:meta.byteLength};
  root.userData.roundedGrass35=report;
  return report;
}
