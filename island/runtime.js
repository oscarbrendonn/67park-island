import {assetFetch} from '/67park-island/app/entry-loading.js';
const islandFetch=(u,...a)=>assetFetch(typeof u==='string'&&u.startsWith('./')?'/67park-island/island/'+u.slice(2):u,...a);
import {loadIslandPrerequisites} from '../app/island-startup-queue.js';
import {createIslandAssetCache} from '../app/island-asset-cache.js';
import {repairIslandStairs,stairAt,stairsRailBlocked} from '/67park-island/app/island-stair-geometry.js';
import {applyCurbJoins} from '/67park-island/app/island-curb-joins.js';
import {applyParkEdges} from '/67park-island/app/island-park-edges.js';
import {applyParcelPaving} from '/67park-island/app/pavement-followup/island-parcel-paving.js';
import {applyFountainGroundFollowup} from '/67park-island/app/pavement-followup/fountain-ground.js';
import {applyParcelCorners} from '/67park-island/app/pavement-followup/parcel-corners.js';
import {wrapParcelRepairSampler} from '/67park-island/app/pavement-followup/parcel-precision.js';
import * as THREE from 'three';
import {createStableSunShadow52} from './stable-sun-shadow-v52.js';
import {loadSmallIslandProps} from './small-island-props-v62.js?v=roof1';
import {loadParkProps63} from './park-props-v63.js?v=anchor2';
import {loadCityProps60} from './city-props-v60.js?v=photo67';
import {applyPhotoFixes67} from './fixes-v67.js?v=8';
import {applyParkTerrain57,wrapParkTerrainSampler57} from './park-terrain-v57.js?v=1';
import {applyParkPlinthGround57} from './park-plinth-ground57.js?v=1';
import {applyParkPathPolish57,wrapParkPathSampler57} from './park-path-polish57.js?v=1';
import {applyParkRing63,wrapParkRingSampler63} from './park-ring-v63.js?v=L1g2';
import {applyParkShore66} from './park-shore-v66.js?v=4';
import {applyParkEntryCaps57,wrapParkEntryCapsSampler57} from './park-entry-caps57.js?v=1';
import {applyRoadSeal64} from './road-seal-v64.js?v=road-seal-r1';
import {applyParkPond65} from './park-pond-v65.js?v=pond-v65-P8-pastel-closure-r6';
import {applySmallIslandWalls48} from './small-island-walls-v48.js?v=walls3';
import {applySmallIslandMatch55} from './small-island-match-v55.js?v=1';
import {applyCurbPolish49} from './curb-polish-v49.js?v=curb6';
import {applySideContinuity50} from './side-continuity-v50.js?v=1';
import {applyCoastalRoad56} from './coastal-road-v56.js?v=1';
import {installTerrainReceiverPlane50} from './grass-receiver-plane-v50.js?v=3';
import {installSkateReceiverPlane50} from './skate-receiver-plane-v50.js?v=1';
import {installCurbShadows49} from './curb-shadow-v49.js?v=curb6';
import {createPastelWater} from './pastel-water-v23.js?v=softwave24-2';
import {applyRoadJoin} from './road-join-v34.js';
import {LAND_LOOK,applyRoundedGrass,applyLandFinish} from './land-look-v36.js';
import {applyRoundedShore} from './shore-round-v37.js';
import {installCarControls108,createPastelTraffic108} from './pastel-car-v108.js?v=110.2';
import {createTerrainSampler} from './terrain-sampler-v27.js?v=1';
import {sealOpenTerrain,unifyCurbFinish} from './surface-seal-v32.js?v=2';
import { GLTFLoader } from './GLTFLoader.js';
import { RoomEnvironment } from './RoomEnvironment.js';
import {prepareCoast,addDryInterior,configureInteriorWater,dryInteriorAt} from './coast-grade-v21.js?v=3';
import {installSurfaceFinish} from '../app/surface-finish.js';
import {cacheStaticTransforms} from '../app/island-static-transforms.js';
import {installIslandShadowCache,createShadowAnchor} from '../app/island-shadow-cache.js';
import {waterWithSolidFloor,createPondWater} from '../app/island-water-floor.js';
import {treeIndex} from '../app/island-motion.js';
import {entryStage} from '/67park-island/app/entry-loading.js';
import {preserveAuthoredIslandEnvironment} from '../app/island-environment.js';
export async function createIslandRuntime({renderer,sahne,kam}) {
const islandStartupAssets=createIslandAssetCache();
try {
const initialChildren=new Set(sahne.children);
let kameraModu='game';
function pastelProfiliniUygula(mod){
  const harita=mod==='map', yakin=mod==='close';
  renderer.toneMappingExposure=harita?POZLAMA_HARITA:(yakin?POZLAMA_YAKIN:POZLAMA_OYUN);
  LAND_EXPOSURE_35.value=LAND_LOOK.exposure/renderer.toneMappingExposure;
  renderer.domElement.dataset.landExposure=LAND_LOOK.exposure.toFixed(2);
  gunes.intensity=harita?(mobil?1.34:1.38):(yakin?(mobil?1.40:1.46):(mobil?1.44:1.50));
  const ortamCarpani=harita?(mobil?0.82:0.85):(yakin?(mobil?0.92:0.94):1.0);
  for(const malzeme of PASTEL_MALZEMELER){
    const taban=malzeme.userData.pastelEnvBase;
    if(Number.isFinite(taban)){
      malzeme.envMapIntensity=taban*(malzeme.userData.landFinish35?1:ortamCarpani);
      malzeme.needsUpdate=true;
    }
  }
  const ortamOrnegi=[...PASTEL_MALZEMELER].find(m=>
    Number.isFinite(m.userData.pastelEnvBase) && m.userData.pastelEnvBase>0
  );
  renderer.domElement.dataset.environmentMultiplier=ortamCarpani.toFixed(2);
  renderer.domElement.dataset.environmentMaterialCount=String(PASTEL_MALZEMELER.size);
  renderer.domElement.dataset.environmentProbe=ortamOrnegi?[
    ortamOrnegi.userData.pastelEnvBase,ortamOrnegi.envMapIntensity
  ].map(v=>v.toFixed(6)).join(','):'';
  renderer.domElement.dataset.pastelGrade=[
    mod,renderer.toneMappingExposure,gunes.intensity,ortamCarpani
  ].join(',');
}





















const islandPrerequisitesStarted=performance.now();
const [roadSealMeta64,roadSealBuffer64,parkPondMeta65,parkPondBuffer65,roadMeta56,roadBuffer56,sideMeta50,sideBuffer50,coastGradeData,curbMeta49,curbBuffer49,wallPatch48,dividerMeta55,dividerBuffer55,roadJoinPatch,landformMeta,landformBuffer,shoreRoundMeta,shoreRoundBuffer]=await loadIslandPrerequisites([
async()=>islandFetch('./road-seal-v64.json?v=road-seal-r1').then(r=>{if(!r.ok)throw Error('road seal64 metadata');return r.json();}),
async()=>islandFetch('./road-seal-v64.bin?v=road-seal-r1').then(r=>{if(!r.ok)throw Error('road seal64 geometry');return r.arrayBuffer();}),
async()=>islandFetch('./park-pond-v65.json?v=pond-v65-P8-pastel-closure-r6').then(r=>{if(!r.ok)throw Error('park pond65 metadata');return r.json();}),
async()=>islandFetch('./park-pond-v65.bin?v=pond-v65-P8-pastel-closure-r6').then(r=>{if(!r.ok)throw Error('park pond65 geometry');return r.arrayBuffer();}),
async()=>islandFetch('./coastal-road-v56.json?v=1').then(r=>{if(!r.ok)throw Error('road56 metadata');return r.json();}),
async()=>islandFetch('./coastal-road-v56.bin?v=1').then(r=>{if(!r.ok)throw Error('road56 geometry');return r.arrayBuffer();}),
async()=>islandFetch('./side-continuity-v50.json?v=1').then(r=>{if(!r.ok)throw Error('Yüzey verisi yüklenemedi');return r.json();}),
async()=>islandFetch('./side-continuity-v50.bin?v=1').then(r=>{if(!r.ok)throw Error('Yüzey normalleri yüklenemedi');return r.arrayBuffer();}),
async()=>islandFetch('./coast-grade-v21.json?v=3').then(r=>{if(!r.ok)throw Error('Coast grade data unavailable');return r.json();}),
async()=>islandFetch('./curb-polish-v49.json?v=curb6').then(r=>{if(!r.ok)throw Error('Kaldırım verisi yüklenemedi');return r.json();}),
async()=>islandFetch('./curb-polish-v49.bin?v=curb6').then(r=>{if(!r.ok)throw Error('Kaldırım geometrisi yüklenemedi');return r.arrayBuffer();}),
async()=>islandFetch('./small-island-walls-v48.json?v=walls3').then(r=>{if(!r.ok)throw Error('Küçük ada duvarları yüklenemedi');return r.json();}),
async()=>islandFetch('./small-island-match-v55.json?v=1').then(r=>{if(!r.ok)throw Error('divider55 metadata');return r.json();}),
async()=>islandFetch('./small-island-match-v55.bin?v=1').then(r=>{if(!r.ok)throw Error('divider55 geometry');return r.arrayBuffer();}),
async()=>(await islandFetch('./road-join-v34.json')).json(),
async()=>islandFetch('./landform-v35.json').then(r=>r.json()),
async()=>islandFetch('./landform-v35.bin').then(r=>r.arrayBuffer()),
async()=>islandFetch('./shore-round-v37.json').then(r=>r.json()),
async()=>islandFetch('./shore-round-v37.bin').then(r=>r.arrayBuffer())
],4);
renderer.domElement.dataset.islandPrerequisites=JSON.stringify({files:19,concurrency:4,elapsedMs:Math.round(performance.now()-islandPrerequisitesStarted)});

// Required data already consumed by the bounded startup queue.





// Required data already consumed by the bounded startup queue.


// Required data already consumed by the bounded startup queue.

















// Required data already consumed by the bounded startup queue.
const bilgi=document.createElement('div'), hataEl=document.createElement('div'), bas=document.createElement('div');
const gorunumKontrolleri=document.createElement('div');
const tamHaritaBtn=document.createElement('div'), yakinBakisBtn=document.createElement('div');
const oyunaDonBtn=document.createElement('div'), incelemeDurumu=document.createElement('div');
const tamEggyOyun=document.createElement('div');
tamEggyOyun.href='http://'+(location.hostname==='127.0.0.1'?'Oscar-Mac-mini.local':location.hostname)+':8013/';
function hata(m){hataEl.textContent=m; console.error(m);}


const mobil=/iPhone|iPad|Android/i.test(navigator.userAgent) || innerWidth<=600;
const urlParams=new URLSearchParams();
const CURB49_NAMES=['6_BORDUR','7_KALDIRIM_TABANI','7_MERKEZ_KALDIRIM_TABANI','7_DOGU_SAHIL_KAVSAK_TABANI'];
// Required data already consumed by the bounded startup queue.
// Required data already consumed by the bounded startup queue.
// Required data already consumed by the bounded startup queue.
const qaModu=urlParams.get('qa');
// Required data already consumed by the bounded startup queue.
// Required data already consumed by the bounded startup queue.
// Required data already consumed by the bounded startup queue.
// Salt yerel kalite kontrolunde, kalite kapisi henuz terfi ettirmedigi
// export adayini canli dosyanin ustune yazmadan inceleyebil.
const GLB_DOSYASI=urlParams.get('model')==='pending'
  ? 'ada_calisma.pending.glb'
  : '/67park-island/island/ada_calisma.glb';
// Export sonrasi SHA on eki bu marker'a yazilir. finish_gate/v parametresi
// verildiginde ayni anahtar gercek GLB istegine de aktarilir; telefon ve QA
// artik yeni HTML icinde eski modeli cache'ten acamaz.
const STATIC_GLB_REV='a06f6599ef46';
const GLB_REV=urlParams.get('finish_gate')||urlParams.get('v')||STATIC_GLB_REV;
// Tek pastel-maket paleti: Blender kus renderi ve canli WebGL ayni kaynak
// tonlari kullanir. Pastel, her seyi beyaza kaldirmak degil; komsu genis
// yuzeyler arasinda yeterli aciklik ve renk farkini korumaktir.
const PASTEL_RENK=Object.freeze({
  arkaDeniz:0xc4ccdd,
  su:0xa6bbe4,
  kum:LAND_LOOK.sand,
  adaGovde:LAND_LOOK.body,
  cim:LAND_LOOK.grass,
  koyuCim:LAND_LOOK.darkGrass,
  yol:0xd79e9f,
  kaldirim:0xedcdbf,
  bordur:0xe7c0b3
});
const KIYI_KUM_RENGI=PASTEL_RENK.kum;
const ADA_GOVDE_RENGI=PASTEL_RENK.adaGovde;
// Kiyi ciminin altindaki fiziksel tasiyici ayri bir gri/toprak seridi gibi
// okunmaz. Referanstaki kesit, cimin altinda devam eden ayni sicak kumdur;
// kot farki ve cimin kendi dik yani yeterli, yumusak temasi verir.
const KIYI_TOPRAK_RENGI=KIYI_KUM_RENGI;

// İnce diyagonal cim/kum sinirlari 1x ve 2x tamponda piksel basamaklariyla
// fiziksel kirikmis gibi okunuyordu. Rengi/dokuyu degistirmeden sahneyi hafif
// supersample et; iPhone DPR=3 korunur, masaustu QA da 1.5x olur.
// Kimi PerfGovernor owns DPR; no duplicate high-DPI multiplier.
// R3F owns the viewport and drawing buffer together.
renderer.shadowMap.enabled=true; renderer.shadowMap.type=THREE.PCFSoftShadowMap;
// Yalniz yakin QA karsilastirmasi: geometri kirigi ile shadow-map kirigini
// birbirinden ayirir. Normal oyun ve yayin gorunumu daima golgeli kalir.
if(urlParams.get('qa_shadow')==='off') renderer.shadowMap.enabled=false;
if('outputColorSpace' in renderer) renderer.outputColorSpace=THREE.SRGBColorSpace;
// Blender sunum renderi AgX kullaniyor. Three r160 ayni ton eslemeyi yerel
// olarak destekliyor; iki farkli highlight roll-off ile renk kovalamiyoruz.
renderer.toneMapping=THREE.AgXToneMapping;
// AgX, eski ACES ayarindaki dusuk pozlamayi bire bir kullaninca pastel
// kaynak renkleri telefonda bir stop kadar karartiyordu. Harita profili,
// referanstaki acik maket tonlarini sRGB cikista yeniden gorunur kilarken
// yakin/oyun profilleri parlak beyazlari popsyacak kadar kontrolludur.
const POZLAMA_OYUN=mobil?1.12:1.15;
const POZLAMA_HARITA=mobil?2.28:2.30;
const POZLAMA_YAKIN=mobil?1.24:1.27;
renderer.toneMappingExposure=POZLAMA_OYUN;
// Land alone keeps one exposure across map/close/game. Water, roads and
// character retain their existing view profiles; there is no self-illumination.
const LAND_EXPOSURE_35={value:LAND_LOOK.exposure/renderer.toneMappingExposure};


sahne.background=new THREE.Color(PASTEL_RENK.arkaDeniz);
// Ucus/kus bakisinda 450 m'lik adayi sis beyazina gommeden, yalniz uzak deniz
// ufkunu yumusatir. Onceki 334 m far degeri mobil haritayi bastan sona yikardi.
const NORMAL_SIS_YAKIN=mobil?380:420, NORMAL_SIS_UZAK=mobil?1200:1350;
sahne.fog=new THREE.Fog(PASTEL_RENK.arkaDeniz,NORMAL_SIS_YAKIN,NORMAL_SIS_UZAK);
// Harita kotlari santimetrelerle ayriliyor. Uzak kusbakisinda 0.1/2000
// derinlik araligi bu katlari ayni depth dilimine sikistirip beyaz benekler
// uretiyordu; 0.5 m yakin duzlem oyuncu kamerasinin cok gerisinde kalir.


const pmrem=new THREE.PMREMGenerator(renderer);
sahne.environment=pmrem.fromScene(new RoomEnvironment(),0.04).texture;
// Genis acik renkli zeminleri pastel tutarken onceki yuksek fill, gercek
// kotlarin dik yanlarini da ust kapak kadar aydinlatip haritayi 2B cizim gibi
// gosteriyordu. Daha koyu sicak alt hemisfer yalniz dik/alt yuzleri ayirir;
// ust renkleri ve plan geometrisini degistirmez.
sahne.add(new THREE.HemisphereLight(0xdfe9ff,0x978881,mobil?0.13:0.15));
const gunes=new THREE.DirectionalLight(0xfff3ec,mobil?1.44:1.50);
gunes.position.set(94,132,-72); gunes.castShadow=true;
gunes.shadow.mapSize.set(2048,2048);
// Ince beyaz ayiricilarin golgesi mobilde iri texel/radius yuzunden yamuk
// gorunmesin: telefonda takip eden golge alanini daraltip PCF yumusamasini
// kontrollu tutuyoruz. Masaustu gorunumu ayni kalir.
const GOLGE_YARI=mobil?52:72;
gunes.shadow.radius=mobil?4.0:4.5;
gunes.shadow.bias=-0.00002; gunes.shadow.normalBias=mobil?0.012:0.014;
gunes.shadow.camera.left=-GOLGE_YARI; gunes.shadow.camera.right=GOLGE_YARI;
gunes.shadow.camera.top=GOLGE_YARI; gunes.shadow.camera.bottom=-GOLGE_YARI;
gunes.shadow.camera.near=0.5; gunes.shadow.camera.far=340;
if('intensity' in gunes.shadow) gunes.shadow.intensity=0.50;
sahne.add(gunes); sahne.add(gunes.target);
function golgeKadrajiUygula(yari){
  const gkam=gunes.shadow.camera;
  gkam.left=-yari; gkam.right=yari; gkam.top=yari; gkam.bottom=-yari;
  gkam.updateProjectionMatrix();
  renderer.domElement.dataset.shadowHalfSpan=yari.toFixed(2);
}
golgeKadrajiUygula(GOLGE_YARI);
const GUNES_OFSET=new THREE.Vector3(94,132,-72);
const stableSunShadow52=createStableSunShadow52(gunes,GUNES_OFSET);
renderer.domElement.dataset.shadowStability='light-space-texel-v52';
const GOLGE_BAKIS_YONU=new THREE.Vector3();
const GOLGE_HEDEFI=new THREE.Vector3();

// Tek ve opak deniz duzlemi; kiyinin geometri/sinirini degistirmez. Iki
// analitik mikro dalga yalniz fragman normalini oynatir: displacement,
// transparan katman ve mobilde moire uretecek tekrarli texture yoktur.
const DENIZ_U={zaman:{value:0}};
const denizMat=new THREE.MeshStandardMaterial({
  color:PASTEL_RENK.su,roughness:0.72,metalness:0.0,transparent:false,
  opacity:1.0,depthWrite:true,depthTest:true
});
denizMat.envMapIntensity=mobil?0.34:0.38;
// Three r160'da Scene.environmentIntensity yoktur. Kamera modlarindaki ortam
// farki, gercekten rendera giren MeshStandardMaterial.envMapIntensity uzerinde
// uygulanir; taban degerler her malzemede saklanip mod degisiminde geri gelir.
const PASTEL_MALZEMELER=new Set([denizMat]);
denizMat.userData.pastelEnvBase=denizMat.envMapIntensity;
denizMat.dithering=true;
denizMat.onBeforeCompile=(sh)=>{
  sh.uniforms.uDenizZaman=DENIZ_U.zaman;
  sh.vertexShader=sh.vertexShader
    .replace('#include <common>','#include <common>\nvarying vec3 vDenizDunya;')
    .replace('#include <fog_vertex>','vDenizDunya=(modelMatrix*vec4(transformed,1.0)).xyz;\n#include <fog_vertex>');
  sh.fragmentShader=sh.fragmentShader
    .replace('#include <common>','#include <common>\nuniform float uDenizZaman;\nvarying vec3 vDenizDunya;')
    .replace('#include <map_fragment>','#include <map_fragment>\nvec2 dP67=vDenizDunya.xz;\nfloat dA67=dot(dP67,vec2(0.27,0.19))+uDenizZaman*0.16;\nfloat dB67=dot(dP67,vec2(-0.51,0.63))-uDenizZaman*0.11;\nvec2 dG67=0.012*cos(dA67)*normalize(vec2(0.27,0.19))+0.006*cos(dB67)*normalize(vec2(-0.51,0.63));')
    .replace('#include <normal_fragment_begin>','#include <normal_fragment_begin>\nnormal=normalize(mat3(viewMatrix)*normalize(vec3(-dG67.x,1.0,-dG67.y)));')
    .replace('#include <roughnessmap_fragment>','#include <roughnessmap_fragment>\nroughnessFactor=clamp(roughnessFactor+0.012*sin(dA67-dB67),0.72,0.78);');
};
denizMat.customProgramCacheKey=()=>'67-water-world-dual-normal-v1';
const deniz=new THREE.Mesh(new THREE.PlaneGeometry(4000,4000),denizMat);
deniz.name='0_DENIZ_WEB_PBR';
deniz.rotation.x=-Math.PI/2; deniz.position.y=-0.6;
deniz.castShadow=false; deniz.receiveShadow=true;
deniz.userData.safeShadowCaster=false;
sahne.add(deniz);
renderer.domElement.dataset.waterMaterial=denizMat.type;
renderer.domElement.dataset.waterShader='world-space-dual-normal-v1';
renderer.domElement.dataset.waterRoughness=denizMat.roughness.toFixed(2);

// Eggy Party'deki WaterBody'nin hafif, bağımsız web uyarlaması. Eski deniz
// yüzeyi yalnız taban gölgesi olarak kalır; bu katman görünür dalga, parlak
// sığ su ve oyuncunun etrafında köpük halkası üretir. Kara meshlerine dokunmaz.
const KIMI_SU_U={
  zaman:DENIZ_U.zaman, oyuncu:{value:new THREE.Vector2(99999,99999)},
  oyuncuSuda:{value:0}, yarim:{value:new THREE.Vector2(700,700)},
  karaDoku:{value:new THREE.DataTexture(new Uint8Array([0,0,0,255]),1,1)}, karaMin:{value:new THREE.Vector2(0,0)}, karaBoy:{value:new THREE.Vector2(1,1)}
};
KIMI_SU_U.karaDoku.value.needsUpdate=true;
const kimiSuMat=createPastelWater(KIMI_SU_U,renderer.domElement.dataset);
const kimiSu=new THREE.Mesh(new THREE.PlaneGeometry(1400,1400,96,96),kimiSuMat);
kimiSu.name='KIMI_WATERBODY_GORUNUR'; kimiSu.rotation.x=-Math.PI/2; kimiSu.position.y=deniz.position.y+0.018;
kimiSu.frustumCulled=false; kimiSu.renderOrder=1; sahne.add(kimiSu);
// Önceki saydam PBR deniz katmanı teknik tabanı suyun içinden gösteriyordu.
// WaterBody artık opak olduğundan yalnız bu gerçek görünür su katmanı çizilir.
deniz.visible=false;
// Swimming ripples are now integrated into the water; no opaque white ring mesh.

// Six Seven Park's characters and equipment, separated from its buildings.
let eggyGoril=null,eggyGorilYuzuyor=false,eggyGorilTabanOfset=0;
let eggyController=null,mobileRun=false,lunaRideControls84=null,lunaQA87=null,carControls108=null,pastelTraffic108=null;
let smallIslandProps=null,smallIslandStatTriangles=-1,smallIslandBaseTriangles=0,smallIslandMapLabel='';
let parkProps57=null,cityProps60=null,centralBuildings68=null,lunapark77=null,seasideTimber79=null,lowerPlaza83=null,northwestSports97=null,stadiumCoast99=null,westCourtyard102=null,bottomHomes103=null,northPool104=null,northHomes=null,northwest93=null,northApartments=null,livingEffects107=null;
const smallIslandGround=(x,z,ignoreCar=false)=>{
  if(northPool104?.inBasin(x,z))return northPool104.obstacle(x,z);
  const land=zeminY(x,z),prop=smallIslandProps?.obstacle(x,z),park=parkProps57?.obstacle(x,z),city=cityProps60?.obstacle(x,z);
  const values=[land,prop,park,city,northwest93?.obstacle(x,z),northApartments?.obstacle(x,z),northHomes?.obstacle(x,z),centralBuildings68?.obstacle(x,z),lunapark77?.obstacle(x,z),seasideTimber79?.height(x,z),lowerPlaza83?.obstacle(x,z),northwestSports97?.obstacle(x,z),stadiumCoast99?.obstacle(x,z),westCourtyard102?.obstacle(x,z),bottomHomes103?.obstacle(x,z),northPool104?.obstacle(x,z),ignoreCar?null:pastelTraffic108?.obstacle(x,z)].filter(v=>v!=null);return values.length?Math.max(...values):null;
};
const parkEnvironment=()=>({ground:smallIslandGround,water:(x,z)=>northPool104?.contains(x,z)?northPool104.isWater(x,z):(northwest93?.ground(x,z)!=null||northHomes?.ground(x,z)!=null||bottomHomes103?.ground(x,z)!=null||westCourtyard102?.ground(x,z)!=null||stadiumCoast99?.ground(x,z)!=null||lowerPlaza83?.ground(x,z)!=null||seasideTimber79?.height(x,z)!=null||cityProps60?.obstacle(x,z)!=null||parkProps57?.obstacle(x,z)!=null)?false:sudaMi(x,z),sea:()=>northPool104?.waterLevelAt(eggyController?.sim.position.x,eggyController?.sim.position.z)??kimiSu.position.y,
  footOffset:()=>eggyGorilTabanOfset,cameraBlockers:()=>[...zeminler,...(northwest93?.cameraBlockers??[]),...(northApartments?.cameraBlockers??[]),...(northHomes?.cameraBlockers??[]),...(cityProps60?.cameraBlockers??[]),...(centralBuildings68?.cameraBlockers??[]),...(lunapark77?.cameraBlockers??[]),...(seasideTimber79?.cameraBlockers??[]),...(lowerPlaza83?.cameraBlockers??[]),...(northwestSports97?.cameraBlockers??[]),...(stadiumCoast99?.cameraBlockers??[]),...(westCourtyard102?.cameraBlockers??[]),...(bottomHomes103?.cameraBlockers??[]),...(northPool104?.cameraBlockers??[])],
  data:renderer.domElement.dataset,scene:sahne,
  cameraGround:smallIslandGround});
// Zemin renkleri temiz pastel kil olarak kalir. Yol, kum ve cime fotografik
// grain/benek bindirilmez; gercek derinligi yalniz geometri, PBR roughness ve
// yumusak isik okutur.
const GRAIN_U=[];
function taneciklendir(){ /* Bilerek devre disi: pastel yuzeyde benek yok. */ }

// v35: the real grass crown supplies the rounded edge. The existing 512 px
// mask now adds only a narrow, restrained contact shadow on adjacent sand.
// Sample toward the actual light to project the shadow away from it: sun
// upper-right, shadow lower-left in the mandatory north-up map orientation.
// Road/bridge geometry and the approved shore/water height remain unchanged.
const KABARTMA_BOS=new THREE.DataTexture(new Uint8Array([0,0,0,255]),1,1);
KABARTMA_BOS.needsUpdate=true;
const KABARTMA_U={
  doku:{value:KABARTMA_BOS},
  min:{value:new THREE.Vector2(0,0)},
  boy:{value:new THREE.Vector2(1,1)},
  isik:{value:new THREE.Vector2(GUNES_OFSET.x,GUNES_OFSET.z).normalize()}
};
// R: dolu cim, G: bulanik cim, B: dolu ada, A: bulanik ada silueti.
const KABARTMA_CIM_GLSL=`
vec2 kbUv67=(vKabDunya.xz-uKabMin)/uKabBoy;
if(kbUv67.x>0.0&&kbUv67.x<1.0&&kbUv67.y>0.0&&kbUv67.y<1.0){
  vec4 kbT67=texture2D(uKabDoku,kbUv67);
  vec4 kbS67=texture2D(uKabDoku,clamp(kbUv67+uKabIsik*0.85/uKabBoy,0.0,1.0));
  float kbB67=clamp((kbS67.g-kbT67.r)/0.35,0.0,1.0);
  kbB67=kbB67*kbB67*(3.0-2.0*kbB67);
  // Yalniz yonlu ornekleme bir kenari tamamen isiksiz birakiyordu. Dolu
  // cim ile ayni konumdaki bulanik maske farkindan butun cevreye ince bir
  // temas/AO cekirdegi kur; yonlu golgenin kuvvetli oldugu tarafta bu katkıyı
  // azalt ki iki kat siyah kontur olusmasin.
  float kbC67=smoothstep(0.06,0.30,clamp(kbT67.g-kbT67.r,0.0,1.0));
  float kbD67=max(kbB67*0.80,kbC67*0.45);
  diffuseColor.rgb=mix(diffuseColor.rgb,diffuseColor.rgb*vec3(0.60,0.65,0.68),kbD67);
  vec4 kbH67=texture2D(uKabDoku,clamp(kbUv67-uKabIsik*0.55/uKabBoy,0.0,1.0));
  float kbA67=clamp((kbH67.g-kbT67.r)/0.35,0.0,1.0);
  kbA67=kbA67*kbA67*(3.0-2.0*kbA67);
  diffuseColor.rgb*=1.0+kbA67*0.035*(1.0-kbC67*0.65);
`;
const KABARTMA_KUM_EK_GLSL=`
  float kbE67=clamp((kbT67.b-kbT67.a)*2.0,0.0,1.0);
  kbE67=kbE67*kbE67*(3.0-2.0*kbE67);
  diffuseColor.rgb*=1.0-kbE67*0.22;`;
function kabartmaBagla(mat,kumEgimi){
  if(!mat) return;
  mat.userData=mat.userData||{};
  if(mat.userData.kabartma67) return;
  const mod=kumEgimi?'kum':'cim';
  mat.userData.kabartma67=mod;
  const onceki=mat.onBeforeCompile;
  mat.onBeforeCompile=(sh)=>{
    if(onceki) onceki(sh);
    sh.uniforms.uKabDoku=KABARTMA_U.doku;
    sh.uniforms.uKabMin=KABARTMA_U.min;
    sh.uniforms.uKabBoy=KABARTMA_U.boy;
    sh.uniforms.uKabIsik=KABARTMA_U.isik;
    sh.vertexShader=sh.vertexShader
      .replace('#include <common>','#include <common>\nvarying vec3 vKabDunya;')
      .replace('#include <fog_vertex>','vKabDunya=(modelMatrix*vec4(transformed,1.0)).xyz;\n#include <fog_vertex>');
    sh.fragmentShader=sh.fragmentShader
      .replace('#include <common>','#include <common>\nuniform sampler2D uKabDoku;\nuniform vec2 uKabMin;\nuniform vec2 uKabBoy;\nuniform vec2 uKabIsik;\nvarying vec3 vKabDunya;')
      .replace('#include <map_fragment>','#include <map_fragment>\n'+
        KABARTMA_CIM_GLSL+(kumEgimi?KABARTMA_KUM_EK_GLSL:'')+'\n}');
  };
  const oncekiKey=typeof mat.customProgramCacheKey==='function'
    ? mat.customProgramCacheKey.bind(mat):null;
  mat.customProgramCacheKey=()=>'67-kabartma-'+mod+'-'+(oncekiKey?oncekiKey():'std');
}

// Benek, noise veya normal map kullanmadan maket katmanlarinin gercek dik
// yanlarini ayni rengin biraz koyu tonu olarak okut. Tam yatay kapaklar
// degismez; yalnız mevcut fiziksel kalinlik gorunur olur. Bu nedenle kum,
// yol, kaldirim ve cim ayrimi her gunes yonunde kuzeybati kum omzu kadar net
// kalir, fakat yuzeylerde fotografik doku/lekelenme olusmaz.
function kilKenarDerinligi(mat,guc){
  if(!mat || guc<=0) return;
  mat.userData=mat.userData||{};
  if(mat.userData.kilKenarDerinligi67!==undefined) return;
  mat.userData.kilKenarDerinligi67=guc;
  const onceki=mat.onBeforeCompile;
  mat.onBeforeCompile=(sh)=>{
    if(onceki) onceki(sh);
    const sabit=Math.max(0,Math.min(0.30,guc)).toFixed(4);
    sh.fragmentShader=sh.fragmentShader.replace(
      '#include <normal_fragment_maps>',
      '#include <normal_fragment_maps>\nvec3 kUp67=normalize(mat3(viewMatrix)*vec3(0.0,1.0,0.0));\nfloat kYan67=pow(clamp(1.0-abs(dot(normal,kUp67)),0.0,1.0),0.82);\ndiffuseColor.rgb*=mix(1.0,1.0-'+sabit+',kYan67);'
    );
  };
  mat.customProgramCacheKey=()=>`67-clean-clay-side-depth-v2-${guc.toFixed(3)}`;
}

// Genis duz kapaklari shadow-map'e sokmadan yalniz halihazirda modelde var
// olan GERCEK dik yan yuzlerden temas golgesi uret. Boylece ust yuzlerdeki
// triangulation/kare bant riski sifir kalir; kum, yol ve kaldirim kotlariysa
// kusbakisinda da fiziksel maket katmani olarak okunur. Yardimci mesh renk ve
// depth tamponuna yazmaz, raycast/collision listesine de hic eklenmez.
const DIK_YAN_GOLGE_KAYNAGI=/^(?:3_CIMEN(?:_KOYU)?|4_(?:(?:ANA_)?KUMTABAN|DOGU_SAHIL_UST_TOPRAK)|5_YOL|6_BORDUR|7_(?:KALDIRIM_TABANI|MERKEZ_KALDIRIM_TABANI|DOGU_SAHIL_KAVSAK_TABANI))(?:$|[._-])/i;
const dikYanGolgeMat=new THREE.MeshBasicMaterial({
  color:0x000000,side:THREE.DoubleSide,colorWrite:false,depthWrite:false
});
const dikYanDerinlikMat=new THREE.MeshDepthMaterial({
  depthPacking:THREE.RGBADepthPacking,side:THREE.DoubleSide,
  polygonOffset:true,polygonOffsetFactor:1.2,polygonOffsetUnits:4
});
function dikYanGolgeGeometrisi(kaynak){
  const pos=kaynak?.attributes?.position;
  if(!pos) return null;
  const idx=kaynak.index, cikti=[];
  const a=new THREE.Vector3(),b=new THREE.Vector3(),c=new THREE.Vector3();
  const ab=new THREE.Vector3(),ac=new THREE.Vector3(),n=new THREE.Vector3();
  const ucgen=idx?idx.count:pos.count;
  for(let i=0;i+2<ucgen;i+=3){
    const ia=idx?idx.getX(i):i, ib=idx?idx.getX(i+1):i+1, ic=idx?idx.getX(i+2):i+2;
    a.fromBufferAttribute(pos,ia); b.fromBufferAttribute(pos,ib); c.fromBufferAttribute(pos,ic);
    ab.subVectors(b,a); ac.subVectors(c,a); n.crossVectors(ab,ac);
    if(n.lengthSq()<1e-14) continue;
    n.normalize();
    const dikeyAralik=Math.max(a.y,b.y,c.y)-Math.min(a.y,b.y,c.y);
    if(Math.abs(n.y)>0.35 || dikeyAralik<0.00004) continue;
    // Cok alcak slablarin tek parca, onlarca metre uzunlugundaki yan
    // quadlari GLB'de iki dev ucgene bolunur. Geometrik olarak ayni duzlemde
    // olsalar da mobil PCF shadow-map aradaki diagonali ince bir boya kirigi
    // gibi gosterebilir. Gercek modeli degistirmeden yalniz temas-golgesi
    // yardimcisindaki bu asiri uzun/ince ucgenleri atla; kisa organik
    // kum/cim segmentleri ile yol ve kaldirim hacmi korunur.
    const yatayAB=Math.hypot(b.x-a.x,b.z-a.z);
    const yatayAC=Math.hypot(c.x-a.x,c.z-a.z);
    const yatayBC=Math.hypot(c.x-b.x,c.z-b.z);
    const enUzunYatay=Math.max(yatayAB,yatayAC,yatayBC);
    if(dikeyAralik<=0.00011 && enUzunYatay>0.03) continue;
    cikti.push(a.x,a.y,a.z,b.x,b.y,b.z,c.x,c.y,c.z);
  }
  if(!cikti.length) return null;
  const geo=new THREE.BufferGeometry();
  geo.setAttribute('position',new THREE.Float32BufferAttribute(cikti,3));
  geo.computeBoundingBox(); geo.computeBoundingSphere();
  return geo;
}

const isin=new THREE.Raycaster(), asagi=new THREE.Vector3(0,-1,0);
let zeminler=[], hazir=false, DOG=null, DOG_YAW=-Math.PI/2, adaKok=null,terrainSampler=null;
function zeminVurusu(x,z){ if(terrainSampler)return terrainSampler.sample(x,z);isin.set(new THREE.Vector3(x,80,z),asagi);
  const v=isin.intersectObjects(zeminler,false); return v.length?v[0]:null; }
function zeminY(x,z){ const v=zeminVurusu(x,z); return v?v.point.y:null; }
// Teknik 1_TABAN yüzeyi ada toprağı değildir. Player yalnız bu destek
// yüzeyine çıktığında artık gerçek WaterBody alanındadır; böylece köşede
// yüzme pozu görünüp görünür suya geçememe hatası oluşmaz.
function sudaMi(x,z){ const v=zeminVurusu(x,z); if(!v||!v.object.visible)return true;
  if(dryInteriorAt(x/DUNYA_OLCEGI+SABIT_MERKEZ_X,z/DUNYA_OLCEGI+SABIT_MERKEZ_Z,coastGradeData))return false;
  return v.point.y<kimiSu.position.y+0.006; }

const OLCEK_HEDEF=320;
// Harita buyudukce mevcut yollar/karakter orani kuculmamali. Ilk onayli
// modelin 320 m'lik kuzey-guney boyu ve merkezi sabit kalir; yeni kara gercek
// dunya alani olarak yalniz doguya eklenir.
const OLCEK_NATIVE_UZUNLUK=1.7831611037254333;
const DUNYA_OLCEGI=OLCEK_HEDEF/OLCEK_NATIVE_UZUNLUK;
const SABIT_MERKEZ_X=-0.04531264305114746;
const SABIT_MERKEZ_Z=0.012233048677444458;
// Normal oyun dogrudan guneydogudaki goletli parkta baslar. Kaynak ankraj,
// V6 pembe patikanin bati girisinde ve her kenardan guvenli pay birakan
// yurunebilir noktadir. Blender Y ekseni web'de -Z oldugu icin donusum burada
// acik yazilir; harita olcegi degisse bile ayni fiziksel park noktasinda kalir.
const PARK_DOGUS_NATIVE=new THREE.Vector2(0.500,-0.349940);
DOG=[
  (PARK_DOGUS_NATIVE.x-SABIT_MERKEZ_X)*DUNYA_OLCEGI,
  (-PARK_DOGUS_NATIVE.y-SABIT_MERKEZ_Z)*DUNYA_OLCEGI
];
// KALICI KALITE KURALI: genis, duz zemin kapaklari kendi shadow-map'ine
// yazilmaz. Aksi halde PCF derinlik karsilastirmasi, tamamen duz bir yuzeyde
// bile ucleme sinirlarini kare/diyagonal bantlar olarak gosterebilir.
// Zemin yine bina/obje golgelerini alir; yalniz hacimli objeler golge atar.
// Adi zemin islevi anlatan gelecek katmanlar da otomatik olarak bu kurala
// girer; yeni obje eklerken listeyi elle genisletmeye guvenmiyoruz.
const DUZ_ZEMIN=/(?:TABAN|ZEMIN|YOL|CIM|BORDUR|KALDIRIM|OMUZ|AYIRICI|YAYA_GECIDI|CIZGI|GOLET|PARK_TEPE|SU)/i;
const KIYI_KUM_OMUZ=/^(?:67D_KIYI_KUM_OMUZ|67F_ANA_ADA_ALT_KOPRU_KUM_OMUZ)(?:$|[._-])/i;
// Uzun patika ve ince kopru deck'i mobil shadow-map'te kare/diyagonal bant
// uretebilir. Park geometrisi ve PBR derinligi korunur; yalniz kompakt kubbe
// temiz bir temas golgesi atar.
const PARK_KABARTMA=/(?:PARK_PATIKA_UST|PARK_KOPRU_UST|PARK_TEPE)/i;
// Ust kaykay parki zemin degildir. Dusuk profilli olsalar bile bowl, rampa,
// merdiven ve coping parcalari kendi hacimlerini ve kendi GLB malzemelerini
// korur; genel "duz zemin" temizligi bu modellere uygulanamaz.
const UST_SKATEPARK=/^67D_SKATEPARK_/i;
const UST_SKATEPARK_GOLGE_HARIC=/(?:_BASE|_MARK_67|_PERIMETER_SEAM_\d+)$/i;
function genisDuzKapak(mesh){
  const geo=mesh.geometry;
  if(!geo?.attributes?.position) return false;
  if(!geo.boundingBox) geo.computeBoundingBox();
  const boy=new THREE.Vector3(); geo.boundingBox.getSize(boy);
  const yatay=Math.max(boy.x,boy.z), dar=Math.min(boy.x,boy.z);
  // Adi beklenmeyen gelecek bir kaldirim/zemin/ince yatay slab da shadow-map
  // self-acne uretemez. Dikey pano ve hacimli modeller bu profile girmez.
  return yatay>0 && dar>=yatay*0.01 && boy.y<=yatay*0.08;
}
await entryStage(1,'Downloading the Island');
await new Promise((resolve,reject)=>new GLTFLoader().load(`${GLB_DOSYASI}?v=${encodeURIComponent(GLB_REV)}`, async g=>{
 try {
await entryStage(2,'Preparing land and paths');
  const kok=g.scene;
  prepareCoast(kok);
  renderer.domElement.dataset.surfaceSeal=JSON.stringify(sealOpenTerrain(kok));
  renderer.domElement.dataset.roadJoin=JSON.stringify(applyRoadJoin(kok,roadJoinPatch));
  renderer.domElement.dataset.landLook=JSON.stringify(applyRoundedGrass(kok,landformMeta,landformBuffer));
  renderer.domElement.dataset.shoreRound=JSON.stringify(applyRoundedShore(kok,shoreRoundMeta,shoreRoundBuffer));
  renderer.domElement.dataset.curbPolish=JSON.stringify(applyCurbPolish49(kok,curbMeta49,curbBuffer49));
  renderer.domElement.dataset.sideContinuity50=JSON.stringify(applySideContinuity50(kok,sideMeta50,sideBuffer50));
  renderer.domElement.dataset.coastalRoad56=JSON.stringify(applyCoastalRoad56(kok,roadMeta56,roadBuffer56));
  adaKok=kok;
  let modelMeshSayisi=0, duzZeminSayisi=0, duzZeminGolgeAtan=0, kabartmaGolgeAtan=0;
  let konutMeshSayisi=0, konutGolgeAtan=0;
  let skateparkParcaSayisi=0, skateparkGolgeAtan=0;
  let kumOmuzSayisi=0, kumOmuzGolgeAtan=0;
  let cimDerinlikOnceligi=0;
  const dikYanGolgeKaynaklari=[];
  kok.traverse(o=>{ if(o.isMesh){
    modelMeshSayisi++;
    // 9_GOLET_MINI eski plan/collision kimligi olarak GLB'de tutulur fakat
    // yeni gercek S-bowl'un ustunu kapatan duz kapak olarak ne render edilir
    // ne de zemin raycast'ine girer. Yeni DECK+BOWL meshleri collision'i alir.
    const eskiMiniKapak=/^9_GOLET_MINI(?:$|[._-])/i.test(o.name);
    // Meydanin merkez diski, altindaki meydanla ayni renk ve ayni eksiksiz
    // footprinttir. Ayrica yukseltilince yalniz tek tarafli siyah bir yarim
    // yay uretir; referansta bu ikinci basamak yoktur. Kaynak kimligi GLB'de
    // QA icin kalir, gorunen/yurunur zemin alttaki kesintisiz meydandir.
    const gereksizMerkezDisk=/^8_DOGU_SAHIL_MERKEZ_DISK(?:$|[._-])/i.test(o.name);
    // Gercek planklar yalniz dekoratif ust kabuktur. Player/raycast tek ve
    // kesintisiz 8_DOGU_SAHIL_ISKELE_UST tasiyicisinda yurur.
    const dekorIskele=/^67D_ISKELE_AHSAP_/i.test(o.name);
    // Park koprusunun korkuluk ve direkleri gorunur dekor olarak kalir;
    // oyuncunun ayak raycast'i yalniz tek parca 8_PARK_KOPRU_UST guvertesine
    // basar. Boylece korkulugun ustune cikma/ani yukseklik olmaz.
    const dekorKopruKorkulugu=/^67D_REF_(?:RAIL|END_POSTS)_/i.test(o.name);
    const skateparkDetayi=UST_SKATEPARK.test(o.name);
    // Referanstaki yumusak catili pastel evler dekoratif hacimdir. Playernun
    // ayak raycast'i pencere/catiya sicrama yapmaz; buna karsilik gercek bina
    // hacmi olarak yumusak golge atar ve zeminden golge alir.
    const konutModeli=/^67H_EV_/i.test(o.name);
    o.visible=!eskiMiniKapak && !gereksizMerkezDisk;
    // Temporary local-only layer isolation for final P5 visual QA.
    const qaGizliKatman=qaModu && urlParams.get('qa_hide');
    if(qaGizliKatman && o.name.includes(qaGizliKatman)) o.visible=false;
    if(!eskiMiniKapak && !gereksizMerkezDisk && !dekorIskele &&
       !dekorKopruKorkulugu && !konutModeli) zeminler.push(o);
    const parkKabartma=PARK_KABARTMA.test(o.name);
    const duzZemin=!skateparkDetayi && !parkKabartma && !dekorIskele && !konutModeli &&
      (DUZ_ZEMIN.test(o.name) || genisDuzKapak(o));
    if(DIK_YAN_GOLGE_KAYNAGI.test(o.name)) dikYanGolgeKaynaklari.push(o);
    // Park detayini gercek egimli geometri, smooth normal ve PBR okutur.
    // Shadow-map'e yalniz 9_PARK_TEPE yazilir; diger dusuk kabartmalar caster
    // olursa telefonda kare/uckensel yuzey bantlari geri gelir.
    o.castShadow=konutModeli || (skateparkDetayi
      ? !UST_SKATEPARK_GOLGE_HARIC.test(o.name)
      : parkKabartma && /^9_PARK_TEPE(?:$|[._-])/i.test(o.name));
    o.receiveShadow=skateparkDetayi || !parkKabartma;
    o.userData.safeShadowCaster=o.castShadow;
    if(skateparkDetayi){
      skateparkParcaSayisi++;
      if(o.castShadow) skateparkGolgeAtan++;
    }
    if(konutModeli){
      konutMeshSayisi++;
      if(o.castShadow) konutGolgeAtan++;
    }
    if(KIYI_KUM_OMUZ.test(o.name)){
      kumOmuzSayisi++;
      if(o.castShadow) kumOmuzGolgeAtan++;
    }
    if(parkKabartma && o.castShadow) kabartmaGolgeAtan++;
    if(duzZemin){ duzZeminSayisi++; if(o.castShadow) duzZeminGolgeAtan++; }
    o.geometry.deleteAttribute('color');
    if(o.material){
      const im=o.material.map && o.material.map.image;
      if(im && im.width){
        const cc=document.createElement('canvas'); cc.width=cc.height=8;
        const cx=cc.getContext('2d'); cx.drawImage(im,0,0,8,8);
        const d=cx.getImageData(0,0,8,8).data; let r=0,g2=0,b=0;
        for(let k=0;k<d.length;k+=4){r+=d[k];g2+=d[k+1];b+=d[k+2];}
        const n=d.length/4;
        o.material.color.setRGB(r/n/255,g2/n/255,b/n/255,THREE.SRGBColorSpace);
      }
      o.material.map=null; o.material.vertexColors=false; o.material.flatShading=false;
      o.material.metalness=0.0;
      if(duzZemin && 'clearcoat' in o.material){
        o.material.clearcoat=0;
        o.material.clearcoatRoughness=1;
      }
      o.material.dithering=true;
      if(konutModeli){
        // Blender'da ayri ayri ayarlanan sicak siva, mavi-gri cati, cam ve
        // ahsap tonlarini aynen koru. Temiz maket dili icin doku ekleme.
        o.material.roughness=Math.max(0.46,Math.min(0.94,o.material.roughness));
        o.material.envMapIntensity=/CAM/i.test(o.name)?0.62:0.34;
      }
      else if(skateparkDetayi){
        // GLB'deki beton, derin beton, ray, mercan, altin ve mavi malzeme
        // aileleri bilerek korunur. Genel fallback'in roughness=1 zorlamasi
        // bu modelleri duz/kagit gibi gostermemeli.
        o.material.envMapIntensity=0.34;
      }
      else if(/PARK_PATIKA_UST|PARK_KOPRU_UST/i.test(o.name)){
        o.material.color.setHex(PASTEL_RENK.yol);
        o.material.roughness=/KOPRU/i.test(o.name)?0.82:0.84;
        o.material.envMapIntensity=/KOPRU/i.test(o.name)?0.46:0.42;
        if('emissive' in o.material){
          o.material.emissive.setHex(PASTEL_RENK.yol);
          o.material.emissiveIntensity=/KOPRU/i.test(o.name)?0.10:0.18;
        }
        taneciklendir(o.material,'asfalt',1/2.2,mobil?0.62:0.68,0.24);
      }
      else if(/ISKELE_AHSAP|DOGU_SAHIL_(?:ISKELE|BANK)/i.test(o.name)){
        // Uc uzak iskele texture'a bagli degildir: gercek plank geometrisi
        // ve uc sicak ahsap tonu mobilde de ayni maket dilini korur.
        const ahsapHex=/AHSAP_ACIK/i.test(o.name)?0xe0b58e:
          (/AHSAP_YAN/i.test(o.name)?0xb9825d:0xd7a77e);
        o.material.color.setHex(ahsapHex);
        o.material.roughness=/AHSAP_YAN/i.test(o.name)?0.88:
          (/AHSAP_ACIK/i.test(o.name)?0.82:0.84);
        o.material.envMapIntensity=/AHSAP_YAN/i.test(o.name)?0.28:0.34;
      }
      else if(/DOGU_SAHIL_(?:MEYDAN|MERKEZ_DISK)/i.test(o.name)){
        // Referanstaki sag kiyinin sicak acik meydani; gri sahil spor zemini
        // ayri 5_SAHIL_GRI_ZEMIN malzemesiyle bilerek degismeden kalir.
        o.material.color.setHex(0xe3c6b4);
        o.material.roughness=0.90; o.material.envMapIntensity=0.32;
        taneciklendir(o.material,'asfalt',1/2.6,mobil?0.44:0.50,0.20);
      }
      else if(/REF_AYIRICI/i.test(o.name)){
        // Referanstaki cimen ayiricilari kaldirimla ayni sicak krem kildir.
        o.material.color.setHex(PASTEL_RENK.bordur);
        o.material.roughness=0.89; o.material.envMapIntensity=0.39;
      }
      else if(/CIZGI|YAYA_GECIDI/i.test(o.name)){
        // Yaya gecidi boyasi: kirik beyaz, mat ve yuzeye cok yakin.
        o.material.color.setHex(0xfef0f1);
        // Referansta boya, ayni kil malzemenin aydinlik pigmenti gibi okunuyor.
        // Cok dusuk emissive katkisi golgede grilesmesini onler; neon/bloom uretmez.
        if('emissive' in o.material){
          o.material.emissive.setHex(0xfef0f1);
          o.material.emissiveIntensity=0.15;
        }
        o.material.roughness=0.92; o.material.envMapIntensity=0.26;
      }
      else if(/REF_MAIN_WATER_(?:CAP|NECK_CAP)/i.test(o.name)){
        // Dekoratif yumusak su kapagi alttaki gated 9_GOLET_SU ile telefonda
        // birebir ayni tona gelir; iki katman arasinda koyu renk adasi kalmaz.
        o.material.color.setHex(PASTEL_RENK.su);
        o.material.roughness=0.70; o.material.envMapIntensity=0.55;
      }
      else if(/REF_MINI_SKATE_(?:DECK|BOWL|OUTER_RIM|COPING)/i.test(o.name)){
        // Referanstaki platform, coping, duvar ve taban tek bir gri beton
        // ailesidir. Derin kisim ayri mavi/lila boya degil, gercek S-cukurunun
        // PBR isigi ve AO golgesiyle koyulasir.
        o.material.color.setHex(0xcec2b5);
        o.material.roughness=0.90; o.material.envMapIntensity=0.30;
      }
      else if(/GOLET|SU/i.test(o.name)){
        // Büyük gölet şeffaf değildir; alttaki kum triangulation'ı mobilde
        // görünmez ve pastel maket suyu tek, sakin bir renk olarak kalır.
        o.material.color.setHex(PASTEL_RENK.su);
        o.material.roughness=0.70; o.material.envMapIntensity=0.55;
      }
      else if(/PARK_TEPE/i.test(o.name)){
        o.material.color.setHex(0xd0c3b2);
        o.material.roughness=0.80; o.material.envMapIntensity=0.42;
      }
      else if(/CIMEN_KOYU/i.test(o.name)){
        o.material.color.setHex(PASTEL_RENK.koyuCim);
        o.material.roughness=0.92; o.material.envMapIntensity=0.18;
        // 1.8 cm aralikli tasiyici ile uzak kameradaki z-fighting'i, dik
        // yuzeylerde slope kaynakli kirik uretmeden yalniz sabit depth bias ile kes.
        o.material.polygonOffset=true;
        o.material.polygonOffsetFactor=0;
        o.material.polygonOffsetUnits=-2;
        cimDerinlikOnceligi++;
        kilKenarDerinligi(o.material,0.10);
        taneciklendir(o.material,'cim',1/2.8,mobil?0.92:0.98,0.36);
      }
      else if(/CIM_TASIYICI/i.test(o.name)){
        // Spor parsellerindeki görünür krem apron, adına rağmen çim değildir.
        // Bu dal genel /CIM/ eşleşmesinden önce kalmalı; aksi halde mobilde
        // referanstaki sıcak kaldırım çerçevesi yeşile boyanır.
        o.material.color.setHex(PASTEL_RENK.bordur);
        o.material.roughness=0.74; o.material.envMapIntensity=0.44;
        kilKenarDerinligi(o.material,0.14);
        taneciklendir(o.material,'asfalt',1/1.8,mobil?0.44:0.48,0.18);
      }
      else if(/CIM/i.test(o.name)){
        // Tek paletin acik cimi; AgX harita profilinde komsu kum ve yoldan
        // secilir, fakat neon/sari bir spor zemini gibi parlamaz.
        o.material.color.setHex(PASTEL_RENK.cim);
        o.material.roughness=0.92; o.material.envMapIntensity=0.18;
        // Kucuk adadaki stub yolun ustune fiziksel olarak biner; onu one
        // cekmek yol kenarini kirar. Diger gercek cimen kapaklarinda yalniz
        // sabit units bias kullanilir, renk/doku/geometri degismez.
        if(!/^8_CIM_STUB_DOLGU(?:$|[._-])/i.test(o.name)){
          o.material.polygonOffset=true;
          o.material.polygonOffsetFactor=0;
          o.material.polygonOffsetUnits=-2;
          cimDerinlikOnceligi++;
        }
        kilKenarDerinligi(o.material,0.10);
        taneciklendir(o.material,'cim',1/2.8,mobil?0.92:0.98,0.36);
      }
      else if(/^1_KUM_TABAN(?:$|[._-])/i.test(o.name)){
        // Eski alt kum ailesi genel 1_TABAN kuralina da, 4_KUMTABAN kuralina
        // da girmiyordu ve gri varsayilana dusuyordu. Gorunur kuru kisim varsa
        // diger sahil omuzlariyla ayni sicak pastel ailede kalir.
        o.material.color.setHex(KIYI_KUM_RENGI);
        o.material.roughness=0.88; o.material.envMapIntensity=0.30;
        kilKenarDerinligi(o.material,0.09);
        kabartmaBagla(o.material,true);
      }
      else if(/^1_TABAN/i.test(o.name)){
        // Bu govde su cizgisinin altina iner; kuru sahil kumunun sicak tonu
        // su altina yayilmasin diye ayri, notr ada-govde rengi kullanir.
        o.material.color.setHex(ADA_GOVDE_RENGI);
        o.material.roughness=0.86; o.material.envMapIntensity=0.26;
        kilKenarDerinligi(o.material,0.14);
        taneciklendir(o.material,'asfalt',1/3.2,mobil?0.28:0.32,0.14);
      }
      else if(/DOGU_SAHIL_UST_TOPRAK/i.test(o.name)){
        // Dogu sahilindeki acikta kalan ust dudak kuru kumla ayni tondadir.
        o.material.color.setHex(KIYI_KUM_RENGI);
        o.material.roughness=0.88; o.material.envMapIntensity=0.30;
        kilKenarDerinligi(o.material,0.09);
        taneciklendir(o.material,'asfalt',1/3.2,mobil?0.76:0.82,0.28);
        kabartmaBagla(o.material,true);
      }
      else if(/KIYI_TOPRAK/i.test(o.name)){
        // Kullanici onayli kiyida cimin alti bastan sona ayni sicak kumdur.
        // Bu tasiyici ayri bir gri kontur veya ikinci koyu cizgi uretmez;
        // gercek kotu cimin yumusak yan yuzeyi ve PBR isigi okumaya devam eder.
        o.material.color.setHex(KIYI_TOPRAK_RENGI);
        o.material.roughness=0.88; o.material.envMapIntensity=0.26;
        kabartmaBagla(o.material,true);
      }
      else if(/YOL|PARSEL_ZEMIN|KB_SPOR_ZEMIN/i.test(o.name)){
        o.material.color.setHex(PASTEL_RENK.yol);
        o.material.roughness=0.88; o.material.envMapIntensity=0.20;
        kilKenarDerinligi(o.material,0.08);
        taneciklendir(o.material,'asfalt',1/2.2,mobil?0.84:0.90,0.32);
      }
      else if(/BORDUR/i.test(o.name)){
        o.material.color.setHex(PASTEL_RENK.bordur);
        o.material.roughness=0.80; o.material.envMapIntensity=0.38;
        kilKenarDerinligi(o.material,0.12);
        taneciklendir(o.material,'asfalt',1/1.8,mobil?0.44:0.48,0.18);
      }
      else if(/KALDIRIM/i.test(o.name)){
        o.material.color.setHex(PASTEL_RENK.kaldirim);
        o.material.roughness=0.74; o.material.envMapIntensity=0.44;
        if('emissive' in o.material){
          o.material.emissive.setHex(0x000000);
          o.material.emissiveIntensity=0;
        }
        kilKenarDerinligi(o.material,0.14);
        taneciklendir(o.material,'asfalt',1/1.8,mobil?0.44:0.48,0.18);
      }
      else if(/^4_(?:ANA_)?KUMTABAN(?:$|[._-])/i.test(o.name)){
        // Yalniz su ustundeki iki fiziksel kum tasiyicisi sicak sahil tonunu
        // alir. Genel /KUM/ eslesmesi ileride su-alti bir dugumu da boyardi.
        o.material.color.setHex(KIYI_KUM_RENGI);
        o.material.roughness=0.88; o.material.envMapIntensity=0.30;
        kilKenarDerinligi(o.material,0.09);
        taneciklendir(o.material,'asfalt',1/3.2,mobil?0.76:0.82,0.28);
        kabartmaBagla(o.material,true);
      }
      else if(KIYI_KUM_OMUZ.test(o.name)){
        // Dis kum profili boya/tek kontur degildir: suya yakin ada govdesinden
        // baslayan dokuz gercek halka, dis karni ve genis ust tepeyi kapali
        // hacim halinde kurar. Normaller isigi yumusakca dondurdugu icin omuz
        // kendi shadow-map'ine yazilmaz; ucgen bant/acne geri donmez.
        o.material.color.setHex(KIYI_KUM_RENGI);
        // Iki omuz ve 4_* kum tasiyicilari glTF'de ayni materyali paylasir.
        // Bu nedenle butun kullanimlarda tek PBR sozlesmesi zorunludur;
        // traversal sirasi artik kumun roughness degerini degistiremez.
        o.material.roughness=0.88; o.material.envMapIntensity=0.30;
        kabartmaBagla(o.material,true);
      }
      else { o.material.roughness=1.0; }
      o.material.needsUpdate=true;
    }
  }});
  // Traversal bittikten sonra ortak malzemelerin son, gercek taban degerini
  // bir kez kaydet. Ayni glTF materyalini kullanan birden cok mesh boylece
  // kamera profili degisimlerinde iki kez carpilmaz.
  renderer.domElement.dataset.curbFinish=unifyCurbFinish(kok)?'shared':'missing';
  renderer.domElement.dataset.landMaterialCount=String(applyLandFinish(kok,LAND_EXPOSURE_35));
  const kumMalzemeleri=new Set();
  kok.traverse(o=>{
    if(!o.isMesh || !o.material) return;
    const malzemeler=Array.isArray(o.material)?o.material:[o.material];
    for(const malzeme of malzemeler){
      if(Number.isFinite(malzeme.envMapIntensity)){
        malzeme.userData.pastelEnvBase=malzeme.envMapIntensity;
        PASTEL_MALZEMELER.add(malzeme);
      }
      if(/^(?:4_(?:ANA_)?KUMTABAN|67D_KIYI_KUM_OMUZ|67F_ANA_ADA_ALT_KOPRU_KUM_OMUZ)(?:$|[._-])/i.test(o.name))
        kumMalzemeleri.add(malzeme);
    }
  });
  const kumPuruzleri=[...kumMalzemeleri].map(m=>Number(m.roughness.toFixed(6)));
  const kumPbrDogru=kumPuruzleri.length>0 && kumPuruzleri.every(v=>Math.abs(v-0.88)<1e-6);
  renderer.domElement.dataset.sandRoughness=kumPuruzleri.join(',');
  renderer.domElement.dataset.sandMaterialContract=kumPbrDogru?'passed':'failed';
  if(!kumPbrDogru) hata('kalite kapisi: ortak kum materyali roughness=0.88 olmali');

  let kenarGolgeAtan=0, kenarGolgeUcgeni=0;
  const kenarGolgeAdlari=[];
  const roundedCurbShadows49=[];
  for(const kaynak of dikYanGolgeKaynaklari){
    if(CURB49_NAMES.includes(kaynak.name)){
      // Closed, rounded slabs use backface depth; no coincident open side helper.
      const shadow49=installCurbShadows49(kok,[kaynak.name]);
      roundedCurbShadows49.push(shadow49);
      kenarGolgeAtan+=shadow49.count;kenarGolgeUcgeni+=shadow49.triangles;
      kenarGolgeAdlari.push(kaynak.name);
      continue;
    }
    const geo=dikYanGolgeGeometrisi(kaynak.geometry);
    if(!geo) continue;
    const yardimci=new THREE.Mesh(geo,dikYanGolgeMat);
    yardimci.name=`67D_DIK_YAN_GOLGE_${kaynak.name}`;
    yardimci.castShadow=true; yardimci.receiveShadow=false;
    yardimci.customDepthMaterial=dikYanDerinlikMat;
    yardimci.userData.safeShadowCaster=true;
    yardimci.raycast=()=>{};
    kaynak.add(yardimci);
    kenarGolgeAtan++;
    kenarGolgeAdlari.push(kaynak.name);
    kenarGolgeUcgeni+=geo.attributes.position.count/3;
  }
  const coastGrade=addDryInterior(kok,zeminler,coastGradeData);
  renderer.domElement.dataset.coastGrade='v21-raised-interior';
  renderer.domElement.dataset.coastAddedTriangles=coastGrade.addedTriangles;
  renderer.domElement.dataset.waterWaveAmplitude='0.012';
  const b=new THREE.Box3().setFromObject(kok).getSize(new THREE.Vector3());
  kok.scale.setScalar(DUNYA_OLCEGI);
  const k2=new THREE.Box3().setFromObject(kok);
  kok.position.sub(new THREE.Vector3(
    SABIT_MERKEZ_X*DUNYA_OLCEGI,
    k2.min.y,
    SABIT_MERKEZ_Z*DUNYA_OLCEGI
  ));
  sahne.add(kok); kok.updateMatrixWorld(true);
  configureInteriorWater(KIMI_SU_U,kok,coastGradeData);
  renderer.domElement.dataset.waterInteriorProtection='v21-inset-footprint';
  // Salt okunur QA koordinatlari: yakin plan kadrajlari tahminle degil,
  // dogrudan canli mesh merkezleriyle acilir. Normal oyun davranisini etkilemez.
  if(qaModu){
    const qaMerkez=(regex,anahtar)=>{
      const nesne=zeminler.find(mm=>regex.test(mm.name));
      if(!nesne) return;
      const merkez=new THREE.Box3().setFromObject(nesne).getCenter(new THREE.Vector3());
      renderer.domElement.dataset[anahtar]=[merkez.x,merkez.y,merkez.z]
        .map(v=>v.toFixed(3)).join(',');
    };
    qaMerkez(/^8_DOGU_SAHIL_MERKEZ_DISK(?:$|[._-])/i,'qaEastDiskCenter');
    qaMerkez(/^4_KIYI_TOPRAK_TABANI(?:$|[._-])/i,'qaCoastalSoilCenter');
    qaMerkez(/^8_REF_AYIRICI(?:$|[._-])/i,'qaDividerCenter');
  }
  // Eski sabit -0.6 m deniz, 1_TABAN'in teknik tasiyici kalinligini tamamen
  // acikta birakiyor ve adayi koyu karton blok gibi gosteriyordu. Deniz,
  // 1_TABAN ust kapaginin hemen ALTINDA kalir: ada icindeki bos parselleri
  // basmaz, buna karsilik su altindaki kalin teknik govdeyi gizler. Plan,
  // collision ve kum footprint'i degismez; su ustunde yalniz sicak kum omzu
  // ile cok ince bir notr govde cizgisi okunur.
  const anaKum=zeminler.find(mm=>/^4_ANA_KUMTABAN(?:$|[._-])/i.test(mm.name));
  const adaKapagi=zeminler.find(mm=>/^1_TABAN(?:$|[._-])/i.test(mm.name));
  if(anaKum && adaKapagi){
    const kumUst=new THREE.Box3().setFromObject(anaKum).max.y;
    adaKapagi.visible=false;
    const adaBatirma=2.15;
    kok.position.y-=adaBatirma; kok.updateMatrixWorld(true);
    // İki adada da aynı kesin kot: görünür WaterBody, batırılmış kum
    // kapağının tam 2 cm altından başlar.
    const batikKumUst=kumUst-adaBatirma;
    renderer.domElement.dataset.interiorWaveClearance=(0.0011*DUNYA_OLCEGI+.020-.012).toFixed(3);
    deniz.position.y=batikKumUst-0.038;
    kimiSu.position.y=deniz.position.y+0.018;
    renderer.domElement.dataset.oceanLevel=kimiSu.position.y.toFixed(3);
    renderer.domElement.dataset.islandWaterSink=adaBatirma.toFixed(2);
    renderer.domElement.dataset.drySandLipHeight=(batikKumUst-kimiSu.position.y).toFixed(3);
  } else hata('kum/taban katmani bulunamadi; deniz seviyesi baglanamadi');
  // Apply after final island lowering and before Kimi's divider/AO mask bake.
  renderer.domElement.dataset.smallIslandWalls=JSON.stringify(applySmallIslandWalls48({root:kok,meshes:zeminler,patch:wallPatch48}));
  renderer.domElement.dataset.smallIslandMatch55=JSON.stringify(applySmallIslandMatch55(kok,dividerMeta55,dividerBuffer55));
  const [parkMeta57,parkBuffer57]=await Promise.all([islandFetch('./park-terrain-v57.json?v=1').then(r=>{if(!r.ok)throw Error('Park terrain metadata');return r.json();}),islandFetch('./park-terrain-v57.bin?v=1').then(r=>{if(!r.ok)throw Error('Park terrain geometry');return r.arrayBuffer();})]);
  renderer.domElement.dataset.parkTerrain57=JSON.stringify(applyParkTerrain57(kok,parkMeta57,parkBuffer57));
  renderer.domElement.dataset.parkPlinthGround57=JSON.stringify(applyParkPlinthGround57(kok));
  const [pathMeta57,pathBuffer57]=await Promise.all([islandFetch('./park-path-polish57.json?v=1').then(r=>{if(!r.ok)throw Error('Park path metadata');return r.json();}),islandFetch('./park-path-polish57.bin?v=1').then(r=>{if(!r.ok)throw Error('Park path geometry');return r.arrayBuffer();})]);
  renderer.domElement.dataset.parkPathPolish57=JSON.stringify(applyParkPathPolish57(kok,pathMeta57,pathBuffer57));
  const entryMeta57=await islandFetch('./park-entry-caps57.json?v=1').then(r=>{if(!r.ok)throw Error('Park entrance metadata');return r.json();});
  const {addedWalkMeshes:entryWalkMeshes57,...entryReport57}=applyParkEntryCaps57(kok,entryMeta57,'codex');
  zeminler.push(...entryWalkMeshes57);
  renderer.domElement.dataset.parkEntryCaps57=JSON.stringify(entryReport57);
  const [ringMeta63,ringBuffer63]=await Promise.all([islandFetch('./park-ring-v63.json?v=L1g2').then(r=>{if(!r.ok)throw Error('Park ring metadata');return r.json();}),islandFetch('./park-ring-v63.bin?v=L1g2').then(r=>{if(!r.ok)throw Error('Park ring geometry');return r.arrayBuffer();})]);
  renderer.domElement.dataset.parkRing63=JSON.stringify(applyParkRing63(kok,ringMeta63,ringBuffer63));
  const {addedWalkMeshes:roadSealWalkMeshes64,...roadSealReport64}=applyRoadSeal64(kok,roadSealMeta64,roadSealBuffer64);
  zeminler.push(...roadSealWalkMeshes64);
  renderer.domElement.dataset.roadSeal64=JSON.stringify(roadSealReport64);
  renderer.domElement.dataset.parkPond65=JSON.stringify(applyParkPond65(kok,parkPondMeta65,parkPondBuffer65));
  const shoreMeta66=await islandFetch('./park-shore-v66.json?v=2').then(r=>{if(!r.ok)throw Error('Park shore metadata');return r.json();});
  renderer.domElement.dataset.parkShore66=JSON.stringify(applyParkShore66(kok,shoreMeta66));
  const photoMeta67=await islandFetch('./fixes-v67.json?v=7').then(r=>{if(!r.ok)throw Error('Photo67 metadata');return r.json();});
  const {addedWalkMeshes:photoWalk67,...photoReport67}=applyPhotoFixes67(kok,photoMeta67);
  zeminler.push(...photoWalk67);
  renderer.domElement.dataset.photoFixes67=JSON.stringify(photoReport67);
  const {applyRoundaboutCurb90}=await import('./roundabout-curb-v90.js?v=90');
  renderer.domElement.dataset.roundaboutCurb90=JSON.stringify(applyRoundaboutCurb90(kok));
  const {applySurfaceJoins110}=await import('./surface-joins-v110.js?v=110.2');
  renderer.domElement.dataset.surfaceJoins110=JSON.stringify(applySurfaceJoins110(kok));
  // Refresh only copied side casters already enabled by this map's policy:
  // Codex uses grass; Kimi uses the park path. Do not add broad terrain shadows.
  for(const name57 of ['3_CIMEN','8_PARK_PATIKA_UST']){
    if(!DIK_YAN_GOLGE_KAYNAGI.test(name57))continue;
    const source57=kok.getObjectByName(name57),helper57=source57?.getObjectByName('67D_DIK_YAN_GOLGE_'+name57);
    const sides57=dikYanGolgeGeometrisi(source57?.geometry);
    if(!helper57||!sides57)throw Error('Park path side shadow source '+name57);
    kenarGolgeUcgeni+=(sides57.attributes.position.count-helper57.geometry.attributes.position.count)/3;
    helper57.geometry.dispose();helper57.geometry=sides57;
  }
  const curbRecord57=roundedCurbShadows49.findIndex(r=>r.names.includes('6_BORDUR'));
  if(curbRecord57<0)throw Error('Park path curb shadow source');
  const curbShadow57=installCurbShadows49(kok,['6_BORDUR']);
  kenarGolgeUcgeni+=curbShadow57.triangles-roundedCurbShadows49[curbRecord57].triangles;
  roundedCurbShadows49[curbRecord57]=curbShadow57;
  renderer.domElement.dataset.parkPathShadowRefresh57='existing-side-copies-and-closed-curb';
  // Opak WaterBody yalnız gerçek kuru üst kapakların dışında çizilir. 1_TABAN
  // teknik altlık olarak açıkta kalırsa su onu tamamen örter; böylece dışarıda
  // kum/gri ada parçaları dalgalanıyormuş gibi görünmez.
  const kuruUstKapaklar=[]; // Su seviyesi kapakların altında; ekstra maske gerekmez.
  if(kuruUstKapaklar.length){
    const K=512, pay=2, kutu=new THREE.Box3().setFromObject(kok);
    const minX=kutu.min.x-pay, minZ=kutu.min.z-pay;
    const boyX=(kutu.max.x-kutu.min.x)+2*pay, boyZ=(kutu.max.z-kutu.min.z)+2*pay;
    const cnv=document.createElement('canvas'); cnv.width=cnv.height=K;
    const cx=cnv.getContext('2d',{willReadFrequently:true}); cx.fillStyle='#000'; cx.fillRect(0,0,K,K); cx.fillStyle='#fff'; cx.beginPath();
    const a=new THREE.Vector3(),b2=new THREE.Vector3(),c2=new THREE.Vector3(),n2=new THREE.Vector3(),e2=new THREE.Vector3();
    for(const kaynak of kuruUstKapaklar){ const pos=kaynak.geometry.attributes.position,idx=kaynak.geometry.index,n=idx?idx.count:pos.count;
      for(let i=0;i+2<n;i+=3){ const ia=idx?idx.getX(i):i,ib=idx?idx.getX(i+1):i+1,ic=idx?idx.getX(i+2):i+2;
        a.fromBufferAttribute(pos,ia).applyMatrix4(kaynak.matrixWorld); b2.fromBufferAttribute(pos,ib).applyMatrix4(kaynak.matrixWorld); c2.fromBufferAttribute(pos,ic).applyMatrix4(kaynak.matrixWorld);
        n2.subVectors(b2,a); e2.subVectors(c2,a); n2.cross(e2); if(n2.y<=0) continue;
        cx.moveTo((a.x-minX)/boyX*K,(a.z-minZ)/boyZ*K); cx.lineTo((b2.x-minX)/boyX*K,(b2.z-minZ)/boyZ*K); cx.lineTo((c2.x-minX)/boyX*K,(c2.z-minZ)/boyZ*K); cx.closePath();
      }
    }
    cx.fill(); const kara=new THREE.DataTexture(cx.getImageData(0,0,K,K).data,K,K);
    kara.minFilter=kara.magFilter=THREE.LinearFilter; kara.wrapS=kara.wrapT=THREE.ClampToEdgeWrapping; kara.needsUpdate=true;
    KIMI_SU_U.karaDoku.value=kara; KIMI_SU_U.karaMin.value.set(minX,minZ); KIMI_SU_U.karaBoy.value.set(boyX,boyZ);
    renderer.domElement.dataset.waterLandMask='dry-caps-512';
  }
  // Kimi'nin onayli kabartma maskesini final mesh listesi uzerinden yeniden
  // kur. Yalniz yukari bakan gercek kapak ucgenleri izdusume girer; dik yan,
  // alt yuz ve cift sarmalli omuz parcalari maskede leke/iptal uretemez.
  const kabKiyiKaynaklari=zeminler.filter(mm=>
    KIYI_KUM_OMUZ.test(mm.name) ||
    /^4_(?:ANA_)?KUMTABAN(?:$|[._-])/i.test(mm.name) ||
    /^1_TABAN(?:$|[._-])/i.test(mm.name));
  const kabCimKaynaklari=zeminler.filter(mm=>
    /^3_.*CIMEN/i.test(mm.name) ||
    /^3_DOGU_SAHIL_HALKASI(?:$|[._-])/i.test(mm.name) ||
    /^8_(?:CIM_STUB_DOLGU|D10_CIM_DESTEK)(?:$|[._-])/i.test(mm.name));
  if(kabCimKaynaklari.length && kabKiyiKaynaklari.length){
    const K=512, pay=26;
    const kutu=new THREE.Box3().setFromObject(kok);
    const minX=kutu.min.x-pay, minZ=kutu.min.z-pay;
    const boyX=(kutu.max.x-kutu.min.x)+2*pay;
    const boyZ=(kutu.max.z-kutu.min.z)+2*pay;
    const izDusum=(kaynaklar)=>{
      const cnv=document.createElement('canvas'); cnv.width=cnv.height=K;
      const cx2=cnv.getContext('2d',{willReadFrequently:true});
      cx2.fillStyle='#000'; cx2.fillRect(0,0,K,K);
      cx2.fillStyle='#fff'; cx2.beginPath();let rasterBatch=0;
      const ta=new THREE.Vector3(), tb=new THREE.Vector3(), tc=new THREE.Vector3();
      const tn=new THREE.Vector3(), te=new THREE.Vector3();
      for(const kaynak of kaynaklar){
        const pos=kaynak.geometry.attributes.position;
        const idx=kaynak.geometry.index;
        const nTri=idx?idx.count:pos.count;
        for(let i=0;i+2<nTri;i+=3){
          const ia=idx?idx.getX(i):i;
          const ib=idx?idx.getX(i+1):i+1;
          const ic=idx?idx.getX(i+2):i+2;
          ta.fromBufferAttribute(pos,ia).applyMatrix4(kaynak.matrixWorld);
          tb.fromBufferAttribute(pos,ib).applyMatrix4(kaynak.matrixWorld);
          tc.fromBufferAttribute(pos,ic).applyMatrix4(kaynak.matrixWorld);
          tn.subVectors(tb,ta); te.subVectors(tc,ta); tn.cross(te);
          if(tn.y<=0) continue;
          cx2.moveTo((ta.x-minX)/boyX*K,(ta.z-minZ)/boyZ*K);
          cx2.lineTo((tb.x-minX)/boyX*K,(tb.z-minZ)/boyZ*K);
          cx2.lineTo((tc.x-minX)/boyX*K,(tc.z-minZ)/boyZ*K);
          cx2.closePath();if(++rasterBatch%512===0){cx2.fill();cx2.beginPath();}
        }
      }
      cx2.fill();
      return cx2.getImageData(0,0,K,K).data;
    };
    const kutuBulanik=(dolu,tur)=>{
      let kaynak=new Float32Array(K*K), hedef=new Float32Array(K*K);
      for(let i=0;i<K*K;i++) kaynak[i]=dolu[i*4]/255;
      for(let t=0;t<tur;t++){
        for(let y=0;y<K;y++) for(let x=0;x<K;x++){
          let toplam=0;
          for(let dy=-1;dy<=1;dy++) for(let dx=-1;dx<=1;dx++){
            const xx=Math.min(K-1,Math.max(0,x+dx));
            const yy=Math.min(K-1,Math.max(0,y+dy));
            toplam+=kaynak[yy*K+xx];
          }
          hedef[y*K+x]=toplam/9;
        }
        const tmp=kaynak; kaynak=hedef; hedef=tmp;
      }
      return kaynak;
    };
    const cimDolu=izDusum(kabCimKaynaklari);
    const adaDolu=izDusum(kabKiyiKaynaklari);
    const cimBulanik=kutuBulanik(cimDolu,3);
    const adaBulanik=kutuBulanik(adaDolu,7);
    const piksel=new Uint8Array(K*K*4);
    let cimSayi=0, adaSayi=0;
    for(let i=0;i<K*K;i++){
      piksel[i*4]=cimDolu[i*4];
      piksel[i*4+1]=Math.round(cimBulanik[i]*255);
      piksel[i*4+2]=adaDolu[i*4];
      piksel[i*4+3]=Math.round(adaBulanik[i]*255);
      if(cimDolu[i*4]>127) cimSayi++;
      if(adaDolu[i*4]>127) adaSayi++;
    }
    // Yonsuz temas cekirdeginin gercekten butun yonlerde mevcut oldugunu
    // salt-okunur QA verisiyle kanitla. G-R orta esigi, shaderdaki 0.06-0.30
    // smoothstep'in tam ortasidir; gradient sekiz ekran yonuna sayilir.
    let temasSayi=0;
    const temasYonAdlari=['E','SE','S','SW','W','NW','N','NE'];
    const temasYonSayilari=new Array(8).fill(0);
    for(let y=1;y<K-1;y++) for(let x=1;x<K-1;x++){
      const i=y*K+x;
      if(cimDolu[i*4]>127 || cimBulanik[i]<0.18) continue;
      const gx=cimBulanik[i+1]-cimBulanik[i-1];
      const gy=cimBulanik[i+K]-cimBulanik[i-K];
      if(Math.hypot(gx,gy)<1e-6) continue;
      const yon=(Math.round(Math.atan2(gy,gx)/(Math.PI/4))+8)%8;
      temasSayi++;
      temasYonSayilari[yon]++;
    }
    const doku=new THREE.DataTexture(piksel,K,K);
    doku.minFilter=THREE.LinearFilter; doku.magFilter=THREE.LinearFilter;
    doku.wrapS=doku.wrapT=THREE.ClampToEdgeWrapping;
    doku.needsUpdate=true;
    KABARTMA_U.doku.value=doku;
    KABARTMA_U.min.value.set(minX,minZ);
    KABARTMA_U.boy.value.set(boyX,boyZ);
    renderer.domElement.dataset.reliefBand='512px-cim3-ada7-v35';
    renderer.domElement.dataset.reliefGrassFill=String(cimSayi);
    renderer.domElement.dataset.reliefCoastFill=String(adaSayi);
    renderer.domElement.dataset.reliefGrassSources=String(kabCimKaynaklari.length);
    renderer.domElement.dataset.reliefCoastSources=String(kabKiyiKaynaklari.length);
    renderer.domElement.dataset.reliefLightDirection=[
      KABARTMA_U.isik.value.x,KABARTMA_U.isik.value.y
    ].map(v=>v.toFixed(6)).join(',');
    renderer.domElement.dataset.reliefShadowOffset='0.85';
    renderer.domElement.dataset.reliefHighlightOffset='0.55';
    renderer.domElement.dataset.reliefBeachSlope='0.22';
    renderer.domElement.dataset.reliefContactBand='all-sides-g3-006-030-v35';
    renderer.domElement.dataset.reliefContactStrength='0.45';
    renderer.domElement.dataset.reliefContactPixels=String(temasSayi);
    renderer.domElement.dataset.reliefContactOctants=temasYonAdlari
      .map((ad,i)=>ad+':'+temasYonSayilari[i]).join(',');
  } else hata('kabartma maskesi icin cim/kiyi kaynaklari eksik');
  // Yukleme ilk kez tamamlandiginda oyun profilini de ayni gercek materyal
  // yolundan gecir; veri alanlari ve PBR tabanlari ilk kareden itibaren kesin.
  pastelProfiliniUygula(kameraModu);
  kok.updateMatrixWorld(true);
  const {applyCenterSculpture69}=await import('./center-sculpture-v69.js');
  renderer.domElement.dataset.centerSculpture69=JSON.stringify(applyCenterSculpture69(kok));
  const {applyCentralWhite71}=await import('./central-white-v71.js');
  const white71=applyCentralWhite71(kok);
  zeminler=zeminler.filter(m=>!white71.hidden.includes(m.name)).concat(white71.meshes);
  const {applyCentralDetails73}=await import('./central-details-v73.js?v=76');
  const details73=applyCentralDetails73(kok);
  zeminler=zeminler.filter(m=>!details73.hidden.includes(m.name)).concat(details73.meshes);
  renderer.domElement.dataset.centralDetails73='four paths, typographic 67, twelve lawns, four topiaries; four triples layout75';
  renderer.domElement.dataset.centralWhite71='4 gray pastel panels; wider lawns v73';
  const {applySeasideBenchFix89}=await import('./seaside-scale-v89.js?v=91');
  renderer.domElement.dataset.seasideBench89=JSON.stringify(applySeasideBenchFix89(kok));
  terrainSampler=wrapParkEntryCapsSampler57(wrapParkRingSampler63(wrapParkPathSampler57(wrapParkTerrainSampler57(createTerrainSampler(zeminler.filter(m=>!m.userData.parkPond65CollisionOnly)),kok),kok),kok),kok);
  renderer.domElement.dataset.smallIslandProps='loading';
  const smallIslandPropsReady=loadSmallIslandProps({assetSession:islandStartupAssets,scene:sahne,renderer,sample:zeminVurusu,variant:'codex'}).then(props=>{
    smallIslandProps=props;props.update(1,kam);
    smallIslandBaseTriangles=zeminler.reduce((n,m)=>n+(m.geometry.index?.count??m.geometry.attributes.position.count)/3,0);
    smallIslandMapLabel='ada '+Math.round(b.x*DUNYA_OLCEGI)+'×'+Math.round(b.z*DUNYA_OLCEGI)+' m';
    // Shared link opens the requested little island immediately; existing
    // Oyuna Dön restores the saved small-island character camera.
    if(urlParams.get('view')==='small'){
      oyunKamerasiniSakla();incelemeMerkezi=new THREE.Vector3(-136,9.6,60);
      const h=1.08*Math.max(230,114/kam.aspect)/(2*Math.tan(THREE.MathUtils.degToRad(25)));
      kam.position.set(-136,9.6+h,60);kam.fov=50;kam.near=.5;kam.far=h+1200;
      kam.updateProjectionMatrix();yaw=0;pitch=-Math.PI/2;ucus=true;kameraModu='close';
      yurX=0;yurY=0;hiz.set(0,0,0);bas.style.display='none';golgeKadrajiUygula(132);
      incelemeSisiniUygula();gorunumArayuzunuGuncelle();
      renderer.domElement.dataset.smallIslandEntry='north-up-showcase';
    }
    return props;
  }).catch(e=>hata('Küçük ada modelleri: '+e.message));
  renderer.domElement.dataset.parkProps63='loading';
await entryStage(3,'Preparing the park trees');
  parkProps57=await loadParkProps63({assetSession:islandStartupAssets,scene:sahne,renderer,sample:zeminVurusu,variant:'codex'});
  for(const name of parkProps57.hiddenTerrain){const old=kok.getObjectByName(name);if(old)old.visible=false;}
  zeminler=zeminler.filter(m=>!parkProps57.hiddenTerrain.includes(m.name));
  terrainSampler=wrapParkEntryCapsSampler57(wrapParkRingSampler63(wrapParkPathSampler57(wrapParkTerrainSampler57(createTerrainSampler(zeminler.filter(m=>!m.userData.parkPond65CollisionOnly)),kok),kok),kok),kok);
  parkProps57.update(1,kam);
await entryStage(4,'Preparing the neighbourhood');
  cityProps60=await loadCityProps60({scene:sahne,renderer,sample:zeminVurusu,variant:'codex'});
  // Optional additive layer: failure must not prevent the island from opening.
  try {
    const {loadCentralBuildings68}=await import('./central-buildings-v68.js?v=76');
await entryStage(5,'Preparing the central square');
    centralBuildings68=await loadCentralBuildings68({scene:sahne,renderer,sample:zeminVurusu,variant:'codex'});
  } catch(e) { renderer.domElement.dataset.centralBuildings68='error: '+e.message; console.error('Central buildings',e); }
  try {
    const {createSeasideTimber81}=await import('./seaside-timber-v81.js?v=82');
await entryStage(6,'Preparing the wooden piers');
    seasideTimber79=createSeasideTimber81({scene:sahne,terrainRoot:kok,renderer,variant:'codex'});
  } catch(e){renderer.domElement.dataset.seasideTimber79='error: '+e.message;console.error('Seaside timber',e);}
  try {
    const {loadLunapark77}=await import('./lunapark-placement-v77.js?v=91');
await entryStage(7,'Preparing rides and boats');
    lunapark77=await loadLunapark77({scene:sahne,renderer,sample:zeminVurusu,sea:kimiSu.position.y,variant:'codex',terrainRoot:kok,timberSample:seasideTimber79?.sample});
  } catch(e){renderer.domElement.dataset.lunapark77='error: '+e.message;console.error('Amusement park',e);}
  try {
    const {loadLowerPlaza83}=await import('./lower-plaza-v83.js?v=83.1');
await entryStage(8,'Preparing the garden plaza');
    lowerPlaza83=await loadLowerPlaza83({scene:sahne,renderer,sample:zeminVurusu,variant:'codex'});
  } catch(e){renderer.domElement.dataset.lowerPlaza83='error: '+e.message;console.error('Lower plaza',e);}
  try {
    const {loadNorthwestSports97}=await import('./northwest-sports-v97.js?v=97.5');
await entryStage(9,'Preparing sports grounds');
    northwestSports97=await loadNorthwestSports97({scene:sahne,renderer,sample:zeminVurusu,variant:'codex',terrainRoot:kok});
    renderer.domElement.__northwestSports97=northwestSports97;
  } catch(e){renderer.domElement.dataset.northwestSports97='error: '+e.message;console.error('Northwest sports',e);}
  try {
    const {createStadiumCoast99}=await import('./stadium-coast-v99.js?v=99.7');
await entryStage(10,'Preparing the stadium and beach');
    stadiumCoast99=createStadiumCoast99({scene:sahne,terrainRoot:kok,renderer,sample:zeminVurusu,variant:'codex'});
    renderer.domElement.__stadiumCoast99=stadiumCoast99;
  } catch(e){renderer.domElement.dataset.stadiumCoast99='error: '+e.message;console.error('Stadium and coast',e);}
  try {
    const {createWestCourtyard102}=await import('./west-courtyard-v102.js?v=102.3');
await entryStage(11,'Preparing homes and courts');
    westCourtyard102=createWestCourtyard102({scene:sahne,terrainRoot:kok,renderer,sample:zeminVurusu,variant:'codex'});
    renderer.domElement.__westCourtyard102=westCourtyard102;
  } catch(e){renderer.domElement.dataset.westCourtyard102='error: '+e.message;console.error('West courtyard',e);}
  try {
    await smallIslandPropsReady;
    const {createBottomHomes103}=await import('./bottom-homes-v103.js?v=103.3');
    bottomHomes103=createBottomHomes103({scene:sahne,terrainRoot:kok,renderer,sample:zeminVurusu,variant:'codex'});
    renderer.domElement.__bottomHomes103=bottomHomes103;
  } catch(e){renderer.domElement.dataset.bottomHomes103='error: '+e.message;console.error('Bottom houses',e);}
  try {
    const {createNorthPool104}=await import('./north-pool-v104.js?v=104.6');
await entryStage(12,'Preparing the pool');
    northPool104=createNorthPool104({scene:sahne,terrainRoot:kok,renderer,sample:zeminVurusu,variant:'codex'});
    renderer.domElement.__northPool104=northPool104;
  } catch(e){renderer.domElement.dataset.northPool104='error: '+e.message;console.error('North pool',e);}
await entryStage(13,'Finishing the northern neighbourhood');
  const {loadNorthwest93}=await import('./northwest-v93/placement.js');
  northwest93=await loadNorthwest93({scene:sahne,renderer,sample:zeminVurusu,variant:'codex'});
  const {createNorthHomes}=await import('../app/island-north-homes.js');
  const {createNorthApartments}=await import('../app/island-north-apartments.js');
  northApartments=createNorthApartments({scene:sahne,renderer,sample:zeminVurusu});
  northHomes=createNorthHomes({scene:sahne,terrainRoot:kok,renderer,sample:zeminVurusu});
  try {
    const {createLivingEffects107}=await import('./living-effects-v107.js?v=108.2');
    livingEffects107=createLivingEffects107({scene:sahne,renderer,sample:zeminVurusu,ground:smallIslandGround,water:parkEnvironment().water,
      sea:(x,z)=>northPool104?.waterLevelAt(x,z)??kimiSu.position.y,mobile:mobil,
      plants:[...(northHomes?.plants.rows??[]),...(parkProps57?.layout??[]),...(smallIslandProps?.layout.plants??[]),...(northwestSports97?.plants.rows??[]),...(stadiumCoast99?.plants.rows??[]),...(bottomHomes103?.plants.rows??[])]});
    renderer.domElement.__livingEffects107=livingEffects107;
  } catch(e){renderer.domElement.dataset.livingEffects107='error: '+e.message;console.error('Living effects',e);}
  try {
    pastelTraffic108=createPastelTraffic108({scene:sahne,terrainRoot:kok,renderer,ground:(x,z)=>smallIslandGround(x,z,true),water:parkEnvironment().water});
    renderer.domElement.__pastelTraffic108=pastelTraffic108;
  } catch(e){renderer.domElement.dataset.pastelTraffic108='error: '+e.message;console.error('Pastel cars',e);}
  renderer.domElement.dataset.terrainQuery='exact-triangle-grid-v27';
  renderer.domElement.dataset.terrainQueryTriangles=String(terrainSampler.stats.triangles);
  const parkEdgePatch=await islandFetch('/67park-island/repairs/park-edges-v3.json').then(r=>{if(!r.ok)throw Error('Park edge repair missing');return r.json();});
  renderer.domElement.dataset.parkEdges=JSON.stringify(applyParkEdges(kok,parkEdgePatch));
  const curbJoinPatch=await islandFetch('/67park-island/repairs/curb-joins-v3.json').then(r=>{if(!r.ok)throw Error('Curb join repair missing');return r.json();});
  renderer.domElement.dataset.curbJoins=JSON.stringify(applyCurbJoins(kok,curbJoinPatch));
  try{renderer.domElement.dataset.parcelPaving=JSON.stringify({applied:true,...applyParcelPaving(kok)})}catch(pavementError){renderer.domElement.dataset.parcelPaving=JSON.stringify({applied:false,error:String(pavementError)});console.error("67Park pavement repair did not apply",pavementError)}
  try{renderer.domElement.dataset.fountainGroundFollowup=JSON.stringify({applied:true,...applyFountainGroundFollowup(kok)})}catch(pavementError){renderer.domElement.dataset.fountainGroundFollowup=JSON.stringify({applied:false,error:String(pavementError)});console.error("67Park pavement repair did not apply",pavementError)}
  try{renderer.domElement.dataset.parcelCornersFollowup=JSON.stringify({applied:true,...applyParcelCorners(kok)})}catch(pavementError){renderer.domElement.dataset.parcelCornersFollowup=JSON.stringify({applied:false,error:String(pavementError)});console.error("67Park pavement repair did not apply",pavementError)}
  const stairGeometry=repairIslandStairs(kok);
  renderer.domElement.dataset.stairGeometry=JSON.stringify(stairGeometry.stats);
  zeminler=zeminler.filter(m=>!stairGeometry.nonWalkableNames.includes(m.name));
  for(const name of ['3_CIMEN','8_PARK_PATIKA_UST','6_BORDUR','5_YOL']){
    if(!DIK_YAN_GOLGE_KAYNAGI.test(name))continue;
    const source=kok.getObjectByName(name),helper=source?.getObjectByName('67D_DIK_YAN_GOLGE_'+name),geometry=dikYanGolgeGeometrisi(source.geometry);
    if(helper&&geometry){helper.geometry.dispose();helper.geometry=geometry;}
  }
  terrainSampler=wrapParkEntryCapsSampler57(wrapParkRingSampler63(wrapParkPathSampler57(wrapParkTerrainSampler57(createTerrainSampler(zeminler.filter(m=>!m.userData.parkPond65CollisionOnly)),kok),kok),kok),kok);
  try{terrainSampler=wrapParcelRepairSampler(terrainSampler,kok);renderer.domElement.dataset.parcelRepairPrecision=JSON.stringify({applied:true,...terrainSampler.stats.parcelRepairPrecision})}catch(pavementError){renderer.domElement.dataset.parcelRepairPrecision=JSON.stringify({applied:false,error:String(pavementError)});console.error("67Park pavement precision did not apply",pavementError)}
  hazir=true;
  renderer.shadowMap.type=THREE.PCFShadowMap;
  renderer.domElement.dataset.receiverPlaneAdapter='r185-native-hardware-pcf';
  resolve();
 }catch(e){reject(e)}
},undefined,reject));
const objects=sahne.children.filter(o=>!initialChildren.has(o));
const trunkRows=[...(smallIslandProps?.layout?.plants??[]),...(parkProps57?.layout??[])];
sahne.traverse(o=>{if(o.userData.treeTrunks)trunkRows.push(...o.userData.treeTrunks);});
const treeTrunksBlocked=treeIndex(trunkRows);
const stairGeometry=adaKok.userData.stairGeometry;
const treeBlocked=(x,y,z)=>treeTrunksBlocked(x,y,z)||stairsRailBlocked(stairGeometry.railSegments,x,y,z);
const stadiumStairs=stadiumCoast99?.stats?.stairs;
const stairRegions=[...stairGeometry.regions,...(stadiumStairs?.regions??[])];
const stairs={contains:(x,z)=>stairAt(stairRegions,x,z),regions:stairRegions,
 routes:[...stairGeometry.routes,...(stadiumStairs?.routes??[])],
 stats:{terrain:stairGeometry.stats,stadium:stadiumStairs?.stats}};
const surfaceFinish=installSurfaceFinish(objects,{enabled:new URLSearchParams(location.search).get('surface')!=='original'});
const staticTransforms=cacheStaticTransforms(objects,adaKok);
const shadowCache=installIslandShadowCache(renderer,gunes,sahne);
const shadowAnchor=createShadowAnchor(stableSunShadow52);
const pondWater=createPondWater(adaKok.getObjectByName('67D_PARK_WATER_UNIFIED_V65'));
const correctedWater=waterWithSolidFloor({water:parkEnvironment().water,ground:(x,z)=>smallIslandGround(x,z,true),sea:()=>kimiSu.position.y,pool:northPool104,pond:pondWater});
renderer.domElement.dataset.authoredIslandEnvironment=String(preserveAuthoredIslandEnvironment(objects,sahne.environment));
const overviewBounds=new THREE.Box3().setFromObject(adaKok);
const overviewCenter=overviewBounds.getCenter(new THREE.Vector3());
let overviewActive=false;
const world={
 scene:sahne,terrain:adaKok,renderer,camera:kam,objects,surfaceFinish,staticTransforms,shadowCache,shadowAnchor,
 ground:smallIslandGround,terrainGround:zeminY,sample:zeminVurusu,
 treeBlocked,stairs,
 treeRows:trunkRows.filter(p=>p.asset==='tree'),
 water:correctedWater,
 waterDiagnostics:(x,z)=>({before:parkEnvironment().water(x,z),after:correctedWater(x,z),ground:smallIslandGround(x,z,true),pond:pondWater.height(x,z)}),
 sea:(x,z)=>northPool104?.waterLevelAt(x,z)??pondWater.height(x,z)??kimiSu.position.y,
 pond:pondWater,
 traffic:pastelTraffic108,rides:lunapark77?.rides??[],
 effects:livingEffects107,
 pool:northPool104,blockers:parkEnvironment().cameraBlockers(),
 ready:true,spawn:[163,smallIslandGround(163,121)+.56,121],
 setOverview(value){
  // The original review camera places fog beyond the farthest Island corner.
  // Keep that behavior at portrait overview height without repainting the map.
  if(sahne.fog){
   const dx=Math.max(Math.abs(kam.position.x-overviewBounds.min.x),Math.abs(kam.position.x-overviewBounds.max.x));
   const dz=Math.max(Math.abs(kam.position.z-overviewBounds.min.z),Math.abs(kam.position.z-overviewBounds.max.z));
   const dy=Math.max(0,kam.position.y-overviewBounds.min.y);
   const near=value?Math.hypot(dx,dy,dz)+40:NORMAL_SIS_YAKIN;
   sahne.fog.near=near;sahne.fog.far=value?near+1000:NORMAL_SIS_UZAK;
  }
  if(value!==overviewActive){
   overviewActive=value;
   golgeKadrajiUygula(value?Math.max(overviewBounds.max.x-overviewBounds.min.x,overviewBounds.max.z-overviewBounds.min.z)*.62:GOLGE_YARI);
  }
  if(typeof pastelProfiliniUygula!=='function')return;
  const next=value?'map':'game';
  // R3F reapplies its default ACES renderer props when the HUD changes.
  // Codex was authored for AgX; pair its exposure with that tone mapper.
  const exposure=value?POZLAMA_HARITA:POZLAMA_OYUN;
  if(next!==kameraModu||renderer.toneMapping!==THREE.AgXToneMapping||renderer.toneMappingExposure!==exposure){
   kameraModu=next;renderer.toneMapping=THREE.AgXToneMapping;pastelProfiliniUygula(next);
   renderer.domElement.dataset.islandViewProfile=JSON.stringify({mode:next,toneMapping:renderer.toneMapping,exposure:renderer.toneMappingExposure,environment:sahne.environmentIntensity,fog:sahne.fog&&[sahne.fog.near,sahne.fog.far]});
  }
 },
 update(dt,actor){
  DENIZ_U.zaman.value+=dt;kimiSuMat.userData.update(dt);
  lunapark77?.update(dt,{paused:document.hidden,camera:kam});
  for(const p of [smallIslandProps,parkProps57,cityProps60,centralBuildings68,seasideTimber79,lowerPlaza83,northwest93,northwestSports97,northPool104,bottomHomes103,stadiumCoast99,northHomes])p?.update(dt,kam);
  const p=actor?.body?.translation?.();if(p){KIMI_SU_U.oyuncu.value.set(p.x,p.z);KIMI_SU_U.oyuncuSuda.value=world.water(p.x,p.z)?1:0;GOLGE_HEDEFI.set(overviewActive?overviewCenter.x:p.x,0,overviewActive?overviewCenter.z:p.z);if(shadowCache.enabled)shadowAnchor.update(GOLGE_HEDEFI,gunes.shadow.camera);else{shadowAnchor.invalidate();stableSunShadow52.update(GOLGE_HEDEFI);}}
 },
 dispose(){shadowCache.dispose();staticTransforms.dispose();surfaceFinish.dispose();for(const o of objects){o.removeFromParent();o.traverse(n=>{if(n.isMesh){n.geometry?.dispose();for(const m of Array.isArray(n.material)?n.material:[n.material]){m?.dispose();}}});}pmrem.dispose();}
};
const failures=Object.entries(renderer.domElement.dataset).filter(([k,v])=>/^error:/.test(v));
if(failures.length)throw Error('Island layers missing: '+JSON.stringify(failures));
return world;

} finally {islandStartupAssets.close();renderer.domElement.dataset.islandStartupAssets=JSON.stringify(islandStartupAssets.stats);}
}
