import { AuthService } from './auth.service';
import { AuthCredentialDto } from './dto/auth-credential.dto';
import { User } from './user.entity';
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
    signUp(authCredentialDto: AuthCredentialDto): Promise<User>;
    signIn(authCredentialDto: AuthCredentialDto): Promise<{
        accessToken: string;
    }>;
    test(user: User): Promise<string>;
}
