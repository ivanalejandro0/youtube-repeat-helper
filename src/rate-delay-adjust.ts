// TODO check rates!
const rateDelayAdjustment: Map<number, number> = new Map([
  [0.25, 4],
  [0.5, 2],
  [0.75, 1.25],
  [1, 1],
  [1.25, 4 / 5], // 1.25 == 5/4 (4/4+1/4), decrease wait on 4/5
  [1.5, 4 / 6],  // 1.5 == 6/4 (4/4+2/4), decrease wait on 4/6
  [1.75, 4 / 7], // 1.75 == 7/4 (4/4+3/4), decrease wait on 4/7
  [2, 1 / 2],    // 2 == 8/4 (4/4+4/4), decrease wait on 4/8 == 1/2
]);

export function getWaitTimeForRate(time: number, rate: number): number {
  if (!rateDelayAdjustment.has(rate)) throw new Error("unknown rate");
  return time * rateDelayAdjustment.get(rate)!;
}

