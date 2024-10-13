export const checkSWRIsLoadingMore = ({
    isLoading,
    size,
    data,
  }: {
    isLoading: boolean;
    size: number;
    data: any;
  }): boolean => {
    return (
      isLoading || (size > 0 && data && typeof data[size - 1] === "undefined")
    );
  };
  
  
  export const checkSWRReachEnd = ({
    error,
    data,
    pageSize,
  }: {
    error: any;
    data: any;
    pageSize: number;
  }) => {
    const result =  !!error || (data && data[data.length - 1]?.data.length < pageSize)
    return Boolean(result);
  };
  
  export function getSWRData<T>(data?: { data: T[]; nextCursor: string }[]): T[] {
    return data ? data.reduce((prev, curr) => [...prev, ...(curr?.data ?? [])], [] as T[]) : [];
  }