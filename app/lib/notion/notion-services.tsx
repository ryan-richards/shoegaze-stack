import { Client } from "@notionhq/client";
import { BlogPost, PostPage } from "../@types/schema";
import { NotionToMarkdown } from "notion-to-md";

export default class NotionService {
    client: Client
    n2m: NotionToMarkdown;

    constructor() {
        this.client = new Client({ auth: process.env.NOTION_TOKEN });
        this.n2m = new NotionToMarkdown({ notionClient: this.client });
    }

    async getPublishedBlogPosts(): Promise<BlogPost[]> {
        const database = process.env.NOTION_DB_ID ?? '';
        // list blog posts
        const response = await this.client.databases.query({
            database_id: database,
            filter: {
                property: 'Status',
                select: {
                    equals: 'Live'
                }
            },
            sorts: [
                {
                    property: 'Updated',
                    direction: 'descending'
                }
            ]
        });

        return response.results.map(res => {
            return NotionService.pageToPostTransformer(res);
        })
    }

    async getPublishedBlogPostsByCategory( category : any): Promise<BlogPost[]> {

        const database = process.env.NOTION_DB_ID ?? '';
        // list blog posts
        const response = await this.client.databases.query({
            database_id: database,
            filter: {
                and: [{
                    property: 'Status',
                    select: {
                        equals: 'Live'
                    }
                },
                {
                    property: 'Tags',
                    multi_select: {
                        contains: category
                    }
                }
                ]

            },
            sorts: [
                {
                    property: 'Updated',
                    direction: 'descending'
                }
            ]
        });

        return response.results.map(res => {
            return NotionService.pageToPostTransformer(res);
        })
    }

    async getPublishedBlogPostsRecent( page_size : any): Promise<BlogPost[]> {

        const database = process.env.NOTION_DB_ID ?? '';
        // list blog posts
        const response = await this.client.databases.query({
            database_id: database,
            filter: {
                    property: 'Status',
                    select: {
                        equals: 'Live'
                    }  
            },
            sorts: [
                {
                    property: 'Updated',
                    direction: 'descending'
                }
            ],
            page_size: page_size
        });

        return response.results.map(res => {
            return NotionService.pageToPostTransformer(res);
        })
    }

    async getSingleBlogPost(slug: string): Promise<PostPage> {
        let post, markdown

        const database = process.env.NOTION_DB_ID ?? '';
        // list of blog posts
        const response = await this.client.databases.query({
            database_id: database,
            filter: {
                property: 'Slug',
                rich_text: {
                    equals: slug // slug
                },
                // add option for tags in the future
            },
            sorts: [
                {
                    property: 'Updated',
                    direction: 'descending'
                }
            ]
        });

        if (!response.results[0]) {
            throw 'No results available'
        }

        // grab page from notion
        const page = response.results[0];

        const { results } = await this.client.blocks.children.list({
            block_id: page.id,
        });

        const mdBlocks = await this.n2m.pageToMarkdown(page.id)
        markdown = this.n2m.toMarkdownString(mdBlocks);
        post = NotionService.pageToPostTransformer(page);

        return {
            post,
            markdown
        }
    }

    private static pageToPostTransformer(page: any): BlogPost {
        return {
            id: page.id,
            title: page.properties.Name.title[0].plain_text,
            tags: page.properties.Tags.multi_select,
            description: page.properties.Description.rich_text[0].plain_text,
            date: page.properties.Updated.last_edited_time,
            slug: page.properties.Slug.rich_text[0].plain_text,
            thumbnail: page.properties.Thumbnail.url
        }
    }
}