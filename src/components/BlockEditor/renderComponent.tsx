import { Block } from "@/types";
import React from "react";

const componentFactory = (
    type: any,
    props: any,
    text: any,
    content?: any,
    style?: any,
    editable?: boolean
) => {
    return React.createElement(
        type,
        { ...props, style, contentEditable: editable },

        text,
        ...content.map((child: any) =>
            componentFactory(
                child.type,
                { ...child.props, className: child.className },
                child.text,
                child.content || [],
                child.style,
                child.editable
            )
        )
    );
};

const RenderPage = ({ blocks }: any) => {
    const renderBlocks = () => {
        return blocks.map((block: Block) => {
            const { type, content, settings, editable } = block;

            // Prepare common props
            const props: any = {
                id: block.id,
                className: block.className ? block.className : "",
                style: settings?.style || {},
                key: block.id,  // Add the key prop here
                children: content
            };

            // Add type-specific props
            if (type === "text" || type === "span") {
                props.text = block.text;
                // props.content = content.text;
            } else if (type === "image") {
                props.src = block.src;
                props.alt = block.alt || "";
            } else if (type === "a") {
                props.href = block.href;
                props.content = block.text;
                props.text = block.text;
                props.target = block.target || "_self";
            } else if (type === "button") {
                props.onClick = block.onClick;

                // props.content = content.text;
            }

            return componentFactory(
                type === "text"
                    ? "div"
                    : type === "span"
                        ? "span"
                        : type === "image"
                            ? "img"
                            : type === "a"
                                ? "a"
                                : type === "button"
                                    ? "button"
                                    : "div",
                { ...props, className: block.className },
                block.text,
                content ? content : [],
                settings.style,
                editable
            );
        });
    };

    return <div className="w-[100%] bg-gray p-4">
        {renderBlocks()}
    </div>;
};


export default RenderPage;
