import {LAND_LOOK as previous} from './land-look-v35.js';
export {applyRoundedGrass,applyLandFinish} from './land-look-v35.js';

// Keep v35's geometry, colours and soft contact. Its 1.62 land-only exposure
// made the playing surface too bright at character height. Reduce the light
// gain by 20%, without repainting the land or darkening water and characters.
export const LAND_LOOK=Object.freeze({...previous,exposure:1.30});
