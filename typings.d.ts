// defination typescripts file

// Post >> files I got from Sanity portal http://localhost:3333/ under particular post >>> inspect
export interface Post {
    _id: string;
    _createdAt: string;
    title: string;
    author: {
        name: string;
        image: string;
    },
    comments: Comment[]; //comments will be the array of type Comment { which means it knows what it containt in Comment array}
    description: string;
    mainImage: {
        asset: {
            url: string;
        };
    };
    slug: {
        current: string;
    };
    body: [object];
}

export interface Comment {
    approved: boolean;
    comment: string;
    email: string;
    name: string;
    post: {
        _ref: string;
        _type: string;
    };
    _createdAt: string;
    _id: string;
    _rev: string;
    _type: string;
    _updatedAt: string;
}