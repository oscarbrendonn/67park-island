// Isolated candidate: close only the existing pink road's fountain opening.
// Run after existing parcel paving and before the final terrain sampler.
export const FOUNTAIN_GROUND_REVISION='fountain-road-inner-boundary-v1';
const CENTER=[49.37195450039425,-32.32740724601983];
const MATRIX=[179.45658377779,0,0,0,0,179.45658377779,0,0,0,0,179.45658377779,0,8.131652123901338,9.227547471411985,-2.1953011248415946,1];
const TOP=9.227547471411985,BOTTOM=8.796851674289052,INNER=5.20;
const EXPECTED_COUNT=388,EXPECTED_REGION_HASH='f8f85c74';
const EXPECTED_INCIDENT_FACES=896,EXPECTED_REFERENCE_HASH='9d6d5650';

function hashRegion(position,normal,ids){
 let hash=2166136261;
 for(const id of ids)for(const attribute of [position,normal]){
  const bytes=new Uint8Array(attribute.array.buffer,attribute.array.byteOffset+id*12,12);
  for(const byte of bytes){hash^=byte;hash=Math.imul(hash,16777619);}
 }
 return (hash>>>0).toString(16).padStart(8,'0');
}

function hashIncidentReferences(index,ids){
 const selected=new Set(ids),bytes=new Uint8Array(4),view=new DataView(bytes.buffer);
 let hash=2166136261,faces=0;
 for(let start=0;start<index.count;start+=3){
  const a=index.getX(start),b=index.getX(start+1),c=index.getX(start+2);
  if(!selected.has(a)&&!selected.has(b)&&!selected.has(c))continue;
  faces++;
  for(const id of [a,b,c]){view.setUint32(0,id,true);for(const byte of bytes){hash^=byte;hash=Math.imul(hash,16777619);}}
 }
 return {faces,hash:(hash>>>0).toString(16).padStart(8,'0')};
}

export function applyFountainGroundFollowup(root){
 if(root.userData.fountainGroundFollowup){
  if(root.userData.fountainGroundFollowup.revision!==FOUNTAIN_GROUND_REVISION)throw Error('Fountain ground: different patch');
  return root.userData.fountainGroundFollowup;
 }
 const matches=[];root.traverse(object=>{if(object.isMesh&&object.name==='5_YOL')matches.push(object);});
 if(matches.length!==1)throw Error('Fountain ground: missing/duplicate road');
 const mesh=matches[0],old=mesh.geometry,position=old?.attributes.position,normal=old?.attributes.normal;
 if(!(position?.array instanceof Float32Array)||!(normal?.array instanceof Float32Array)||position.itemSize!==3||normal.itemSize!==3||position.count!==normal.count||!old.index||old.groups.length||Object.keys(old.attributes).some(name=>!['position','normal'].includes(name)))throw Error('Fountain ground: unsupported road attributes');
 root.updateMatrixWorld(true);
 if(MATRIX.some((value,id)=>!Number.isFinite(mesh.matrixWorld.elements[id])||Math.abs(mesh.matrixWorld.elements[id]-value)>1e-8))throw Error('Fountain ground: road transform');
 const ids=[];
 for(let id=0;id<position.count;id++){
  const x=position.getX(id)*MATRIX[0]+MATRIX[12],z=position.getZ(id)*MATRIX[10]+MATRIX[14],radius=Math.hypot(x-CENTER[0],z-CENTER[1]);
  if(radius<5.9218||radius>5.9221)continue;
  const y=position.getY(id)*MATRIX[5]+MATRIX[13];
  if(Math.min(Math.abs(y-TOP),Math.abs(y-BOTTOM))>1e-5)throw Error('Fountain ground: unexpected ring height');
  ids.push(id);
 }
 // The exact regional Float32 position+normal sequence is pinned. Distant
 // append-only park/curb repairs may legitimately change whole-mesh hashes.
 if(ids.length!==EXPECTED_COUNT||hashRegion(position,normal,ids)!==EXPECTED_REGION_HASH)throw Error('Fountain ground: circular boundary preimage changed');
 const references=hashIncidentReferences(old.index,ids);
 if(references.faces!==EXPECTED_INCIDENT_FACES||references.hash!==EXPECTED_REFERENCE_HASH)throw Error('Fountain ground: incident face references changed');
 const next=old.clone(),nextPosition=next.attributes.position;
 for(const id of ids){
  const x=position.getX(id)*MATRIX[0]+MATRIX[12],z=position.getZ(id)*MATRIX[10]+MATRIX[14];
  const dx=x-CENTER[0],dz=z-CENTER[1],scale=INNER/Math.hypot(dx,dz);
  nextPosition.setX(id,(CENTER[0]+dx*scale-MATRIX[12])/MATRIX[0]);
  nextPosition.setZ(id,(CENTER[1]+dz*scale-MATRIX[14])/MATRIX[10]);
 }
 // Radial wall normals and horizontal top/bottom normals stay valid; no
 // index/normal/height change, new face, material, mesh or draw is introduced.
 nextPosition.needsUpdate=true;next.computeBoundingBox();next.computeBoundingSphere();
 mesh.geometry=next;
 return root.userData.fountainGroundFollowup={revision:FOUNTAIN_GROUND_REVISION,mesh:mesh.name,center:CENTER.slice(),oldInnerRadius:5.921932,newInnerRadius:INNER,top:TOP,movedVertices:ids.length,sourceRegionHash:EXPECTED_REGION_HASH,incidentFaces:references.faces,sourceReferenceHash:references.hash,addedTriangles:0,addedDrawCalls:0,outerRoadVerticesUnchanged:true,indicesAndNormalsUnchanged:true,sculptureUnchanged:true};
}
