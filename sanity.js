import { createImageUrlBuilder, createCurrentUserHook, createClient } from "next-sanity";


export const config = {
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
    apiVersion: "2021-03-25",

    useCdn: process.env.NODE_ENV == "production"


}

// use for fetch information, make queries
export const sanityClient = createClient(config)

// helper function to get img url from author db
export const urlFor = (source) => createImageUrlBuilder(config).image(source)

// helper function get current user loggedin account's data
export const useCurrentUser = createCurrentUserHook(config)