import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from '../entities/user.entity';
import { Repository } from 'typeorm';
@Injectable()
export class AuthService {

    constructor(
        @InjectRepository(Users)
        private readonly userRepository: Repository<Users>,
    ) {}

    async socialLogin(payload:any,provider:string) {
        const email = payload.email;
        const sub = payload.sub;
        try{
            const user = await this.userRepository.findOne({where:{email,provider,sub}});
            if(user){
                return user;
            }else{
                const newUser = await this.userRepository.save({email,provider,sub});
                return newUser;
            }
        }catch(err){
            console.log(err)
        }
    }

    async superlogin(payload:any) {
        const email = payload.email;
        const provider = 'SUPER';
        try{
            const user = await this.userRepository.findOne({where:{email,provider}});
            if(user){
                return user;
            }else{
                const newUser = await this.userRepository.save({email,provider});
                return newUser;
            }
        
        }catch(err){
            console.log(err)
        }
    }
    async testlogin(payload:any) {
        const email = payload.email;
        const provider = 'test';
        try{
            const user = await this.userRepository.findOne({where:{email,provider}});
            if(user){
                return user;
            }else{
                const newUser = await this.userRepository.save({email,provider});
                return newUser;
            }
        
        }catch(err){
            console.log(err)
        }
    }
}
