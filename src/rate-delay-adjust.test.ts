import { wait2 } from "./rate-delay-adjust";

it("Adust duration properly", () => {
  expect(wait2(10, 0.25)).toEqual(40);
  expect(wait2(10, 0.5)).toEqual(20);
  expect(wait2(10, 0.75)).toEqual(12.5);
  expect(wait2(10, 1)).toEqual(10);
  // TODO check and fill these tests
  // expect(wait(10, 1.25)).toEqual(0);
  // expect(wait(10, 1.5)).toEqual(0);
  // expect(wait(10, 1.75)).toEqual(0);
  expect(wait2(10, 2)).toEqual(5);
});

it("Fails for unknown rates", () => {
  expect(() => wait2(10, 5)).toThrow();
});

