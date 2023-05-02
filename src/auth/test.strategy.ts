import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { authenticate, Strategy } from "passport";
import { AuthService } from "./auth.service";
@Injectable()
export class TestStrategy extends PassportStrategy(Strategy,'test'){   
    constructor(
        private readonly authService: AuthService,
    ){
        super({
            usernameField: 'accest_token',
            // passwordField: 'password',
        });
    }

    async authenticate(req: any, options: any,) {
        const { email, password } = req.body;    
        const user = await this.authService.testlogin(req.body);
            

        return this.success(user);

    }

}