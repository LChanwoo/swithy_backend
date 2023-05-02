import { Entity, Column, PrimaryGeneratedColumn, OneToMany, JoinColumn, Unique, CreateDateColumn, ManyToMany, ManyToOne, JoinTable } from 'typeorm';
import { BoardTagMap } from './board_tag_map.entity';


@Entity()
@Unique(['tagname'])
export class Tags {
    @PrimaryGeneratedColumn()
    tagid: number;

    @Column()
    tagname: string;

    @OneToMany(() => BoardTagMap, boardTagMap => boardTagMap.tags)
    boardTagMap: BoardTagMap[];
}
