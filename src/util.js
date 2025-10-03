export function clamp(v, lo, hi){ return Math.max(lo, Math.min(hi, v)); }
export function randInt(lo, hi){ return Math.floor(Math.random()*(hi-lo+1))+lo; }
export function aabb(A, B){
  return A.x < B.x + B.w && A.x + A.w > B.x && A.y < B.y + B.h && A.y + A.h > B.y;
}
