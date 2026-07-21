export type HomepageSectionImage = {
  filename: string
  url: string
}

export type HomepageSection = {
  _id: string
  sectionName: string
  content: string
  image: HomepageSectionImage[]
  status: 'active' | 'inactive'
  createdAt: string
  updatedAt: string
}
