import {User} from "../../commons/models/user";

interface IRestyContext {
  data: any;
  req: any;
  user: User;
}

type RestyCallback = (data?: any) => void;
