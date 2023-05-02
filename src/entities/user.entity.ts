import { Entity, Column, PrimaryGeneratedColumn, OneToMany, JoinColumn, Unique, CreateDateColumn, ManyToMany, JoinTable, ManyToOne } from 'typeorm';
import { Boards } from './board.entity';
import { Bookmarks } from './bookmark.entity';
import { Comments } from './comment.entity';

@Entity()
// @Unique(['email'])
export class Users {
    @PrimaryGeneratedColumn()
    userid: number;

    @Column()
    email: string;

    @Column()
    sub: string;

    @Column({
        default: 'https://avatars.githubusercontent.com/u/76847245?v=4'
    })
    profile_image: string;

    @Column(
        {default: 'SWITHy'}
    )
    nickname: string;

    @Column()
    provider: string;
    
    @OneToMany(() =>Comments, comment => comment.user)
    @JoinColumn({ name: 'userid' })
    comments: Comments[];
    
    @OneToMany(() => Boards, board => board.user)
    myboards: Boards[];

    @OneToMany(() => Bookmarks, bookmark => bookmark.user)
    @JoinColumn({ name: 'userid' })
    bookmarks: Bookmarks[];
    
    @CreateDateColumn()
    createdAt: Date;

    get myboardsTotalPage () {
        return Math.ceil(this.myboards.length / 20);
    }

    get bookmarksTotalPage () {
        return Math.ceil(this.bookmarks.length / 20);
    }

    get commentsTotalPage () {
        return Math.ceil(this.comments.length / 20);
    }

    get myboardsTotalCount () {
        return this.myboards.length;
    }

    get bookmarksTotalCount () {
        return this.bookmarks.length;
    }

    get commentsTotalCount () {
        return this.comments.length;
    }
    toMyPageObject() {
        return {
            userid: this.userid,
            email: this.email,
            nickname: this.nickname,
            profile_image: this.profile_image,
            createdAt: this.createdAt,
            myboards: this.myboards,
            bookmarks: this.bookmarks,
            comments: this.comments,
            myboardsTotalPage: this.myboardsTotalPage,
            bookmarksTotalPage: this.bookmarksTotalPage,
            commentsTotalPage: this.commentsTotalPage,
            myboardsTotalCount: this.myboardsTotalCount,
            bookmarksTotalCount: this.bookmarksTotalCount,
            commentsTotalCount: this.commentsTotalCount,
        }
    }

    toMyBoardObject() {
        return {
            myboards: this.myboards?.map((board) => board?.toListObject()),
            myboardsTotalPage: this.myboardsTotalPage,
            myboardsTotalCount: this.myboardsTotalCount,
        }
    }

    // toMyBoards() {
    //     return this.myboards;
    // }

    // toMyBoardsTotalPage() {
    //     return this.myboardsTotalPage;
    // }

    // toMyBoardsTotalCount() {
    //     return this.myboardsTotalCount;
    // }

}