
import { Block } from "@/types";
import React, { useCallback } from "react";

interface RenderPageProps {
    blocks: Block[];
    selectedBlockId: string | null;
    onBlockSelect: (id: string) => void;
    onBlockUpdate: (id: string, updates: Partial<Block>) => void;
}

const RenderPage: React.FC<RenderPageProps> = ({
    blocks,
    selectedBlockId,
    onBlockSelect,
    onBlockUpdate
}) => {
    const componentFactory = useCallback((
        type: string,
        props: any,
        text: string | undefined,
        content: any[],
        style?: any,
        editable?: boolean,
        blockId?: string
    ) => {
        const commonProps = {
            ...props,
            style,
            contentEditable: editable,
            onClick: (e: React.MouseEvent) => {
                e.stopPropagation();
                if (blockId) onBlockSelect(blockId);
            },
            className: `${props.className || ''} ${
                blockId && selectedBlockId === blockId ? 'ring-2 ring-blue-500' : ''
            }`
        };

        if (editable) {
            commonProps.onBlur = (e: React.FocusEvent<HTMLElement>) => {
                if (blockId) {
                    onBlockUpdate(blockId, { text: e.target.textContent || '' });
                }
            };
            commonProps.suppressContentEditableWarning = true;
        }

        return React.createElement(
            type,
            commonProps,
            text,
            ...content.map((child: any) =>
                componentFactory(
                    child.type,
                    { ...child.props, className: child.className },
                    child.text,
                    child.content || [],
                    child.style,
                    child.editable,
                    child.id
                )
            )
        );
    }, [selectedBlockId, onBlockSelect, onBlockUpdate]);

    const renderBlocks = useCallback(() => {
        return blocks.map((block: Block) => {
            const { type, content, settings, editable, id } = block;

            // Prepare common props
            const props: any = {
                id: block.id,
                className: block.className || "",
                style: settings?.style || {},
                key: block.id
            };

            // Add type-specific props
            if (type === "text" || type === "span") {
                props.text = block.text;
            } else if (type === "image") {
                props.src = block.src;
                props.alt = block.alt || "";
            } else if (type === "a") {
                props.href = block.href;
                props.target = block.target || "_self";
            }

            return componentFactory(
                type === "text" ? "div" : type,
                props,
                block.text,
                content || [],
                settings?.style,
                editable,
                id
            );
        });
    }, [blocks, componentFactory]);

    return (
        <div className="w-full bg-white p-4">
            {renderBlocks()}
        </div>
    );
};

export default RenderPage;
