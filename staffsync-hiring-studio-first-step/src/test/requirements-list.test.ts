import { describe, expect, it } from "vitest";
import { filterRequirements, requirements } from "@/lib/requirements/list";

describe("reference requirement filtering", () => {
  it("searches the supplied requirement ID", () => {
    expect(filterRequirements(requirements, "req-0002", "all", "all", "all").map(row => row.id)).toEqual(["REQ-0002"]);
  });
  it("finds a supplied primary skill", () => {
    expect(filterRequirements(requirements, "Java 21", "all", "all", "all").map(row => row.id)).toEqual(["REQ-0001"]);
  });
  it("filters the supplied Remote engagement", () => {
    expect(filterRequirements(requirements, "", "active", "C-C", "remote").map(row => row.id)).toEqual(["REQ-0003"]);
  });
  it("does not invent inactive records", () => {
    expect(filterRequirements(requirements, "", "inactive", "all", "all")).toEqual([]);
  });
});