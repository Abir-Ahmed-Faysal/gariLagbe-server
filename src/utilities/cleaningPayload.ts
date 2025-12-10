export const cleanPayload =  (rowPayload: { [key: string]: any }) => {
    try {
        let payload: any = {};

        for (const key in rowPayload) {
            if (rowPayload[key] !== undefined) {
                payload[key] = rowPayload[key];
            }
        }

        return payload;
        
    } catch (error: any) {
        console.log(error);
        throw new Error("processing of cleaning payload error");
    }
};