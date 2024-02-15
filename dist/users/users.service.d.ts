import Roles from 'src/database/models/role.model';
import { User } from 'src/database/models/user.model';
import UserRole from 'src/database/models/userRole.model';
export declare class UsersService {
    readonly userModel: typeof User;
    readonly roleModel: typeof Roles;
    readonly userRoleModel: typeof UserRole;
    constructor(userModel: typeof User, roleModel: typeof Roles, userRoleModel: typeof UserRole);
    create(payload: any): Promise<any>;
    findByEmail(email: string): Promise<User>;
}
