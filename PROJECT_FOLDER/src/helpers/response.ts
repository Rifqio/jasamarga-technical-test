type DefaultResponse = {
    code: number;
    data: any;
    message: string;
};

export const defaultResponse = ({ data, message, code }: DefaultResponse) => {
    return {
        code,
        data,
        message
    };
};