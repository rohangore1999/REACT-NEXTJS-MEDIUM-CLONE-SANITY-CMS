// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import SanityClient from '@sanity/client'

export const config = {
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
    useCdn: process.env.NODE_ENV == "production",
    token: process.env.SANITY_API_TOKEN, //NOTE here we are not using NEXT_PUBLIC >> it means it will not share with client(protected)

}

const client = SanityClient(config)

export default async function createComment(
    req: NextApiRequest,
    res: NextApiResponse
) {
    // decstructuring the data which we got from FORM using API[POST]
    const { _id, name, email, comment } = JSON.parse(req.body);

    try {
        await client.create({
            // creating a document just like we did manually in SANITY CMS portal
            _type: 'comment',
            post: {
                _type: 'reference',
                _ref: _id
            },
            name,
            email,
            comment
        })

    } catch (err) {
        res.status(500).json({ message: `Couldn't submit comment`, err })

    }

    console.log('Comment Submitted');
    res.status(200).json({ message: 'Comment Submitted' })
}
