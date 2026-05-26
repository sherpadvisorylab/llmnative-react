import { useEffect, useState } from "react";
import { safeClone } from "../../../libs/utils";
import { type RecordProps } from "../../../providers/data/DataProvider";

type UseGridPreparedRecordsArgs<TRecord extends RecordProps> = {
    records: TRecord[];
    onLoad?: (records: TRecord[]) => TRecord[] | Promise<TRecord[]>;
};

function useGridPreparedRecords<TRecord extends RecordProps>({
    records,
    onLoad,
}: UseGridPreparedRecordsArgs<TRecord>) {
    const [preparedRecords, setPreparedRecords] = useState<TRecord[]>(records);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!onLoad) {
            setPreparedRecords(records);
            setLoading(false);
            return;
        }

        let active = true;
        const next = onLoad(safeClone(records));
        if (next instanceof Promise) {
            setLoading(true);
            next
                .then((resolved) => {
                    if (active) setPreparedRecords(resolved);
                })
                .finally(() => {
                    if (active) setLoading(false);
                });
            return () => {
                active = false;
            };
        }

        setPreparedRecords(next);
        setLoading(false);
    }, [records, onLoad]);

    return {
        preparedRecords,
        loading,
    };
}

export default useGridPreparedRecords;
