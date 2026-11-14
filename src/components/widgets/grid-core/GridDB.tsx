import React from "react";
import { useLocation } from "react-router-dom";
import { type RecordProps, RECORD_KEY } from "../../../providers/data/DataProvider";
import GridCore from "./GridCore";
import { type GridDBProps } from "./types";
import useGridDBRecords from "./useGridDBRecords";
import { resolveGridPathFromUrl } from "./resolveGridPathFromUrl";
import { useI18nDictOrEnglish } from "../../../I18n";

function GridDB<TRecord extends RecordProps = RecordProps>({
    path,
    fromUrl,
    where,
    order,
    fieldMap,
    recordId = RECORD_KEY as keyof TRecord,
    ...rest
}: GridDBProps<TRecord>) {
    const location = useLocation();
    const resolvedPath = fromUrl
        ? resolveGridPathFromUrl(location.pathname)
        : path;
    const { records, error } = useGridDBRecords<TRecord>({ path: resolvedPath, where, order, fieldMap });
    const dict = useI18nDictOrEnglish();
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
            loadError={error ? dict.common.loadError : undefined}
            records={records}
            recordId={recordId}
            sourcePath={resolvedPath}
            sortable={resolvedSortable}
        />
    );
}

export default GridDB;
