import { describe, expect, it } from "vitest";
import {
  classifyCheckIn,
  classifyCheckOut,
  DEFAULT_WORK_HOURS,
  formatAttendanceLocation,
} from "../lib/format/attendance-timing";

describe("attendance timing", () => {
  it("marks check-in before 9 AM as early", () => {
    const at = new Date();
    at.setHours(8, 30, 0, 0);
    expect(classifyCheckIn(at, DEFAULT_WORK_HOURS)).toBe("EARLY");
  });

  it("marks check-in at 9 AM as on time", () => {
    const at = new Date();
    at.setHours(9, 0, 0, 0);
    expect(classifyCheckIn(at, DEFAULT_WORK_HOURS)).toBe("ON_TIME");
  });

  it("marks check-in after 9 AM as late", () => {
    const at = new Date();
    at.setHours(9, 5, 0, 0);
    expect(classifyCheckIn(at, DEFAULT_WORK_HOURS)).toBe("LATE");
  });

  it("marks check-out after 7 PM as after hours", () => {
    const at = new Date();
    at.setHours(19, 15, 0, 0);
    expect(classifyCheckOut(at, DEFAULT_WORK_HOURS)).toBe("AFTER_HOURS");
  });

  it("formats location label when coordinates exist", () => {
    expect(
      formatAttendanceLocation({ checkInLat: 1.2, checkInLng: 3.4, siteName: "Office" }),
    ).toBe("Office · Location included");
  });
});
