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
            "type": "div",
            "className": "bg-white ",
            "settings": {},
            "content": [
                {
                    "type": "div",
                    "id": "block-2",
                    "className": "mx-auto px-4 sm:px-6 lg:px-8 min-w-[100%] ",
                    "settings": {},
                    "content": [

                        {
                            "id": "block-3",
                            "type": "div",
                            "className": "flex h-16 items-center justify-between",
                            "settings": {},
                            "content": [
                                {
                                    "id": "block-4",
                                    "type": "div",
                                    "className": "flex md:flex md:items-center md:gap-12",
                                    "settings": {},
                                    "content": [
                                        {
                                            "id": "block-5",
                                            "type": "a",
                                            "text": "Untitled Site",
                                            "editable": true,
                                            "href": "#",
                                            "content": [
                                            ],
                                            "className": "cursor-pointer line-clamp-2 whitespace-nowrap min-w-[45%] max-w-[170px] border-b border-[black] border-b-2 pb-1 border-b-black text-black",
                                            "settings": {
                                                "srOnly": true
                                            }
                                        }
                                    ]
                                },
                                {
                                    "id": "block-6",
                                    "type": "div",
                                    "className": "md:flex md:items-center md:gap-12 ml-auto  max-w-fit items-right px-0 w-[fit-content]",
                                    "settings": {},
                                    "content": [
                                        {
                                            "id": "block-7",
                                            "type": "menu",
                                            "settings": {
                                                "ariaLabel": "Global"
                                            },
                                            "className": "hidden md:block ml-auto",
                                            "content": [
                                                {
                                                    "id": "block-8",
                                                    "type": "div",
                                                    "className": "flex items-center gap-6 text-sm ml-auto",
                                                    "settings": {},
                                                    "content": [

                                                        {
                                                            "id": "block-9",
                                                            "type": "a",
                                                            "text": "About",
                                                            "href": "#",
                                                            "content": [
                                                            ],
                                                            "className": " cursor-pointer  text-gray-500 transition hover:text-gray-500/75 ml-auto",
                                                            "settings": {}
                                                        },
                                                        {
                                                            "id": "block-10",
                                                            "type": "a",
                                                            "text": "Careers",
                                                            "href": "#",
                                                            "content": [
                                                            ],
                                                            "className": " cursor-pointer  text-gray-500 transition hover:text-gray-500/75",
                                                            "settings": {}
                                                        },
                                                        {
                                                            "id": "block-11",
                                                            "type": "a",
                                                            "text": "History",
                                                            "href": "#",
                                                            "content": [
                                                            ],
                                                            "className": " cursor-pointer  text-gray-500 transition hover:text-gray-500/75",
                                                            "settings": {}
                                                        },
                                                        {
                                                            "id": "block-12",
                                                            "type": "a",
                                                            "text": "Services",
                                                            "href": "#",
                                                            "content": [
                                                            ],
                                                            "className": " cursor-pointer  text-gray-500 transition hover:text-gray-500/75",
                                                            "settings": {}
                                                        },
                                                        {
                                                            "id": "block-13",
                                                            "type": "a",
                                                            "text": "Projects",
                                                            "href": "#",
                                                            "content": [
                                                            ],
                                                            "className": " cursor-pointer  text-gray-500 transition hover:text-gray-500/75",
                                                            "settings": {}
                                                        },
                                                        {
                                                            "id": "block-14",
                                                            "type": "a",
                                                            "text": "Blog",
                                                            "href": "#",
                                                            "content": [
                                                            ],
                                                            "className": " cursor-pointer  text-gray-500 transition hover:text-gray-500/75",
                                                            "settings": {}
                                                        }
                                                    ]
                                                }
                                            ]
                                        },
                                        // {
                                        //     "id": "block-15",
                                        //     "type": "div",
                                        //     "className": "hidden md:relative md:block",
                                        //     "settings": {},
                                        //     "content": [
                                        //         {
                                        //             "id": "block-16",
                                        //             "type": "button",
                                        //             "ariaLabel": "Toggle dashboard menu",
                                        //             "imgSrc": "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=1770&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
                                        //             "altText": "",
                                        //             "content": [
                                        //             ],
                                        //             "className": "overflow-hidden rounded-full  -gray-300 shadow-inner",
                                        //             "settings": {}
                                        //         },
                                        //         {
                                        //             "id": "block-17",
                                        //             "type": "menu",
                                        //             "settings": {
                                        //                 "className": "absolute end-0 z-10 mt-0.5 w-56 textide-y textide-gray-100 rounded-md  -gray-100 bg-white shadow-lg",
                                        //                 "role": "menu"
                                        //             },
                                        //             "content": [
                                        //             ]
                                        //         }
                                        //     ]
                                        // },
                                        // {
                                        //     "id": "block-22",
                                        //     "type": "div",
                                        //     "className": "block md:hidden",
                                        //     "settings": {},
                                        //     "content": [
                                        //         {
                                        //             "id": "block-23",
                                        //             "type": "button",
                                        //             "text": "Menu",
                                        //             "content": [
                                        //             ],
                                        //             "className": "rounded bg-gray-100 p-2 text-gray-600 transition hover:text-gray-600/75",
                                        //             "settings": {}
                                        //         }
                                        //     ]
                                        // }
                                    ]
                                }
                            ]
                        }
                    ]
                },
                {
                    type: "div",
                    className: "flex items-center justify-center bg-black text-white h-72 py-5",
                    content: [
                        {
                            "editable": true,
                            type: "div",
                            className: "text-5xl text-center line-clamp-2 max-w-[500px]",
                            text: "This is a large header text"

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
