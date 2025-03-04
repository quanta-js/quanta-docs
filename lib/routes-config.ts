// for page navigation & to sort on leftbar

export type EachRoute = {
    title: string;
    href: string;
    noLink?: true; // noLink will create a route segment (section) but cannot be navigated
    items?: EachRoute[];
    tag?: string;
};

export const ROUTES: EachRoute[] = [
    {
        title: "Getting Started",
        href: "/getting-started",
        noLink: true,
        items: [
            { title: "Introduction", href: "/introduction" },
            {
                title: "Installation",
                href: "/installation",
            },
            { title: "Quick Start Guide", href: "/quick-start-guide" },
        ],
    },
    {
        title: "Guides",
        href: "/guides",
        noLink: true,
        items: [
            { title: "Reactive State", href: "/reactive-state" },
            { title: "Computed Values", href: "/computed-values" },
            { title: "Watching State", href: "/watching-state" },
            { title: "Managing Stores", href: "/managing-stores" },
            {
                title: "Handling Side Effects",
                href: "/handling-side-effects",
                tag: "Beta",
            },
        ],
    },
    {
        title: "API Reference",
        href: "/api",
        noLink: true,
        items: [
            { title: "createStore", href: "/create-store" },
            { title: "reactive", href: "/reactive" },
            { title: "computed", href: "/computed" },
            { title: "watch", href: "/watch" },
        ],
    },
    {
        title: "Contributing",
        href: "/contributing",
    },
    {
        title: "Changelog",
        href: "/changelog",
        tag: "Updated",
    },
];

type Page = { title: string; href: string };

function getRecurrsiveAllLinks(node: EachRoute) {
    const ans: Page[] = [];
    if (!node.noLink) {
        ans.push({ title: node.title, href: node.href });
    }
    node.items?.forEach((subNode) => {
        const temp = { ...subNode, href: `${node.href}${subNode.href}` };
        ans.push(...getRecurrsiveAllLinks(temp));
    });
    return ans;
}

export const page_routes = ROUTES.map((it) => getRecurrsiveAllLinks(it)).flat();
