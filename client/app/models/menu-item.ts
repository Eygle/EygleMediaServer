import {EPermission} from 'eygle-core/commons/core.enums';

export class MenuItem {
  translate: string;
  url: string;
  icon: string;
  exactMatch?: boolean;
  access: EPermission;
}
