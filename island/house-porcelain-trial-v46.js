import * as THREE from 'three';
import {loadSmallIslandProps as loadApprovedProps} from './small-island-props-v45.js?v=45round1';

// Preview-only wrapper. The live v45 module, models, layouts and pages stay put.
// Isolate exactly one existing instance; same mesh/paint, no extra geometry.
export async function loadSmallIslandProps(options){
 const props=await loadApprovedProps(options);
 const target=props.layout.houses.find(p=>p.id==='H01');
 if(!target)throw Error('Deneme evi H01 bulunamadı');
 const batch=props.group.children.find(m=>m.name==='V45_'+target.asset);
 const siblings=props.layout.houses.filter(p=>p.asset===target.asset);
 const index=siblings.findIndex(p=>p.id===target.id);
 if(!batch?.isInstancedMesh||index<0||batch.count!==siblings.length)throw Error('Deneme evinin çizim grubu uyuşmuyor');
 const transform=new THREE.Matrix4();batch.getMatrixAt(index,transform);
 const swap=new THREE.Matrix4();
 for(let i=index;i<batch.count-1;i++){batch.getMatrixAt(i+1,swap);batch.setMatrixAt(i,swap);}
 batch.count--;batch.instanceMatrix.needsUpdate=true;batch.computeBoundingBox();batch.computeBoundingSphere();

 const original=batch.material;
 const porcelain=original.clone();porcelain.name='H01 soft porcelain trial v46';
 porcelain.roughness=.34;porcelain.envMapIntensity=.72;
 if('specularIntensity' in porcelain)porcelain.specularIntensity=1;
 porcelain.metalness=0;porcelain.emissiveIntensity=0;
 // clone() omits shader callbacks: retain exposure and existing palette logic.
 porcelain.onBeforeCompile=shader=>{
  original.onBeforeCompile(shader);
  shader.fragmentShader=shader.fragmentShader.replace(
   'roughnessFactor=mix(mix(.72,.26,leaf43),.42,glass43);',
   `// Roof paint is lavender/pink: its blue channel sits above green.
    // All classification uses the unchanged linear vertex palette.
    float roof46=smoothstep(.012,.038,vColor.b-vColor.g);
    roughnessFactor=mix(mix(.34,.38,roof46),.24,glass43);`
  );
 };
 porcelain.customProgramCacheKey=()=>original.customProgramCacheKey()+'-single-house-porcelain46';
 const house=new THREE.Mesh(batch.geometry,porcelain);
 house.name='H01_PORCELAIN_TRIAL_V46';house.matrix.copy(transform);house.matrixAutoUpdate=false;
 house.castShadow=batch.castShadow;house.receiveShadow=batch.receiveShadow;
 house.userData={...batch.userData,houseTrialId:'H01'};
 props.group.add(house);props.group.updateMatrixWorld(true);
 const triangleCount=(house.geometry.index?.count??house.geometry.attributes.position.count)/3;
 let enabled=true;
 const data=options.renderer.domElement.dataset;
 function setPorcelain(value){
  enabled=!!value;house.material=enabled?porcelain:original;
  Object.assign(data,{houseTrialId:'H01',houseTrialFinish:enabled?'porcelain':'original',houseTrialVersion:'46',houseTrialOtherHousesChanged:'0'});
 }
 setPorcelain(true);
 return {...props,trial:{house,original,porcelain,setPorcelain,get enabled(){return enabled;}},
  update(dt,camera){
   props.update(dt,camera);
   // v45 counts its batches; the isolated house still costs the same triangles.
   data.smallIslandPropTriangles=String(props.triangles+triangleCount);
   data.smallIslandPropDrawCalls=String(props.group.children.filter(m=>m.isMesh&&(!m.isInstancedMesh||m.count>0)).length);
  },
  get triangles(){return props.triangles+triangleCount;}
 };
}
