import React, { useMemo } from "react";
import { type RecordProps } from "../../../providers/data/DataProvider";
import { inferColumns } from "./utils";
import { type GridColumn } from "./types";

type UseGridColumnsArgs<TRecord extends RecordProps> = {
    columns?: GridColumn<TRecord>[];
    records: TRecord[];
    form?: React.ReactElement | ((ctx: any) => React.ReactNode);
};

function useGridColumns<TRecord extends RecordProps>({
    columns,
    records,
    form,
}: UseGridColumnsArgs<TRecord>) {
    return useMemo(() => inferColumns(columns, records, form), [columns, form, records]);
}

export default useGridColumns;
