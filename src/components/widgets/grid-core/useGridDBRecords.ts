import { type DatabaseOptions, type DataProviderError, type RecordProps } from "../../../providers/data/DataProvider";
import { useDataSubscription } from "../../../providers/data/useDataSubscription";

type UseGridDBRecordsArgs = {
    path?: string;
    where?: DatabaseOptions["where"];
    order?: DatabaseOptions["order"];
    fieldMap?: DatabaseOptions["fieldMap"];
};

/** The records of a `Grid` with `path`, live, and why they did not arrive (CR-129). */
function useGridDBRecords<TRecord extends RecordProps>({
    path,
    where,
    order,
    fieldMap,
}: UseGridDBRecordsArgs): { records: TRecord[]; error: DataProviderError | null } {
    const { records, error } = useDataSubscription(path, { where, order, fieldMap });
    return { records: records as TRecord[], error };
}

export default useGridDBRecords;
