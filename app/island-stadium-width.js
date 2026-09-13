import * as T from 'three';

// Current Island road-block limits, measured from the approved dry-parcel
// outline and the eastern curb. They are not an enlarged replacement parcel.
export const STADIUM_PARCEL = Object.freeze({west:114.98515294,east:201.79850710,north:-76.40059852,south:11.74578359});
// Fill the unused WEST pavement, leaving a 5.86 m margin to the road-block
// boundary. East/coast stay fixed. The platform itself is expanded as well.
export const STADIUM_WEST_EXTENSION = 40;

/** Runs on the stadium's own unbatched meshes, before the coast is authored
 * and before walk/collision samplers are baked. Both Island variants opt in;
 * archived constructors and the separate penalty minigame stay unchanged. */
export function widenIslandStadium(source, layout) {
  const [px,pz,width,depth] = layout.platform;
  const east = px + width/2, west = px - width/2;
  const scaleX = (width + STADIUM_WEST_EXTENSION)/width;
  const x = value => east + (value-east)*scaleX;
  const centerX = x(layout.x), centerShift = centerX-layout.x;
  if (x(west)<STADIUM_PARCEL.west+1 || east>STADIUM_PARCEL.east ||
      pz-depth/2<STADIUM_PARCEL.north-.001 || pz+depth/2>STADIUM_PARCEL.south) {
    throw new Error('Stadium widening exceeds its existing road-block parcel');
  }
  const stretch = new T.Matrix4().makeScale(scaleX,1,1);
  stretch.setPosition(east*(1-scaleX),0,0);
  const translate = new T.Matrix4().makeTranslation(centerShift,0,0);
  const preservedDetails = [];
  source.updateMatrixWorld(true);
  for (const mesh of source.children) {
    if (!mesh.isMesh || !mesh.geometry) throw new Error('Unexpected stadium source mesh');
    // Numeral outlines, circular spots and real goal widths stay undistorted.
    const preserveShape = mesh.name==='stadium flat approved 67 decal' ||
      mesh.name==='penalty spot' || /^(?:goal |net support$)/.test(mesh.name);
    const before = new T.Box3().setFromObject(mesh);
    const matrix = (preserveShape?translate:stretch).clone().multiply(mesh.matrixWorld);
    mesh.geometry.applyMatrix4(matrix);
    mesh.position.set(0,0,0);mesh.quaternion.identity();mesh.scale.set(1,1,1);
    mesh.updateMatrixWorld(true);
    mesh.geometry.computeBoundingBox();mesh.geometry.computeBoundingSphere();
    const after = new T.Box3().setFromObject(mesh);
    if (after.min.x<STADIUM_PARCEL.west || after.max.x>STADIUM_PARCEL.east ||
        after.min.z<STADIUM_PARCEL.north-.001 || after.max.z>STADIUM_PARCEL.south) {
      throw new Error('Stadium detail leaves its parcel: '+mesh.name);
    }
    if (preserveShape) preservedDetails.push({name:mesh.name,before:before.getSize(new T.Vector3()).toArray(),after:after.getSize(new T.Vector3()).toArray()});
  }
  return {
    x,
    layout:{...layout,x:centerX,rX:layout.r*scaleX,widthScale:scaleX,platform:[px-STADIUM_WEST_EXTENSION/2,pz,width+STADIUM_WEST_EXTENSION,depth]},
    stats:{revision:1,direction:'west',extension:STADIUM_WEST_EXTENSION,scaleX,fixedEast:east,parcel:{...STADIUM_PARCEL},preservedDetails},
  };
}
