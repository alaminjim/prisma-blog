import { PostStatus } from "../../generated/prisma/enums";

type IFiltering = {
  search: string | undefined;
  tags: string[] | [] | string;
  isFeatured: boolean | undefined | string;
  status: PostStatus | undefined;
};

type FilteringReturn = {
  search: string | undefined;
  tags: string[] | [];
  isFeatured: boolean | undefined;
  status: PostStatus | undefined;
};

const filtering = (options: IFiltering): FilteringReturn => {
  const search: string | undefined = options.search;
  const postSearch = typeof search === "string" ? search : undefined;

  const tags = options.tags ? (options.tags as string).split(",") : [];

  const isFeatured: boolean | undefined = options.isFeatured
    ? options.isFeatured === "true"
      ? true
      : options.isFeatured === "false"
      ? false
      : undefined
    : undefined;

  const status: PostStatus | undefined = options.status;

  return {
    search: postSearch,
    tags,
    isFeatured,
    status,
  };
};

export default filtering;
