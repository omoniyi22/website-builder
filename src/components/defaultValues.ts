import { Page } from "@/types";

export const defaultValue: Page = {
    id: "1",
    title: "Home",
    slug: "home",
    urlPrefix: "/",
    showInNav: true,
    parentId: null,
    isDummy: false,
    order: 1,
    children: ["2",],
    headerConfig: {
        enabled: false,
        height: 100,
        backgroundImage: "header-bg.jpg",
        backgroundColor: "#ffffff",
    },
    footerConfig: {
        enabled: false,
        content: "© 2024 My Website",
    },
    content: [
        {
            id: "block-1",
            type: "text",
            content: {
                text: "Welcome to the homepage!",
                columns: [

                ]
            },
            settings: {
                width: "normal",
                alignment: "center",
                padding: "small",
                fontSize: "large",
                fontWeight: "bold",
                style: {
                    backgroundColor: "#f9f9f9",
                    textColor: "#333",
                    borderRadius: "8px",
                    border: "1px solid #ddd",
                },
            },
        },
        {
            id: "block-2",
            type: "image",
            content: {
                src: "hero.jpg",
                alt: "Hero image",
            },
            settings: {
                width: "wide",
                alignment: "center",
                padding: "none",
            },
        },
    ],
    isPublished: true,
    createdAt: new Date("2024-12-01T00:00:00Z"),
    updatedAt: new Date("2024-12-10T12:00:00Z"),
};