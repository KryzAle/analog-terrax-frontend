import assert from "node:assert/strict";
import { siteImageUrl } from "./site-imagery";

const params = (url: string | null) => new URL(url ?? "https://invalid").searchParams;
const bbox = (url: string | null) => (params(url).get("BBOX") ?? "").split(",").map(Number);

assert.equal(siteImageUrl("earth", 10, 10), null);

const shackleton = siteImageUrl("moon", -89.54, 129.78);
assert.equal(params(shackleton).get("map"), "/maps/earth/moon_spole.map");
assert.equal(params(shackleton).get("LAYERS"), "LRO_WAC_south");
const [minX, minY, maxX, maxY] = bbox(shackleton);
assert.ok(Math.abs(maxX - minX - 40000) < 1 && Math.abs(maxY - minY - 40000) < 1);
assert.ok(minX < 10719 && 10719 < maxX && minY < -8928 && -8928 < maxY);

const marius = siteImageUrl("moon", 14.09, -56.77);
assert.equal(params(marius).get("map"), "/maps/earth/moon_simp_cyl.map");
const [west, south, east, north] = bbox(marius);
assert.ok(west < -56.77 && -56.77 < east && south < 14.09 && 14.09 < north);

const arcadia = siteImageUrl("mars", 39.2, -188);
assert.equal(params(arcadia).get("LAYERS"), "MDIM21_color");
const [arcadiaWest, , arcadiaEast] = bbox(arcadia);
assert.ok(arcadiaWest < 172 && 172 < arcadiaEast && arcadiaEast <= 180.5);

console.log("site-imagery: ok");
