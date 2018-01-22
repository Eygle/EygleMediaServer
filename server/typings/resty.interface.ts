import {User} from '../../commons/models/user';

export interface IRestyContext {
  data: any;
  req: any;
  user: User;
}

export type RestyCallback = (data?: any) => void;
