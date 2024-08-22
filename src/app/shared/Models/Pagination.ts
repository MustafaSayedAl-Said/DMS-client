import { IDirectories } from "./Directories"

export interface IPagination {
    count: number
    pageSize: number
    pageNumber: number
    data: IDirectories[]
  }