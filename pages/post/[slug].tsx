import { GetStaticProps } from 'next';
import React, { Children, useState } from 'react';
import Header from '../../components/Header';
import { sanityClient, urlFor } from "../../sanity"
import { Post } from '../../typings';
import PortableText from "react-portable-text"
import { useForm, SubmitHandler } from "react-hook-form"

interface IformInput {
    _id: string;
    name: string;
    email: string;
    comment: string;
}

interface Props {
    post: Post
}

function Post({ post }: Props) {
    // state to handle the status for comment submission
    const [submitted, setSubmitted] = useState(false); //be default it is false


    // to connect our form for handeling the error and all
    // useForm<IformInput>() >> now our form know only this type 
    const { register, handleSubmit, formState: { errors } } = useForm<IformInput>()

    // funtion when form submit
    // onSubmit:SubmitHandler<IformInput> >> so that it knows what to expect
    const onSubmit: SubmitHandler<IformInput> = (data) => {
        // console.log(data);

        // pushing the data from form to our backend '/api/createComment'
        fetch('/api/createComment', {
            method: 'POST', // method is POST
            body: JSON.stringify(data) //converting data to JSON 
        }).then(() => {
            console.log(data);
            setSubmitted(true)

        }).catch((err) => {
            console.log(err);
            setSubmitted(false)
        })
    }

    console.log(post);
    return (
        <main>
            <Header />

            <img className='w-full h-40 object-cover' src={urlFor(post.mainImage).url()!} alt='' />

            <article className='max-w-3xl mx-auto p-5'>
                <h1 className='text-3xl mt-10 mb-3'>{post.title}</h1>
                <h2 className='text-xl font-light text-gray-500 mb-2'>{post.description}</h2>

                <div className='flex items-center space-x-2'>
                    <img className='h-10 w-10 rounded-full' src={urlFor(post.author.image).url()!} alt='' />

                    <p className='font-extralight text-sm'>Blog Post by <span className='text-green-600'>{post.author.name}</span> - Published at {new Date(post._createdAt).toLocaleString()}</p>
                </div>

                <div className='mt-10'>
                    <PortableText
                        className=''
                        dataset={process.env.NEXT_PUBLIC_SANITY_DATASET!}
                        projectId={process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!}
                        content={post.body}
                        // as PortableText is a list of object, so serializers when iterate through all the object what it will do if it encounder h1 tag, h2 tag, li tag, link tag
                        serializers={
                            {
                                h1: (props: any) => (
                                    <h1 className='text-2xl font-bold my-5' {...props} />
                                ),

                                h2: (props: any) => (
                                    <h2 className='text-xl font-bold my-5' {...props} />
                                ),

                                li: ({ children }: any) => (
                                    <li className='ml-4 list-disc'>{children}</li>
                                ),

                                link: ({ href, children }: any) => (
                                    <a href={href} className='text-blue-500 hover:underline'>{children}</a>
                                )
                            }
                        } />
                </div>
            </article>

            <hr className='max-w-lg my-5 mx-auto border border-yellow-500' />

            {/* hidden field for _id */}
            <input
                {...register('_id')} //connection to react hook form, which allows to pull the data
                type="hidden"
                name="_id"
                value={post._id} //the you are in it.. that id it will give
            />

            {submitted ? (
                <div className='flex flex-col p-10 my-10 bg-yellow-500 text-white max-w-2xl mx-auto'>
                    <h3 className='text-3xl font-bold'>Thank you for submitting your comment!</h3>
                    <p>Once it has been approved, it will appear below!</p>
                </div>
            ) : (
                <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col p-5 max-w-2xl mx-auto mb-10 '>
                    {/* onSubmit >> as we are having form */}
                    {/* handleSubmit >>> we are taking from line:23 useForm(); and onSubmit is our function */}
                    <h3 className='text-sm text-yellow-500'>Enjoyed this article?</h3>
                    <h4 className='text-3xl font-bold'>Leave a comment below!</h4>
                    <hr className='py-3 mt-2' />

                    <label className='block mb-5'>
                        <span className='text-gray-700'>Name</span>
                        <input {...register('name', { required: true })} className='shadow border rounded py-2 px-3 form-input mt-1 block w-full ring-yellow-500 outline-none focus:ring' placeholder='John Appleseed' type={'text'} />
                    </label>

                    <label className='block mb-5'>
                        <span className='text-gray-700'>Email</span>
                        <input {...register('email', { required: true })} className='shadow border rounded py-2 px-3 form-input mt-1 block w-full ring-yellow-500 outline-none focus:ring' placeholder='John Appleseed' type={'email'} />
                    </label>

                    <label className='block mb-5'>
                        <span className='text-gray-700'>Comment</span>
                        <textarea {...register('comment', { required: true })} className='shadow borded rounded py-2 px-3 form-textarea mt-1 block w-full ring-yellow-500 outline-none focus:ring' placeholder='John Appleseed' rows={8} />
                    </label>

                    {/* errors will return when field validation fails */}
                    <div className='flex flex-col p-5 text-red-500'>
                        {errors.name && (
                            <span>- The Name Field is required</span>
                        )}

                        {errors.email && (
                            <span>- The Email Field is required</span>
                        )}

                        {errors.comment && (
                            <span>- The Comment Field is required</span>
                        )}

                    </div>

                    <input type={'submit'} className='shadow bg-yellow-500 hover:bg-yellow-400 focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 rounded cursor-pointer' />
                </form>
            )}

            {/* Comment - Approved will be shown */}
            <div className='flex flex-col p-10 my-10 max-w-2xl mx-auto shadow shadow-yellow-500 space-y-2'>
                <h3 className='text-4xl'>Comments</h3>
                <hr className='pb-2' />

                {post.comments.map((comment) => (
                    <div key={comment._id}>
                        <p><span className='text-yellow-500'>{comment.name}</span>: {comment.comment}</p>
                    </div>
                ))}
            </div>

        </main>
    );
}

export default Post;

// it will tell next js that what path you needs to pre-rendered

// THIS WILL GIVE US THE ARRAY OF SLUGS

// finding the page which exist
export const getStaticPaths = async () => {

    // to fetch all the id and the slugs so that we know what are the paths we to build(as slug itself are the path)
    const query = `*[_type=="post"]{
        _id,
        slug {
            current
        }
    }`;

    const posts = await sanityClient.fetch(query)

    const paths = posts.map((post: Post) => ({
        params: {
            slug: post.slug.current
        }
    }))
    /* IT WILL GIVE LIKE BELOW
    [ 
        //as we use map so it will be in array

        { 
            //as we use implicit returning a object

            params: {
                slug: "post-1",
                slug: "post-2"
            }
        }
    ]
    */



    return {
        paths,
        fallback: "blocking" //if it not exist it will show 404 error
    }
}



// now we will tell next js how to use the slug to fetch the page

// we must use getStaticPaths along will getStaticProps

// THIS WILL USE THE SLUGS FROM THE ABOVE ARRARY AND FETCH THE INFORMATION
export const getStaticProps: GetStaticProps = async ({ params }) => {
    const query = `*[_type == "post" && slug.current == $slug][0]{
        _id,
        _createdAt,
        title,
        author-> {
            name,
            image
        },
        'comments':*[
            _type =="comment" &&
            post._ref == ^._id &&
            approved == true],
        description,
        mainImage,
        slug,
        body
    }`;

    const post = await sanityClient.fetch(query,
        {
            slug: params?.slug,
            // slug.current == $slug] >> $slug means its a variable which will be replace by the slug.current value which we will be getting from line: 30 above

            // if you are not sure if it contain null or not then use  '?';
            // if you are sure that it contain value then use '!'

        }
    )

    if (!post) {
        return {
            //  as we have use fallback: "blocking" >> so if no post then next js will give you 404 page
            notFound: true
        }
    }

    return {
        // if we have post then it will return it as a props
        props: {
            post
        },
        revalidate: 60, //after 60sec it will update old cache data
    }
}



// as we are building Blog Page with backed by Sanity CMR(portal which handle comments approval, post,etc) so if we only do SSR(server side rendering) then it is not good as it will only render once only when page load.. but what if user change or post the comment we need to update it. So for that we use >>> "revalidate: 60" so now it will reload the cache after 60sec everytime