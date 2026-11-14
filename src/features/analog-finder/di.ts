import {
  apiAnalogSearchRepository,
  apiProfileRepository,
  apiSiteRepository,
} from "./data/repositories/api-analog.repositories";

export const siteRepository = apiSiteRepository;
export const analogSearchRepository = apiAnalogSearchRepository;
export const profileRepository = apiProfileRepository;
