import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from '../entities/user.entity';
import { Repository } from 'typeorm';
import { Boards } from '../entities/board.entity';
import { Bookmarks } from '../entities/bookmark.entity';
import { Comments } from '../entities/comment.entity';

@Injectable()
export class UserService {

    constructor(
        @InjectRepository(Users)
        private readonly userRepository: Repository<Users>,
        @InjectRepository(Boards)
        private readonly boardRepository: Repository<Boards>,
        @InjectRepository(Bookmarks)
        private readonly bookmarkRepository: Repository<Bookmarks>,
        @InjectRepository(Comments)
        private readonly commentRepository: Repository<Comments>,

    ) { }

    async getUser(user:Users,pagesize:number=20) {
        const userdata = await this.userRepository.createQueryBuilder('user')
        .leftJoinAndSelect('user.myboards', 'myboards')
        .leftJoinAndSelect('user.comments', 'comments')
        .leftJoinAndSelect('user.bookmarks', 'bookmarks')
        .leftJoin('bookmarks.board', 'bookmark_board')
        .leftJoin('bookmarks.user', 'bookmark_user')
        .leftJoin('myboards.user', 'myboards_user')
        .leftJoin('myboards.likes', 'myboards_likes')
        .leftJoin('myboards.comments', 'board_comments')
        .leftJoin('comments.board', 'comment_board')
        .leftJoin('comments.user', 'comment_user')
        .select([
            'user.userid',
            'user.nickname',
            'user.profile_image',
            'user.createdAt',
            'myboards.boardid',
            'myboards.title',
            'myboards.createdAt',
            'myboards.category',
            'myboards_user.userid',
            'myboards_user.nickname',
            'myboards_user.profile_image',
            'comments.commentid',
            'comments.content',
            'comments.createdAt',
            'comment_board.boardid',
            'comment_board.title',
            'comment_board.category',
            'comment_user.userid',
            'comment_user.nickname',
            'comment_user.profile_image',
            'bookmarks.bookmarkid',
            'bookmarks.createdAt',
            'bookmark_board.boardid',
            'bookmark_board.title',
            'bookmark_board.category',
            'bookmark_user.userid',
            'bookmark_user.nickname',
            'bookmark_user.profile_image',
        ])
        .loadRelationCountAndMap('myboards_likes.likeCount','myboards.likes')
        .loadRelationCountAndMap('myboards_comments.commentCount','myboards.comments')
        .loadRelationCountAndMap('bookmark_board.likeCount','bookmark_board.likes')
        .loadRelationCountAndMap('bookmark_board.commentCount','bookmark_board.comments')
        .loadRelationCountAndMap('comment_board.likeCount','comment_board.likes')
        .loadRelationCountAndMap('comment_board.commentCount','comment_board.comments')
        .where('user.userid = :userid', { userid: user.userid })
        .groupBy('user.userid, myboards.boardid, comments.commentid, bookmarks.bookmarkid, bookmark_board.boardid, myboards_user.userid, board_comments.commentid, myboards_likes.likeid')
        .orderBy('myboards.createdAt', 'DESC')
        .addOrderBy('user.createdAt', 'DESC')
        .addOrderBy('comments.createdAt', 'DESC')
        .addOrderBy('bookmarks.createdAt', 'DESC')
        .getOne();
        userdata.bookmarks = userdata.bookmarks.slice(0,pagesize);
        userdata.myboards = userdata.myboards.slice(0,pagesize);
        userdata.comments = userdata.comments.slice(0,pagesize);

        return userdata.toMyPageObject();
    }

    async getMyBoards(user:Users,page:number = 2, pagesize : number = 20) {
        const [data,count] = await this.boardRepository.createQueryBuilder('board')
        .leftJoinAndSelect('board.user', 'user')
        .leftJoinAndSelect('board.likes', 'likes')
        .leftJoinAndSelect('board.comments', 'comments')
        .select([
            'board.boardid',
            'board.title',
            'board.createdAt',
            'board.category',
            'user.userid',
            'user.nickname',
            'user.profile_image',
        ])
        .loadRelationCountAndMap('board.likeCount', 'board.likes')
        .loadRelationCountAndMap('board.commentCount', 'board.comments')
        .where('user.userid = :userid', { userid: user.userid })
        .orderBy('board.createdAt', 'DESC')
        .offset((page - 1) * pagesize)
        .limit(pagesize)
        .getManyAndCount();
        
        return {
            myboards:data,
            bookmarksTotalPage: Math.ceil(count / pagesize),
            bookmarksTotalCount: count,
        };
    }

    async getMyComments(user:Users,page:number = 2, pagesize : number = 20) {
        const [data,count]= await this.commentRepository
        .createQueryBuilder('comment')
        .leftJoinAndSelect('comment.user', 'user')
        .leftJoinAndSelect('comment.board', 'board')
        .loadRelationCountAndMap('board.likeCount', 'board.likes')
        .loadRelationCountAndMap('board.commentCount', 'board.comments')
        .select([
            'comment.commentid', 
            'comment.content',
            'comment.createdAt',
            'user.userid',
            'user.nickname',
            'user.profile_image',
            'board.boardid',
            'board.title',
            'board.category',
        ])
        .where('comment.userid = :userid', { userid: user.userid })
        .orderBy('comment.createdAt', 'DESC')
        .skip((page - 1) * pagesize)
        .take(pagesize)
        .getManyAndCount();
        
        return {
            comments:data,
            commentsTotalPage: Math.ceil(count / pagesize),
            commentsTotalCount: count,
        };
    }

    async getMyBookmarks(user:Users,page:number = 2, pagesize : number = 20) {
        const [data,count] = await this.bookmarkRepository
        .createQueryBuilder('bookmark')
        .leftJoinAndSelect('bookmark.board', 'board')
        .leftJoinAndSelect('bookmark.user', 'user')
        .select([
            'bookmark.bookmarkid',
            'bookmark.createdAt',
            'board.boardid',
            'board.title',
            'board.category',
            'user.userid',
            'user.nickname',
            'user.profile_image'
        ])
        .loadRelationCountAndMap('bookmark_board.likeCount', 'board.likes')
        .loadRelationCountAndMap('bookmark_board.commentCount', 'board.comments')
        .where('bookmark.userid = :userid', { userid: user.userid })
        .orderBy('bookmark.createdAt', 'DESC')
        .skip((page - 1) * pagesize)
        .take(pagesize)
        .getManyAndCount();
        return {
            bookmarks:data,
            bookmarksTotalPage: Math.ceil(count / pagesize),
            bookmarksTotalCount: count,
        };

    }

    async changeNickname(user:Users,nickname:string) {
        const userdata= await this.userRepository.findOne({where:{userid:user.userid}});
        userdata.nickname=nickname;
        return await this.userRepository.save(userdata);
    }

    async changeProfile(user:Users,profile:string) {
        const userdata= await this.userRepository.findOne({where:{userid:user.userid}});
        userdata.profile_image=profile;
        return await this.userRepository.save(userdata);
    }

        

}
