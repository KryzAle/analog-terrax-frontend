import type { StyleSpecification } from "maplibre-gl";

export type BasemapId = "satellite" | "topo" | "relief" | "geology";

type RasterLayer = Readonly<{ tiles: string; attribution: string; maxzoom: number; opacity?: number }>;

export type BasemapThumbnail = Readonly<{ url: string; opacity: number }>;

export type Basemap = Readonly<{
  id: BasemapId;
  thumbnails: readonly BasemapThumbnail[];
  style: StyleSpecification;
}>;

const ECUADOR_TILE = { z: "3", x: "2", y: "4" };

const tileUrl = (template: string) =>
  template.replace("{z}", ECUADOR_TILE.z).replace("{x}", ECUADOR_TILE.x).replace("{y}", ECUADOR_TILE.y);

const rasterStyle = (layers: readonly RasterLayer[]): StyleSpecification => ({
  version: 8,
  sources: Object.fromEntries(
    layers.map((layer, index) => [
      `raster-${index}`,
      { type: "raster", tiles: [layer.tiles], tileSize: 256, maxzoom: layer.maxzoom, attribution: layer.attribution },
    ]),
  ),
  layers: layers.map((layer, index) => ({
    id: `raster-${index}`,
    type: "raster",
    source: `raster-${index}`,
    paint: { "raster-opacity": layer.opacity ?? 1 },
  })),
});

const rasterBasemap = (id: BasemapId, layers: readonly RasterLayer[]): Basemap => ({
  id,
  style: rasterStyle(layers),
  thumbnails: layers.map((layer) => ({ url: tileUrl(layer.tiles), opacity: layer.opacity ?? 1 })),
});

const ESRI_HILLSHADE_DARK: RasterLayer = {
  tiles: "https://services.arcgisonline.com/arcgis/rest/services/Elevation/World_Hillshade_Dark/MapServer/tile/{z}/{y}/{x}",
  attribution: "Hillshade © Esri, USGS",
  maxzoom: 16,
};

export const basemaps: readonly Basemap[] = [
  rasterBasemap("satellite", [
    {
      tiles: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
      attribution: "Imagery © Esri, Maxar, Earthstar Geographics",
      maxzoom: 18,
    },
  ]),
  rasterBasemap("topo", [
    {
      tiles: "https://a.tile.opentopomap.org/{z}/{x}/{y}.png",
      attribution: "© OpenStreetMap contributors, SRTM · © OpenTopoMap (CC-BY-SA)",
      maxzoom: 17,
    },
  ]),
  rasterBasemap("relief", [
    {
      tiles:
        "https://gibs.earthdata.nasa.gov/wmts/epsg3857/best/ASTER_GDEM_Color_Shaded_Relief/default/GoogleMapsCompatible_Level12/{z}/{y}/{x}.jpg",
      attribution: "NASA GIBS · ASTER GDEM (NASA/METI)",
      maxzoom: 12,
    },
  ]),
  rasterBasemap("geology", [
    ESRI_HILLSHADE_DARK,
    {
      tiles: "https://tiles.macrostrat.org/carto/{z}/{x}/{y}.png",
      attribution: "Geology © Macrostrat (CC-BY 4.0)",
      maxzoom: 14,
      opacity: 0.75,
    },
  ]),
];

export const DEFAULT_BASEMAP_ID: BasemapId = "satellite";
