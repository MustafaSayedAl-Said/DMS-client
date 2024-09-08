export interface ActionLog{
    Id: number;
    ActionType: number;
    UserId: number;
    DocumentId: number | null;
    UserName: string;
    DocumentName: string;
    CreationDate: Date
}