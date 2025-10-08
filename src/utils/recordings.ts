export function secondsToHM(seconds: number): string {
    if (!Number.isFinite(seconds) || seconds < 0) seconds = 0;
    const mins = Math.floor(seconds / 60);
    const hours = Math.floor(mins / 60);
    const remMins = mins % 60;
  
    if (hours > 0 && remMins > 0) return `${hours}h ${remMins}min`;
    if (hours > 0) return `${hours}h`;
    if (mins > 0) return `${mins}min`;
    return '<1min';
  }
  
  export const countSnorePercentage = ({totalSleep, snore}: {totalSleep: number, snore: number}) => {
    const percents = snore * 100 / totalSleep

    return `${Math.round(percents)}%`
  }

  // helpers
export function downsampleStride(arr: number[], target: number): number[] {
  const n = arr.length;
  if (n <= target) return arr.slice();
  const stride = Math.ceil(n / target);
  const out: number[] = [];
  for (let i = 0; i < n; i += stride) out.push(arr[i]);
  return out;
}

export function downsampleLTTB(data: number[], threshold: number): number[] {
  const n = data.length;
  if (threshold >= n || threshold === 0) return data.slice();
  const bucketSize = (n - 2) / (threshold - 2);
  const sampled: number[] = [data[0]];
  let a = 0;

  for (let i = 0; i < threshold - 2; i++) {
    const rangeStart = Math.floor((i + 1) * bucketSize) + 1;
    const rangeEnd = Math.floor((i + 2) * bucketSize) + 1;
    const range = data.slice(rangeStart, Math.min(rangeEnd, n));

    let avgX = 0, avgY = 0;
    const avgStart = Math.floor((i + 1) * bucketSize) + 1;
    const avgEnd = Math.floor((i + 2) * bucketSize) + 1;
    const avgRange = data.slice(avgStart, Math.min(avgEnd, n));
    for (let j = 0; j < avgRange.length; j++) { avgX += j; avgY += avgRange[j]; }
    if (avgRange.length) { avgX /= avgRange.length; avgY /= avgRange.length; }

    let maxArea = -1, nextA = rangeStart;
    for (let j = 0; j < range.length; j++) {
      const area = Math.abs(
        (a - avgX) * (data[a] - range[j]) - (a - j) * (data[a] - avgY)
      );
      if (area > maxArea) { maxArea = area; nextA = rangeStart + j; }
    }
    sampled.push(data[nextA]);
    a = nextA;
  }
  sampled.push(data[n - 1]);
  return sampled;
}

// Keep min and max per bucket — preserves peaks reliably.
// Total points ≈ 2 * target, so pick target ~ width/2.
export function downsampleMinMax(values: number[], target: number) {
  const n = values.length;
  if (n <= target) return { values: values.slice(), indices: [...Array(n).keys()] };

  const bucket = Math.ceil(n / target);
  const outVals: number[] = [];
  const outIdx: number[] = [];

  for (let start = 0; start < n; start += bucket) {
    const end = Math.min(start + bucket, n);
    let min = Infinity, max = -Infinity, minI = start, maxI = start;

    for (let i = start; i < end; i++) {
      const v = values[i];
      if (v < min) { min = v; minI = i; }
      if (v > max) { max = v; maxI = i; }
    }
    // preserve original order inside the bucket
    if (minI <= maxI) {
      outVals.push(values[minI], values[maxI]);
      outIdx.push(minI, maxI);
    } else {
      outVals.push(values[maxI], values[minI]);
      outIdx.push(maxI, minI);
    }
  }
  return { values: outVals, indices: outIdx };
}

export function findPeaks(values: number[], { minHeight = -Infinity, distance = 1 } = {}) {
  const idxs: number[] = [];
  for (let i = 1; i < values.length - 1; i++) {
    if (values[i] > values[i-1] && values[i] > values[i+1] && values[i] >= minHeight) {
      // enforce minimal distance between peaks
      if (idxs.length === 0 || i - idxs[idxs.length - 1] >= distance) idxs.push(i);
    }
  }
  return idxs;
}