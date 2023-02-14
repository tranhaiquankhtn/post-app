export interface IMenuItem {
    icon: string;
    title: string;
    link?: string;
}

export interface IMenuGroup {
    header: string;
    children: IMenuItem[];
}
