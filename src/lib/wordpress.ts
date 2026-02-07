export const WORDPRESS_API_URL = process.env.WORDPRESS_API_URL || 'https://cms.goldkerala.com/graphql';

export interface FeaturedImageNode {
  sourceUrl: string;
}

export interface FeaturedImage {
  node: FeaturedImageNode;
}

export interface CategoryNode {
  id: string;
  name: string;
}

export interface CategoryEdge {
  node: CategoryNode;
}

export interface Categories {
  edges: CategoryEdge[];
}

export interface BlogPosts {
  blogTitle: string | null;
  readingTime: number | null;
}

export interface Post {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  date: string;
  categories: Categories;
  blogPosts: BlogPosts;
  featuredImage: FeaturedImage | null;
}

export interface PostNode {
  nodes: Post[];
}

export interface GetAllPostsResponse {
  data: {
    posts: PostNode;
  };
}

export interface GetSinglePostResponse {
  data: {
    posts: PostNode;
  };
}

async function fetchAPI(query: string, { variables }: { variables?: any } = {}) {
  const headers = { 'Content-Type': 'application/json' };

  const res = await fetch(WORDPRESS_API_URL, {
    method: 'POST',
    headers,
    body: JSON.stringify({ query, variables }),
    next: { revalidate: 3600 }, // caching strategy: revalidate every hour
  });

  const json = await res.json();
  if (json.errors) {
    console.error(json.errors);
    throw new Error('Failed to fetch API');
  }
  return json;
}

export async function getAllPosts(): Promise<Post[]> {
  const data = await fetchAPI(
    `
    query GetFullPostContent {
      posts {
        nodes {
          id
          title
          slug
          categories {
            edges {
              node {
                id
                name
              }
            }
          }
          content
          excerpt
          date
          blogPosts {
            blogTitle
            readingTime
          }
          featuredImage {
            node {
              sourceUrl
            }
          }
        }
      }
    }
    `
  );
  return data?.data?.posts?.nodes || [];
}

export async function getPostBySlug(slug: string): Promise<Post | undefined> {
  const data = await fetchAPI(
    `
    query GetSinglePostBySlug($slugName: String!) {
      posts(where: {name: $slugName}) {
        nodes {
          id
          title
          slug
          categories {
            edges {
              node {
                id
                name
              }
            }
          }
          content
          excerpt
          date
          blogPosts {
            blogTitle
            readingTime
          }
          featuredImage {
            node {
              sourceUrl
            }
          }
        }
      }
    }
    `,
    {
      variables: {
        slugName: slug,
      },
    }
  );
  return data?.data?.posts?.nodes?.[0];
}

export async function getLatestPosts(limit: number = 3): Promise<Post[]> {
  const data = await fetchAPI(
    `
    query GetLatestPosts($limit: Int!) {
    posts(
      first: $limit
        where: {
      orderby: { field: DATE, order: DESC }
    }
    ) {
        nodes {
        id
        title
        slug
        date
        excerpt
          categories {
            edges {
              node {
              id
              name
            }
          }
        }
          blogPosts {
          blogTitle
          readingTime
        }
          featuredImage {
            node {
            sourceUrl
          }
        }
      }
    }
  }
  `,
    {
      variables: {
        limit,
      },
    }
  );
  return data?.data?.posts?.nodes || [];
}
