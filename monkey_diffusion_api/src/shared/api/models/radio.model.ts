import { DiffusionLink, OnDemandLink } from '../types/RadioDiffusionLink';

export class RadioModel {
  id: string;
  name: string;
  websiteUrl: string;
  liveStream: (DiffusionLink | OnDemandLink)[];
  videoLiveUrl: string;

  constructor(radio: RadioModel) {
    Object.assign(this, radio);
  }
}
