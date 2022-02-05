import { getWaitTimeForRate } from "./rate-delay-adjust";

it("Adust duration properly", () => {
  expect(getWaitTimeForRate(10, 0.25)).toEqual(40);
  expect(getWaitTimeForRate(10, 0.5)).toEqual(20);
  expect(getWaitTimeForRate(10, 0.75)).toEqual(12.5);
  expect(getWaitTimeForRate(10, 1)).toEqual(10);
  // TODO check and fill these tests
  // expect(wait(10, 1.25)).toEqual(0);
  // expect(wait(10, 1.5)).toEqual(0);
  // expect(wait(10, 1.75)).toEqual(0);
  expect(getWaitTimeForRate(10, 2)).toEqual(5);
});

it("Fails for unknown rates", () => {
  expect(() => getWaitTimeForRate(10, 5)).toThrow();
});

