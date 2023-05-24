
import { BadRequestException, ForbiddenException, HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { C_BoardCategory } from '../common/constant/board_category.constant';
import { Boards } from '../entities/board.entity';
import { BoardTagMap } from '../entities/board_tag_map.entity';
import { Bookmarks } from '../entities/bookmark.entity';
import { Comments } from '../entities/comment.entity';
import { Likes } from '../entities/like.entity';
import { Tags } from '../entities/tag.entity';
import { Users } from '../entities/user.entity';
import { EntityNotFoundError, In, Repository } from 'typeorm';

@Injectable()
export class BoardService { 

    constructor(
        @InjectRepository(Boards)
        private readonly boardRepository: Repository<Boards>,
        @InjectRepository(Comments)
        private readonly commentRepository: Repository<Comments>,
        @InjectRepository(Likes)
        private readonly likeRepository: Repository<Likes>,
        @InjectRepository(Bookmarks)
        private readonly bookmarkRepository: Repository<Bookmarks>,
        @InjectRepository(Tags)
        private readonly tagRepository: Repository<Tags>,
        @InjectRepository(BoardTagMap)
        private readonly boardTagMapRepository: Repository<BoardTagMap>,
    ) {}

    async getMainPage() {
        const notice = await this.getNotice(1,5);
        const photo = await this.getPhoto(1,4,0);
        const video = await this.getBoard(C_BoardCategory.VIDEO,1,4);
        return {notice,photo,video};
    }

    async getNotice(page: number = 1, pageSize: any = 5) {
        const notice = await this.getBoard(C_BoardCategory.NOTICE,page,pageSize)
        return notice;
    }
    async getNoticeById(id: any) {
        const notice = await this.getBoardById(id,C_BoardCategory.NOTICE)
        return notice;
    }
    async createBoard(body: any,user:Users,category:C_BoardCategory) {
        const {title,content,thumbnail,tags = []} = body;
        const {userid} = user;
        // const hashTags = ["#태그5","#태그2","#태그3"]
        const hashTags = tags
        try{
            if(!title){
                throw new BadRequestException('제목을 입력해주세요.');
            }
            if(!content){
                throw new BadRequestException('내용을 입력해주세요.');
            }
            if(category===C_BoardCategory.PHOTO){
                if(!thumbnail){
                    throw new BadRequestException('썸네일을 입력해주세요.');
                }
                if(hashTags.length>0){
                    if(hashTags.length>5){
                        throw new BadRequestException('태그는 5개까지 입력 가능합니다.');
                    }
                    if(hashTags.some((tag)=>tag.length>10)){
                        throw new BadRequestException('태그는 10자 이내로 입력해주세요.');
                    }
                    if(hashTags.some((tag)=>!tag.startsWith('#'))){
                        throw new BadRequestException('모든 태그는 #으로 시작해야합니다.');
                    }

                    const DBTags = ( 
                        await this.tagRepository.find({where:{tagname:In(hashTags)}}))
                        .map((tag)=>tag.tagname);

                    hashTags.forEach(async (hashTag)=>{
                        if(!DBTags.includes(hashTag)){
                            await this.tagRepository.save({tagname:hashTag});
                        }
                    })
                }
                const board = await this.boardRepository.save({title,content,category,userid,thumbnail});
                return {board,tags:hashTags};
            }
            return await this.boardRepository.save({title,content,category,userid});
        }catch(err){
            throw err;
        }
    }
    async updateBoard(id: any, body: any, user: Users, category: C_BoardCategory) {
        const { title, content, thumbnail,
            tags=[] 
        } = body;
        const { userid } = user;
        try {
            const board = await this.boardRepository.findOneOrFail( {
                where: { boardid: id },
                relations: ['comments', 'boardTagMap', 'boardTagMap.tags'],
            });
        
            if (board.userid !== userid) {
                throw new ForbiddenException('권한이 없습니다.');
            }
            if(category===C_BoardCategory.PHOTO){
                if(tags.length>0){
                    if(tags.length>5){
                        throw new BadRequestException('태그는 5개까지 입력 가능합니다.');
                    }
                    if(tags.some((tag)=>tag.length>10)){
                        throw new BadRequestException('태그는 10자 이내로 입력해주세요.');
                    }
                    if(tags.some((tag)=>!tag.startsWith('#'))){
                        throw new BadRequestException('모든 태그는 #으로 시작해야합니다.');
                    }

                    const DBTags = await this.tagRepository.find({where:{tagname:In(tags)}});
                    const DBTagNames = DBTags.map((tag)=>tag.tagname);

                    await Promise.all(tags.map(async (tag) => {
                        if (!DBTagNames.includes(tag)) {
                            await this.tagRepository.save({ tagname: tag });
                        }
                    }));
                }
                const DBTags = await this.tagRepository.find({where:{tagname:In(tags)}});
                const de=await this.boardTagMapRepository.delete({ board: { boardid: id }});
                board.boardTagMap = [];
                const boardTagMaps = DBTags.map(tag => {
                    const boardTagMap = new BoardTagMap();
                    boardTagMap.board = board;
                    boardTagMap.tags = tag;
                    return boardTagMap;
                });
                const btms = await this.boardTagMapRepository.save(boardTagMaps);
            }
            const newBoard = await this.boardRepository.findOneOrFail( {
                where: { boardid: id },
                relations: ['comments', 'boardTagMap', 'boardTagMap.tags'],
            });
            newBoard.title = title ?? board.title;
            newBoard.content = content ?? board.content;
            newBoard.thumbnail = thumbnail ?? board.thumbnail;
            const updatedBoard = await this.boardRepository.save(newBoard);
            return updatedBoard;
        } catch (err) {
            if (err instanceof EntityNotFoundError) {
                throw new NotFoundException('게시글을 찾을 수 없습니다.');
            }
        throw err;
        }
    }
    
    async deleteBoard(id: any,user:Users) {
        const {userid} = user;
        try{
            const rightUser = await this.boardRepository.findOne({where:{boardid:id,userid}});
            if(!rightUser){
                throw new ForbiddenException('권한이 없습니다.');
            }
            return await this.boardRepository.delete({boardid:id,userid});
        }catch(err){
            throw err;
        }
    }

    async searchBoard(
        queryString:string, 
        page:number=1,
        pagesize:number=20, 
        category:C_BoardCategory, 
        hot:number = 0, 
        tag?:string[]){
            console.log("category",category)
            const query = await this.boardRepository.createQueryBuilder("board")
            .leftJoinAndSelect("board.user", "user")
            .leftJoinAndSelect("board.comments", "comments")
            .leftJoinAndSelect("board.likes", "likes")
            .select([
                "board.boardid",
                "board.title",
                "board.category",
                "board.createdAt",
                "board.view",
                "user.userid",
                "user.nickname",
                "user.profile_image",
            ])
            .loadRelationCountAndMap("board.likeCount", "board.likes")
            .loadRelationCountAndMap("board.commentCount", "board.comments")
            .where("board.category = :category", { category: category })
            .andWhere("board.deletedAt is null")
            .andWhere("(board.title like :title or board.content like :content)", { title: `%${queryString}%`, content: `%${queryString}%` })
            .having("COUNT(likes.likeid) >= :likeCount", { likeCount: hot })
            .orderBy("board.createdAt", "DESC")
            .skip((page - 1) * pagesize)
            .take(pagesize)
            if(category===C_BoardCategory.PHOTO){
                if(tag){
                    query.leftJoinAndSelect("board.boardTagMap", "boardTagMap")
                    .leftJoinAndSelect("boardTagMap.tags", "tags")
                    .andWhere("tags.tagname in (:...tags)", { tags: tag })
                    .groupBy("board.boardid, boardTagMap.id, tags.tagid")

                    const [list,count] = await query
                        .getManyAndCount();
                    return {
                        list: list.map((board)=>board.toObject()),
                        listTotalPage: Math.ceil(count / pagesize),
                        listTotalCount: count,
                    };
                }
            }
            const [list,count] = await query.groupBy("board.boardid")
                    .getManyAndCount();
            return {
                list,
                listTotalPage: Math.ceil(count / pagesize),
                listTotalCount: count,
            };
    }

    async getBoard(category:C_BoardCategory,page: number = 1, pageSize: number = 20,hot:number=0,tag?:string[]) {
        const [list,count] = await this.boardRepository.createQueryBuilder("board")
        .leftJoinAndSelect("board.user", "user")
        .leftJoinAndSelect("board.comments", "comments")
        .leftJoinAndSelect("board.likes", "likes")
        .select([
            "board.boardid",
            "board.title",
            "board.category",
            "board.createdAt",
            "board.view",
            "user.userid",
            "user.nickname",
            "user.profile_image",
        ])
        .loadRelationCountAndMap("board.likeCount", "board.likes")
        .loadRelationCountAndMap("board.commentCount", "board.comments")
        .where("board.category = :category", { category })
        .andWhere("board.deletedAt is null")
        .groupBy("board.boardid, likes.likeid, comments.commentid")
        .orderBy("board.createdAt", "DESC")
        .having("COUNT(likes.likeid) >= :likeCount", { likeCount: hot })
        .skip((page - 1) * pageSize)
        .take(pageSize)
        .getManyAndCount();
        return {
            list,
            listTotalPage: Math.ceil(count / pageSize),
            listTotalCount: count,
        };
    }

    async getBoardById(id: any, category: C_BoardCategory) {
        const free = await this.boardRepository
        .createQueryBuilder('board')
        .leftJoinAndSelect('board.user', 'user')
        .leftJoinAndSelect('board.comments', 'comments')
        .leftJoinAndSelect('board.likes', 'likes')
        .select([
            'board.boardid',
            'board.title',
            'board.content',
            'board.category',
            'board.createdAt',
            'board.view',
            'user.userid',
            'user.nickname',
            'user.profile_image',
            'comments.commentid',
            'comments.content',
            'comments.createdAt',
        ])
        .loadRelationCountAndMap('board.likeCount', 'board.likes')
        .loadRelationCountAndMap('board.commentCount', 'board.comments')
        .where('board.boardid = :boardid', { boardid: id })
        .andWhere('board.deletedAt is null')
        .andWhere('board.category = :category', { category })
        .groupBy('board.boardid, likes.likeid, comments.commentid')
        .getOne();

        if(!free){
            throw new NotFoundException('게시글이 존재하지 않습니다.');
        }

        free.view=free.view+1;
        await this.boardRepository.save(free);
        return free;
    }
    async getPhoto(page: number = 1, pageSize: number = 20, hot: number, tag: string[] = []) {    
        // tag = ["#태그3"];
        const query = this.boardRepository.createQueryBuilder('board')
        .leftJoinAndSelect('board.user', 'user')
        .innerJoinAndSelect('board.boardTagMap', 'boardTagMap')
        .innerJoinAndSelect('boardTagMap.tags', 'tags')
        .select([
            'board.boardid',
            'board.title',
            'board.thumbnail',
            'board.category',
            'board.createdAt',
            'board.view',
            "boardTagMap.id",
            "tags.tagname",
            'user.userid',
            'user.nickname',
            'user.profile_image',
        ])
        .where('board.deletedAt IS NULL')
        .andWhere('board.category = :category', { category: C_BoardCategory.PHOTO })
        .groupBy('board.boardid, boardTagMap.id, tags.tagname, user.userid')
        .loadRelationCountAndMap("board.likeCount", "board.likes")
        .loadRelationCountAndMap("board.commentCount", "board.comments");

        if (tag.length > 0) {
            query.andWhere('tags.tagname IN (:...tag)', { tag });
        }

        const [list, count] = await query
            .orderBy('board.createdAt', 'DESC')
            .skip((page - 1) * pageSize)
            .take(pageSize)
            .getManyAndCount();

        return {
            list: list.map((board) => board.toObject()),
            listTotalPage: Math.ceil(count / pageSize),
            listTotalCount: count,
        };
    }


    async getPhotoById(id: any) {
        const query = this.boardRepository.createQueryBuilder('board')
        .innerJoinAndSelect('board.boardTagMap', 'boardTagMap')
        .innerJoinAndSelect('boardTagMap.tags', 'tags')
        .leftJoinAndSelect("board.user", "user")
        .leftJoinAndSelect("board.comments", "comments")
        .leftJoinAndSelect("comments.user", "comments_user")
        .select([
            'board.boardid',
            'board.title',
            'board.thumbnail',
            'board.content',
            'board.category',
            'board.createdAt',
            'board.view',
            "user.userid",
            "user.nickname",
            "user.profile_image",
            "comments.commentid",
            "comments.content",
            "comments.createdAt",
            "comments_user.userid",
            "comments_user.nickname",
            "comments_user.profile_image",
            "boardTagMap.id",
            "tags.tagname",
        ])
        .where('board.deletedAt IS NULL')
        .andWhere('board.boardid = :id', { id })
        .andWhere('board.category = :category', { category: C_BoardCategory.PHOTO })
        .groupBy('board.boardid, boardTagMap.id, tags.tagname, user.userid, comments.commentid, comments_user.userid')
        .loadRelationCountAndMap("board.likeCount", "board.likes")
        .loadRelationCountAndMap("board.commentCount", "board.comments");

        const photo= await query.getOne();
        photo.view=photo.view+1;
        const result = await this.boardRepository
        .createQueryBuilder('board')
        .update(Boards)
        .set({ view: photo.view })
        .where('boardid = :id', { id })
        .execute();
        return photo.toObject();
    }



    async createComment(body: any,user:Users) {
        const {boardid,content} = body;
        const {userid} = user;
        try{
            if(!content){
                throw new BadRequestException('내용을 입력해주세요.');
            }
            if(!boardid){
                throw new BadRequestException('게시글을 선택해주세요.');
            }
            return await this.commentRepository.save({boardid,content,userid});
        }catch(err){
            throw err;
        }
    }


    async updateComment(id: any,body: any,user:Users) {
        const {content} = body;
        const {userid} = user;
        try{
            if(!content){
                throw new BadRequestException('내용을 입력해주세요.');
            }
            if(!id){
                throw new BadRequestException('게시글을 선택해주세요.');
            }
            const rightUser = await this.commentRepository.findOne({where:{boardid:id,userid}});
            if(!rightUser){
                throw new ForbiddenException('권한이 없습니다.');
            }
            return await this.commentRepository.update({boardid:id,userid},{content});
        }catch(err){
            throw err;
        }
    }

    async deleteComment(id: any,user:Users) {
        const {userid} = user;
        try{
            const rightUser = await this.commentRepository.findOne({where:{boardid:id,userid}});
            if(!rightUser){
                throw new ForbiddenException('권한이 없습니다.');
            }
            return await this.commentRepository.delete({boardid:id,userid});
        }catch(err){
            throw err;
        }
    }

    async likeBoard(id: any,user:Users) {
        const {userid} = user;
        if(!id){
            throw new BadRequestException('게시글을 선택해주세요.');
        }
        try{
            const liked = await this.likeRepository.findOne({where:{boardid:id}});
            if(liked){
                throw new BadRequestException('이미 좋아요를 하였습니다.');
            }
            return await this.likeRepository.save({boardid:id,userid});
        }catch(err){
            throw err;
        }
    }

    async unlikeBoard(id: any,user:Users) {
        const {userid} = user;
        try{
            const liked = await this.likeRepository.findOne({where:{boardid:id}});
            if(!liked){
                throw new BadRequestException('좋아요를 하지 않았습니다.');
            }
            return await this.likeRepository.delete({boardid:id,userid});
        }catch(err){
            throw err;
        }
    }

    async createBookmark(id: any,user:Users) {
        const {userid} = user;
        try{
            const bookmarked = await this.bookmarkRepository.findOne({where:{boardid:id}});
            if(bookmarked){
                throw new BadRequestException('이미 북마크를 하였습니다.');
            }
            return await this.bookmarkRepository.save({boardid:id,userid});
        }catch(err){
            throw err;
        }
    }

    async deleteBookmark(id: any,user:Users) {
        const {userid} = user;
        try{
            const bookmarked = await this.bookmarkRepository.findOne({where:{boardid:id,userid}});
            if(!bookmarked){
                throw new BadRequestException('북마크를 하지 않았습니다.');
            }
            return await this.bookmarkRepository.delete({boardid:id,userid});
        }catch(err){
            throw err;
        }
    }


}

