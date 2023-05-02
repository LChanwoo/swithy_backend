import { Entity, Column, PrimaryGeneratedColumn, OneToMany, JoinColumn, Unique, CreateDateColumn, ManyToOne, ManyToMany, JoinTable } from 'typeorm';
import { Boards } from './board.entity';
import { Tags } from './tag.entity';


@Entity()
export class BoardTagMap {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Boards, board => board.boardTagMap)
    @JoinColumn({ name: 'boardid' })
    board: Boards;
    
    @ManyToOne(() => Tags, tag => tag.boardTagMap)
    @JoinColumn({ name: 'tagid' })
    tags: Tags;
    
}
