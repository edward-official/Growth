import { DataSource, Repository } from 'typeorm';
import { Comment } from './comment.entity';
export declare class CommentRepository extends Repository<Comment> {
    private readonly dataSource;
    constructor(dataSource: DataSource);
}
