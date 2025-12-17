import { DataSource, Repository } from "typeorm";
import { User } from "./user.entity";
import { AuthCredentialDto } from "./dto/auth-credential.dto";
export declare class UserRepository extends Repository<User> {
    constructor(dataSource: DataSource);
    createUser(authCredentialDto: AuthCredentialDto): Promise<User>;
}
