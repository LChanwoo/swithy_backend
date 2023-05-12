import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { authenticate, Strategy } from "passport";
import { AuthService } from "./auth.service";
@Injectable()
export class SuperStrategy extends PassportStrategy(Strategy,'super'){   
    constructor(
        private readonly authService: AuthService,
    ){
        super({
            usernameField: 'account',
            passwordField: 'password',
        });
    }


    async validate(email:string ,password:string, done: any,){
        try{
            // const user = await this.authService.certification(email,password);
            // if(!user){
            //     return done(null,false);
            // }
            // return user;
        }catch(err){
            return false;
        }
      }

}