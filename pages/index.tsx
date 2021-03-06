import Head from 'next/head'
import Link from 'next/link';
import Header from '../components/Header'
import { sanityClient, urlFor } from '../sanity'
import { Post } from '../typings'


interface Props {
  posts: [Post]; //posts will be the array of type Post
}

// { posts }: Props >> we are desctructuring the props and getting the posts as a type of Porps from Interface
export default function Home({ posts }: Props) {

  console.log(posts);

  return (
    <div className="max-w-7xl mx-auto">
      <Head>
        <title>Medium - Clone</title>
        <link rel="icon" href="/favicon.ico" />

        {/* for post picture */}
        <meta property="og:title" content="" />
        <meta property="og:type" content="" />
        <meta property="og:image" content="/mediumlogo.png" />
        <meta name="twitter:card" content="summary_large_image" />

        <meta property="og:description" content="" />
        <meta name="twitter:image:alt" content="" />
      </Head>

      <Header />

      <div className='flex justify-between items-center bg-yellow-400 border-y border-black py-10 lg:py-0'>
        <div className='px-10 space-y-5'>
          <h1 className='text-6xl max-w-xl font-serif'><span className='underline decoration-black decoration-4'>Medium</span> is a place to write, read and connect</h1>
          <h2>It's easy and free to post your thinking on any topic and connect with millions of readers.</h2>
        </div>

        <img className='hidden md:inline-flex h-32 lg:h-full' src='https://accountabilitylab.org/wp-content/uploads/2020/03/Medium-logo.png' alt='' />
      </div>


      {/* POSTS */}

      {/* for mobile screen we have grid with col 1, for sm grid with col 2... */}

      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6 p-2 md:p-6'>
        {posts.map((post) => (
          <Link key={post._id} href={`/post/${post.slug.current}`}>
            <div className='group cursor-pointer border rounded-lg overflow-hidden'>
              {/* urlFor(post.mainImage).url()! >> we are passing the img url to our helper function so that it will give us the img url in the proper format.
              ! >>> means we KNOW that it will not contain null value
              */}

              {/* group-hover:scale-105 >> as we set the above div class as group so when we hover on that div it should scale  */}
              <img className='h-60 w-full object-cover group-hover:scale-105 transition-transform duration-200 ease-out' src={urlFor(post.mainImage).url()!} alt='' />
              <div className='flex justify-between p-5 bg-white'>
                <div>
                  <p className='text-lg font-bold'>{post.title}</p>
                  <p className='text-sm'>{post.description} by {post.author.name}</p>
                </div>

                <img className='h-12 w-12 rounded-full' src={urlFor(post.author.image).url()!} alt='' />

              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}


// for server side rendering for home as it is the index (landing page)
export const getServerSideProps = async () => {
  // making the query which will give us the data
  const query = `*[_type == "post"]{
    _id,
    title,
    slug,
    author -> {
        name,
        image
      },
    description,
    mainImage,
    slug
    }`;

  // fetching the query using sanityClient.fetch()
  const posts = await sanityClient.fetch(query)


  // returing the data so that it will load before the page
  return {
    props: {
      posts
    }
  }
}