export const getOrderByParams = <T>(queryParam: string | undefined) => {
    let arr: T[] = [];
    if (!queryParam) return arr;
    const result = queryParam.split(",");
    result.forEach((r) => {
    const [key, value] = r.split(":");
    arr.push({ [key]: value } as T);
    });
    return arr;
  };

  export const getCursorParams = <T>(queryParam: string | undefined) => {
    let obj: Partial<T> = {};
    if (!queryParam) return obj as T;
    // Split the cursor parameter by comma to get individual cursor instructions
    const result = queryParam.split(",");
    result.forEach((r) => {
        const [key, value] = r.split(":");
        obj[key as keyof T] = value as T[keyof T];
    });
    return obj as T;
  };

  export const getQueryParams = <T>(queryParam: string | undefined ) => {
    let obj: Partial<T> = {} ;
    if (!queryParam) return obj
      // Split the filter parameter by comma to get individual sort instructions
      const result = queryParam.split(",");
      result.forEach((r) => {
        // Split each instruction by colon to get key and value
        const [key, value] = r.split(":");
        obj[key as keyof T ] = value as T[keyof T];
      });
    return obj;
  };