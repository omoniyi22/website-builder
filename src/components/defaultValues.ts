export const defaultValue = {
    slug: "string",
    content: [{
        id: "string",
        type: "text",
        content: {
            title: "This is a title"
        },
        settings: {
            width: 'wide',
            alignment: 'center',
            padding: 'normal',
            fontSize: 'large',
            fontWeight: 'bold',
            style: {
                backgroundColor: '#ffcc00',
                textColor: '#000',
                borderRadius: '8px',
                border: '2px solid #333',
            },
        },
    }],
    isPublished: true,
    createdAt: Date(),
    updatedAt: Date(),
    urlPrefix: "string",
}