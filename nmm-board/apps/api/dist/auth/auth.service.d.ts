import { UserRepository } from './user.repository';
import { AuthCredentialDto } from './dto/auth-credential.dto';
import { User } from './user.entity';
import { JwtService } from '@nestjs/jwt';
export declare class AuthService {
    private readonly userRepository;
    private readonly jwtService;
    constructor(userRepository: UserRepository, jwtService: JwtService);
    signUp(authCredentialDto: AuthCredentialDto): Promise<User>;
    signIn(authCredentialDto: AuthCredentialDto): Promise<{
        accessToken: string;
    }>;
}
