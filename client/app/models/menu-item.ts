import {EPermission} from "../../../commons/core/core.enums";

export class MenuItem {
  translate: string;
  url: string;
  icon: string;
  exactMatch?: boolean;
  access: EPermission;
}
