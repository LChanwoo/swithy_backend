import { Entity, Column, PrimaryGeneratedColumn, OneToMany, JoinColumn, Unique, CreateDateColumn, ManyToOne } from 'typeorm';
import { Boards } from './board.entity';
import { Users } from './user.entity';



@Entity()
export class Comments {
    @PrimaryGeneratedColumn()
    commentid: number;

    @Column()
    userid: number;

    @Column()
    boardid: number;

    @Column()
    content: string;

    @CreateDateColumn()
    createdAt: Date;
    
    @ManyToOne(() => Users, user => user.userid, { eager: true })
    @JoinColumn({ name: 'userid' })
    user: Users;

    @ManyToOne(()=>Boards, board => board.boardid)
    @JoinColumn({ name: 'boardid' })
    board: Boards;

    
}
