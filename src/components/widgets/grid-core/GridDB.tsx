import React from "react";
import { type RecordProps } from "../../../providers/data/DataProvider";
import GridCore from "./GridCore";
import { type GridDBProps } from "./types";
import useGridDBRecords from "./useGridDBRecords";

function GridDB<TRecord extends RecordProps = RecordProps>({
    path,
    where,
    order,
    fieldMap,
    onLoad,
    recordId = "_key" as keyof TRecord,
    ...rest
}: GridDBProps<TRecord>) {
    const records = useGridDBRecords<TRecord>({ path, where, order, fieldMap, onLoad });

    return (
        <GridCore
            {...rest}
            records={records}
            recordId={recordId}
            sourcePath={path}
        />
    );
}

export default GridDB;
