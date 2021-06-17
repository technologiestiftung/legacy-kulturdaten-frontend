export enum PublishedStatus {
  published = 'published',
  draft = 'draft',
}

export type DefaultAttributes = {
  createdAt: string;
  updatedAt: string;
  name: string;
  status: PublishedStatus;
};
