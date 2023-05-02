import { User } from '../common/decorators/user.decorator';
import { Entity, Column, PrimaryGeneratedColumn, OneToMany, JoinColumn, Unique, CreateDateColumn, OneToOne, ManyToOne } from 'typeorm';
import { Boards } from './board.entity';
import { Users } from './user.entity';


@Entity()
export class Bookmarks {
    @PrimaryGeneratedColumn()
    bookmarkid: number;

    @Column()
    userid: number;

    @Column()
    boardid: number;

    @CreateDateColumn()
    createdAt: Date;

    @ManyToOne(() => Boards, board => board.bookmarks)
    @JoinColumn({ name: 'boardid' })
    board: Boards;

    @ManyToOne(() => Users, user => user.bookmarks)
    @JoinColumn({ name: 'userid' })
    user: Users;
}
