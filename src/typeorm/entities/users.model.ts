import {ApiProperty} from '@nestjs/swagger';
import {Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn} from 'typeorm';
import {UserRequest} from './user-requests.model';
import {Exclude} from "class-transformer";

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    @ApiProperty({example: 1, description: "Unique identifier of user"})
    id?: number;

    @Column({unique: true})
    @ApiProperty({example: "user123", description: "Unique user's username"})
    username: string;

    @Exclude()
    @Column()
    password: string;

    @Column({unique: true})
    @ApiProperty({example: "user@gmail.com", description: "User's email"})
    email: string;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;

    @OneToMany(() => UserRequest, requests => requests.requester)
    requests: UserRequest[];

    @Column({nullable: true, name: 'discord_id'})
    @ApiProperty({example: '123456789', description: 'Discord ID'})
    discordId: string;
}