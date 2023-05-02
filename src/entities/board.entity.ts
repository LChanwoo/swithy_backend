import { Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn, TagSet, UpdateDateColumn } from "typeorm";
import { BoardTagMap } from "./board_tag_map.entity";
import { Bookmarks } from "./bookmark.entity";
import { Comments } from "./comment.entity";
import { Likes } from "./like.entity";
import { Tags } from "./tag.entity";
import { Users } from "./user.entity";

@Entity()
export class Boards {
    @PrimaryGeneratedColumn()
    boardid: number;

    @Column({
        nullable: true
    })
    thumbnail: string;

    @Column()
    category: string;

    @Column()
    title: string;

    @Column()
    userid: number;

    @Column()
    content: string;

    @Column({
        default: 0
    })
    view: number;

    @CreateDateColumn()
    createdAt: Date;
    
    @UpdateDateColumn()
    updatedAt: Date;

    @DeleteDateColumn({nullable: true})
    deletedAt: Date;

    @ManyToOne(() => Users, user => user.myboards, {eager: true})
    @JoinColumn({name: "userid"})
    user: Users;

    @OneToMany(()=> Comments, comment => comment.board, )
    @JoinColumn({ name: 'boardid' })
    comments: Comments[];

    @OneToMany(()=> Likes, like => like.board,)
    @JoinColumn({ name: 'boardid' })
    likes: Likes[];

    @OneToMany(() => Bookmarks, bookmark => bookmark.board)
    @JoinColumn({ name: 'boardid' })
    bookmarks: Bookmarks[];
;
    @OneToMany(() => BoardTagMap, boardTagMap => boardTagMap.board,{cascade: true})
    @JoinColumn({ name: 'boardid' })
    boardTagMap: BoardTagMap[];

    likeCount() {
        return this.likes.length;
    }

    commentCount() {
        return this.comments.length;
    }

    toObject() {
        const tagNames = this.boardTagMap.map(boardTagMap => boardTagMap.tags.tagname);
        return {
            boardid: this.boardid,
            category: this.category,
            title: this.title,
            content: this.content,
            view: this.view,
            createdAt: this.createdAt,
            updatedAt: this.updatedAt,
            deletedAt: this.deletedAt,
            user: this.user,
            tags: tagNames,
            comments: this.comments,
            likeCount: this.likeCount,
            commentCount: this.commentCount
        };
    }


    toListObject() {
        return {
            boardid: this.boardid,
            category: this.category,
            title: this.title,
            user: this.user,
            view: this.view,
            createdAt: this.createdAt,
            likeCount: this.likeCount,
            commentCount: this.commentCount
        }
    }




}
