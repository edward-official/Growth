import { DataSource, Repository } from "typeorm";
import { User } from "./user.entity";
import { ConflictException, Injectable, InternalServerErrorException } from "@nestjs/common";
import { AuthCredentialDto } from "./dto/auth-credential.dto";
import { InjectDataSource } from "@nestjs/typeorm";
import * as bcrypt from "bcryptjs";

@Injectable()
export class UserRepository extends Repository<User> {
  constructor(@InjectDataSource() dataSource: DataSource) {
    super(User, dataSource.createEntityManager());
  }

  async createUser(authCredentialDto: AuthCredentialDto): Promise<User> {
    const { username, password } = authCredentialDto;

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = this.create({ username, password: hashedPassword }); // Entity 인스턴스 생성
    try {
      await this.save(user);
    } catch (error) {
      if (error.code === "23505") {
        // duplicate username
        throw new ConflictException("Username already exists");
      } else {
        throw new InternalServerErrorException();
      }
    }
    return user;
  }
}
