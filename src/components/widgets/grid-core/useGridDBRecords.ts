import { useEffect, useMemo, useState } from "react";
import { type DatabaseOptions, type RecordArray, type RecordProps } from "../../../providers/data/DataProvider";
import { useDataProvider } from "../../../providers/data/DataProviderContext";

type UseGridDBRecordsArgs = {
    path?: string;
    where?: DatabaseOptions["where"];
    order?: DatabaseOptions["order"];
    fieldMap?: DatabaseOptions["fieldMap"];
};

function useGridDBRecords<TRecord extends RecordProps>({
    path,
    where,
    order,
    fieldMap,
}: UseGridDBRecordsArgs) {
    const db = useDataProvider();
    const [records, setRecords] = useState<RecordArray>([]);
    const options = useMemo<DatabaseOptions | undefined>(() => {
        if (!where && !order && !fieldMap) return undefined;
        return { where, order, fieldMap };
    }, [fieldMap, order, where]);

    useEffect(() => {
        return db.subscribe(path, setRecords, options);
    }, [db, options, path]);

    return records as TRecord[];
}

export default useGridDBRecords;
