export type DataSource = Readonly<{ name: string; url: string }>;

export const dataSources: Readonly<Record<"moon" | "mars" | "earth", readonly DataSource[]>> = {
  moon: [
    { name: "LRO LOLA", url: "https://lunar.gsfc.nasa.gov/lola/" },
    { name: "LRO Diviner", url: "https://www.diviner.ucla.edu/" },
  ],
  mars: [
    { name: "MGS MOLA", url: "https://attic.gsfc.nasa.gov/mola/" },
    { name: "MRO CRISM", url: "http://crism.jhuapl.edu/" },
  ],
  earth: [
    { name: "NASADEM", url: "https://lpdaac.usgs.gov/products/nasadem_hgtv001/" },
    { name: "ASTER GED", url: "https://lpdaac.usgs.gov/products/ag100v003/" },
    { name: "EMIT", url: "https://earth.jpl.nasa.gov/emit/" },
    { name: "ICESat-2", url: "https://icesat-2.gsfc.nasa.gov/" },
  ],
};
