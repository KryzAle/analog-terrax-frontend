import assert from "node:assert/strict";
import { siteImage } from "./site-imagery";

const params = (url: string | undefined) => new URL(url ?? "https://invalid").searchParams;
const bbox = (url: string | undefined) => (params(url).get("BBOX") ?? "").split(",").map(Number);

assert.equal(siteImage("earth", 10, 10), null);

const shackleton = siteImage("moon", -89.54, 129.78);
assert.equal(params(shackleton?.thumbnailUrl).get("map"), "/maps/earth/moon_spole.map");
assert.equal(params(shackleton?.thumbnailUrl).get("LAYERS"), "LRO_WAC_south");
assert.equal(params(shackleton?.thumbnailUrl).get("WIDTH"), "128");
assert.equal(params(shackleton?.previewUrl).get("WIDTH"), "320");
assert.equal(shackleton?.widthKm, 40);
assert.equal(shackleton?.source, "LRO WAC · USGS");
const [minX, minY, maxX, maxY] = bbox(shackleton?.previewUrl);
assert.ok(Math.abs(maxX - minX - 40000) < 1 && Math.abs(maxY - minY - 40000) < 1);
assert.ok(minX < 10719 && 10719 < maxX && minY < -8928 && -8928 < maxY);

const marius = siteImage("moon", 14.09, -56.77);
assert.equal(params(marius?.thumbnailUrl).get("map"), "/maps/earth/moon_simp_cyl.map");
const [west, south, east, north] = bbox(marius?.thumbnailUrl);
assert.ok(west < -56.77 && -56.77 < east && south < 14.09 && 14.09 < north);

const arcadia = siteImage("mars", 39.2, -188);
assert.equal(params(arcadia?.thumbnailUrl).get("LAYERS"), "MDIM21_color");
assert.equal(arcadia?.widthKm, 50);
const [arcadiaWest, , arcadiaEast] = bbox(arcadia?.thumbnailUrl);
assert.ok(arcadiaWest < 172 && 172 < arcadiaEast && arcadiaEast <= 180.5);

console.log("site-imagery: ok");
