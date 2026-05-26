import React from "react";
import { useLocation } from "react-router-dom";
import { type RecordProps } from "../../../providers/data/DataProvider";
import GridCore from "./GridCore";
import { type GridDBProps } from "./types";
import useGridDBRecords from "./useGridDBRecords";
import { resolveGridPathFromUrl } from "./resolveGridPathFromUrl";

function GridDB<TRecord extends RecordProps = RecordProps>({
    path,
    fromUrl,
    where,
    order,
    fieldMap,
    recordId = "_key" as keyof TRecord,
    ...rest
}: GridDBProps<TRecord>) {
    const location = useLocation();
    const resolvedPath = fromUrl
        ? resolveGridPathFromUrl(location.pathname)
        : path;
    const records = useGridDBRecords<TRecord>({ path: resolvedPath, where, order, fieldMap });
    const providerOrder = React.useMemo(() => {
        if (!order) return undefined;
        const firstEntry = Object.entries(order)[0];
        if (!firstEntry) return undefined;
        const [field, dir] = firstEntry;
        return { field, dir };
    }, [order]);
    const resolvedSortable = rest.sortable === undefined || rest.sortable === true
        ? (providerOrder ?? rest.sortable)
        : rest.sortable;

    return (
        <GridCore
            {...rest}
            records={records}
            recordId={recordId}
            sourcePath={resolvedPath}
            sortable={resolvedSortable}
        />
    );
}

export default GridDB;
