"use server";

import { authSession } from "@/lib/auth-utils";
import prisma from "@/lib/db";
import { Post, PostStatus } from "../generated/prisma/client";
import { PostFormValues } from "@/components/post-form";

const PAGE_SIZE = 10;

export const getUniquePost = async (id: string) => {
  try {
    const session = await authSession();

    if (!session) {
      throw new Error("Unauthorized: User Id not found");
    }

    const res = (await prisma.post.findUnique({ where: { id } })) as Post;

    return res;
  } catch (error) {
    console.error({ error });
    throw new Error("Something went error");
  }
};

export const createPost = async (params: PostFormValues) => {
  try {
    const session = await authSession();

    if (!session) {
      throw new Error("Unauthorized: User Id not found");
    }

    const { categories, tags, id, ...rest } = params;
    const data = { ...rest, tags: tags.map((tag) => tag.value) };

    const res = await prisma.post.create({
      data: {
        ...data,
        status: data.status as PostStatus,
        userId: session.user.id,
      },
    });

    return res;
  } catch (error) {
    console.error({ error });
    // throw new Error("Something went wrong");
  }
};

export const updatePost = async (params: PostFormValues) => {
  try {
    const session = await authSession();

    if (!session) {
      throw new Error("Unauthorized: User Id not found");
    }

    const { categories, tags, id, ...rest } = params;
    const data = { ...rest, tags: tags.map((tag) => tag.value) };

    const res = await prisma.post.update({
      where: { id },
      data: {
        ...data,
        userId: session.user.id,
        status: data.status as PostStatus,
      },
    });

    return res;
  } catch (error) {
    console.error({ error });
    throw new Error("Something went wrong");
  }
};

export const getAllPosts = async () => {
  try {
    const session = await authSession();

    if (!session) {
      throw new Error("Unauthorized: User Id not found");
    }

    const res = await prisma.post.findMany({
      where: { userId: session.user.id },
      orderBy: { updateAt: "desc" },
      include: { category: true },
    });

    return res;
  } catch (error) {
    console.error({ error });
    throw new Error("Something went wrong");
  }
};

export const removePost = async (id: string) => {
  try {
    const session = await authSession();

    if (!session) {
      throw new Error("Unauthorized: User Id not found");
    }
    const res = await prisma.post.delete({
      where: { id },
    });

    return res;
  } catch (error) {
    console.error({ error });
    throw new Error("Something went wrong");
  }
};

export const getPostsByUser = async () => {
  try {
    const session = await authSession();

    if (!session) {
      throw new Error("Unauthorized: User Id not found");
    }
    const res = await prisma.post.findMany({
      where: { userId: session.user.id },
      orderBy: { updateAt: "desc" },
    });

    return res;
  } catch (error) {
    console.error({ error });
    throw new Error("Something went wrong");
  }
};

// front end
export const getPosts = async (page: number) => {
  const skip = (page - 1) * PAGE_SIZE;
  const session = await authSession();

  const currentUser = session?.user.id
    ? await prisma.user.findUnique({
        where: { id: session.user.id },
        select: { savedPosts: true },
      })
    : null;

  try {
    const [posts, totalCount] = await prisma.$transaction([
      prisma.post.findMany({
        skip,
        take: PAGE_SIZE,
        orderBy: { updateAt: "desc" },
        include: {
          user: {
            select: { image: true, name: true, id: true, savedPosts: true },
          },
          category: true,
        },
      }),
      prisma.post.count(),
    ]);

    return {
      posts: posts.map((post) => ({
        ...post,
        savedPost: currentUser?.savedPosts ?? [],
      })),
      totalPages: Math.ceil(totalCount / PAGE_SIZE),
      currentPage: page,
    };
  } catch (error) {
    console.error({ error });
    throw new Error("Something went wrong");
  }
};
