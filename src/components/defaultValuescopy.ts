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
            "id": "block-1",
            "type": "text",
            "className": "bg-white",
            "settings": {},
            "content": [
                {
                    "type": "text",
                    "id": "block-2",
                    "className": "mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8",
                    "settings": {},
                    "content": [
                        {
                            "id": "block-3",
                            "type": "text",
                            "className": "flex h-16 items-center justify-between",
                            "settings": {},
                            "content": [
                                {
                                    "id": "block-4",
                                    "type": "text",
                                    "className": "flex-1 md:flex md:items-center md:gap-12",
                                    "settings": {},
                                    "content": [
                                        {
                                            "id": "block-5",
                                            "type": "link",
                                            "content": {
                                                "text": "",
                                                "href": "#"
                                            },
                                            "className": "block text-teal-600",
                                            "settings": {
                                                "srOnly": true
                                            }
                                        }
                                    ]
                                },
                                {
                                    "id": "block-6",
                                    "type": "text",
                                    "className": "md:flex md:items-center md:gap-12",
                                    "settings": {},
                                    "content": [
                                        {
                                            "id": "block-7",
                                            "type": "menu",
                                            "settings": {
                                                "ariaLabel": "Global"
                                            },
                                            "className": "hidden md:block",
                                            "content": [
                                                {
                                                    "id": "block-8",
                                                    "type": "text",
                                                    "className": "flex items-center gap-6 text-sm",
                                                    "settings": {},
                                                    "content": [
                                                        {
                                                            "id": "block-9",
                                                            "type": "link",
                                                            "content": {
                                                                "text": "About",
                                                                "href": "#"
                                                            },
                                                            "className": "text-gray-500 transition hover:text-gray-500/75",
                                                            "settings": {}
                                                        },
                                                        {
                                                            "id": "block-10",
                                                            "type": "link",
                                                            "content": {
                                                                "text": "Careers",
                                                                "href": "#"
                                                            },
                                                            "className": "text-gray-500 transition hover:text-gray-500/75",
                                                            "settings": {}
                                                        },
                                                        {
                                                            "id": "block-11",
                                                            "type": "link",
                                                            "content": {
                                                                "text": "History",
                                                                "href": "#"
                                                            },
                                                            "className": "text-gray-500 transition hover:text-gray-500/75",
                                                            "settings": {}
                                                        },
                                                        {
                                                            "id": "block-12",
                                                            "type": "link",
                                                            "content": {
                                                                "text": "Services",
                                                                "href": "#"
                                                            },
                                                            "className": "text-gray-500 transition hover:text-gray-500/75",
                                                            "settings": {}
                                                        },
                                                        {
                                                            "id": "block-13",
                                                            "type": "link",
                                                            "content": {
                                                                "text": "Projects",
                                                                "href": "#"
                                                            },
                                                            "className": "text-gray-500 transition hover:text-gray-500/75",
                                                            "settings": {}
                                                        },
                                                        {
                                                            "id": "block-14",
                                                            "type": "link",
                                                            "content": {
                                                                "text": "Blog",
                                                                "href": "#"
                                                            },
                                                            "className": "text-gray-500 transition hover:text-gray-500/75",
                                                            "settings": {}
                                                        }
                                                    ]
                                                }
                                            ]
                                        },
                                        {
                                            "id": "block-15",
                                            "type": "text",
                                            "className": "hidden md:relative md:block",
                                            "settings": {},
                                            "content": [
                                                {
                                                    "id": "block-16",
                                                    "type": "button",
                                                    "content": {
                                                        "ariaLabel": "Toggle dashboard menu",
                                                        "imgSrc": "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=1770&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
                                                        "altText": ""
                                                    },
                                                    "className": "overflow-hidden rounded-full border border-gray-300 shadow-inner",
                                                    "settings": {}
                                                },
                                                {
                                                    "id": "block-17",
                                                    "type": "menu",
                                                    "settings": {
                                                        "className": "absolute end-0 z-10 mt-0.5 w-56 textide-y textide-gray-100 rounded-md border border-gray-100 bg-white shadow-lg",
                                                        "role": "menu"
                                                    },
                                                    "content": [
                                                        {
                                                            "id": "block-18",
                                                            "type": "link",
                                                            "content": {
                                                                "text": "My profile",
                                                                "href": "#"
                                                            },
                                                            "className": "block rounded-lg px-4 py-2 text-sm text-gray-500 hover:bg-gray-50 hover:text-gray-700",
                                                            "settings": {}
                                                        },
                                                        {
                                                            "id": "block-19",
                                                            "type": "link",
                                                            "content": {
                                                                "text": "Billing summary",
                                                                "href": "#"
                                                            },
                                                            "className": "block rounded-lg px-4 py-2 text-sm text-gray-500 hover:bg-gray-50 hover:text-gray-700",
                                                            "settings": {}
                                                        },
                                                        {
                                                            "id": "block-20",
                                                            "type": "link",
                                                            "content": {
                                                                "text": "Team settings",
                                                                "href": "#"
                                                            },
                                                            "className": "block rounded-lg px-4 py-2 text-sm text-gray-500 hover:bg-gray-50 hover:text-gray-700",
                                                            "settings": {}
                                                        },
                                                        {
                                                            "id": "block-21",
                                                            "type": "button",
                                                            "content": {
                                                                "text": "Logout"
                                                            },
                                                            "className": "flex w-full items-center gap-2 rounded-lg px-4 py-2 text-sm text-red-700 hover:bg-red-50",
                                                            "role": "menuitem",
                                                            "settings": {}
                                                        }
                                                    ]
                                                }
                                            ]
                                        },
                                        {
                                            "id": "block-22",
                                            "type": "text",
                                            "className": "block md:hidden",
                                            "settings": {},
                                            "content": [
                                                {
                                                    "id": "block-23",
                                                    "type": "button",
                                                    "content": {
                                                        "text": "Menu"
                                                    },
                                                    "className": "rounded bg-gray-100 p-2 text-gray-600 transition hover:text-gray-600/75",
                                                    "settings": {}
                                                }
                                            ]
                                        }
                                    ]
                                }
                            ]
                        }
                    ]
                }
            ]
        }
    ],
    isPublished: true,
    createdAt: new Date("2024-12-01T00:00:00Z"),
    updatedAt: new Date("2024-12-10T12:00:00Z"),
};
