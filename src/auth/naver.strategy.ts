import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport";
import { C_Provider } from "../common/constant/provider";
import { AuthService } from "./auth.service";
@Injectable()
export class NaverStrategy extends PassportStrategy(Strategy,C_Provider.NAVER){     
    constructor(
        private readonly authService: AuthService,
    ){
        super();
    }

    async authenticate(req: any, options: any,) { 
        const user = await this.authService.socialLogin(req.body,C_Provider.NAVER);
        return this.success(user);
    }

}