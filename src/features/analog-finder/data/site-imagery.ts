import type { Body, SiteImage } from "../domain/entities";

const WMS_URL = "https://planetarymaps.usgs.gov/cgi-bin/mapserv";
const THUMBNAIL_PX = 128;
const PREVIEW_PX = 320;
const POLAR_LAT = 80;

type Crop = Readonly<{ map: string; layer: string; srs: string; bbox: readonly number[]; source: string }>;

const RADIUS_KM: Readonly<Record<Exclude<Body, "earth">, number>> = { moon: 1737.4, mars: 3389.5 };
const HALF_WIDTH_KM: Readonly<Record<Exclude<Body, "earth">, number>> = { moon: 20, mars: 25 };

const toRadians = (degrees: number) => (degrees * Math.PI) / 180;

const wrapLongitude = (lon: number) => ((((lon + 180) % 360) + 360) % 360) - 180;

const cylindricalBbox = (body: Exclude<Body, "earth">, lat: number, lon: number) => {
  const halfLat = HALF_WIDTH_KM[body] / ((RADIUS_KM[body] * Math.PI) / 180);
  const halfLon = halfLat / Math.cos(toRadians(lat));
  const center = wrapLongitude(lon);
  return [center - halfLon, lat - halfLat, center + halfLon, lat + halfLat];
};

const southPolarBbox = (lat: number, lon: number) => {
  const rho = 2 * RADIUS_KM.moon * 1000 * Math.tan(Math.PI / 4 + toRadians(lat) / 2);
  const x = rho * Math.sin(toRadians(lon));
  const y = rho * Math.cos(toRadians(lon));
  const half = HALF_WIDTH_KM.moon * 1000;
  return [x - half, y - half, x + half, y + half];
};

// ponytail: the north lunar pole and both Mars poles fall back to the cylindrical crop; add a polar map when a target sits there
const cropFor = (body: Exclude<Body, "earth">, lat: number, lon: number): Crop => {
  if (body === "moon" && lat <= -POLAR_LAT) {
    return {
      map: "/maps/earth/moon_spole.map",
      layer: "LRO_WAC_south",
      srs: "EPSG:32761",
      bbox: southPolarBbox(lat, lon),
      source: "LRO WAC · USGS",
    };
  }
  return body === "moon"
    ? {
        map: "/maps/earth/moon_simp_cyl.map",
        layer: "LOLA_Kaguya_Shade",
        srs: "EPSG:4326",
        bbox: cylindricalBbox(body, lat, lon),
        source: "LOLA/Kaguya · USGS",
      }
    : {
        map: "/maps/mars/mars_simp_cyl.map",
        layer: "MDIM21_color",
        srs: "EPSG:4326",
        bbox: cylindricalBbox(body, lat, lon),
        source: "Viking MDIM 2.1 · USGS",
      };
};

const cropUrl = (crop: Crop, px: number) => {
  const params = new URLSearchParams({
    map: crop.map,
    SERVICE: "WMS",
    VERSION: "1.1.1",
    REQUEST: "GetMap",
    LAYERS: crop.layer,
    STYLES: "",
    SRS: crop.srs,
    BBOX: crop.bbox.map((value) => value.toFixed(4)).join(","),
    WIDTH: String(px),
    HEIGHT: String(px),
    FORMAT: "image/jpeg",
  });
  return `${WMS_URL}?${params.toString()}`;
};

export const siteImage = (body: Body, lat: number, lon: number): SiteImage | null => {
  if (body === "earth") return null;
  const crop = cropFor(body, lat, lon);
  return {
    thumbnailUrl: cropUrl(crop, THUMBNAIL_PX),
    previewUrl: cropUrl(crop, PREVIEW_PX),
    widthKm: HALF_WIDTH_KM[body] * 2,
    source: crop.source,
  };
};
