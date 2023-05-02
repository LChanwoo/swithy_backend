import { Entity, Column, PrimaryGeneratedColumn, OneToMany, JoinColumn, Unique, CreateDateColumn, ManyToMany, ManyToOne } from 'typeorm';
import { Boards } from './board.entity';
import { Users } from './user.entity';


@Entity()
export class Likes {
    @PrimaryGeneratedColumn()
    likeid: number;

    @Column()
    userid: number;

    @Column()
    boardid: number;

    @CreateDateColumn()
    createdAt: Date;

    @ManyToOne(() => Users, user => user.userid, { eager: true })
    @JoinColumn({ name: 'userid' })
    user: Users;

    @ManyToOne(()=>Boards, board => board.likes)
    @JoinColumn({ name: 'boardid' })
    board: Boards;


}
