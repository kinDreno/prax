import { PrismaClient } from '@prisma/client'
import { NextApiRequest, NextApiResponse } from 'next'

const prisma = new PrismaClient()

export default async function handler(req : NextApiRequest, res : NextApiResponse) {
    const { method } = req;

    switch (method) {
        case "GET":
            try {
                const posts = await prisma.post.findMany();
                res.status(200).json(posts)
            } catch (e) {
                console.error(e)
                res.status(500).json({error: "Internal Server Error!"})
            } break;

        case "POST":
            const { title, content } = req.body;
            if (!title || !content) {return res.status(400).json({error: "Title and Content are Required!"})}
            try {
                const post = await prisma.post.create({
                    data: { title, content }
                })
                res.status(201).json(post)
            } catch(e) {
                console.error(e)
                res.status(500).json({error: "Internal Server Error!"})
            } break;

        case "PUT":
            const { id, updatedTitle, updatedContent } = req.body;
            // handle the errors first before the main logic run.
            if (!id || !updatedContent || !updatedTitle) {return res.status(400).json({error: "Inputs must not be empty!"})}

            try {
                const updatedPost = await prisma.post.update({
                    where: { id: Number(id) },
                    data: {title: updatedTitle, content: updatedContent}
                })
                res.status(200).json(updatedPost)
            } catch (e) {
                console.error(e)
                res.status(404).json({error: "Post not found."})
            } break;

        case 'DELETE':
            const { id: deleteId } = req.query;
            try {
                await prisma.post.delete({
                    where: { id: Number(deleteId) }
                })
                res.status(204).end()
            } catch (e) {
                console.error(e);
                res.status(404).json({error: "Post not found."})
            } break;

        default:
            res.setHeader("Allow", ['GET', 'POST', 'PUT', 'DELETE'])
            res.status(405).end(`Method ${method} Not Allowed`);
    }
    
}