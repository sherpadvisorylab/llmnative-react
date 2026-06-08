import React, { useMemo } from "react";
import { type RecordProps } from "../../../providers/data/DataProvider";
import { inferColumns } from "./utils";
import { type GridColumn, type GridFormContext } from "./types";

type UseGridColumnsArgs<TRecord extends RecordProps> = {
    columns?: GridColumn<TRecord>[];
    records: TRecord[];
    form?: React.ReactElement | ((ctx: GridFormContext<TRecord>) => React.ReactNode);
};

function useGridColumns<TRecord extends RecordProps>({
    columns,
    records,
    form,
}: UseGridColumnsArgs<TRecord>) {
    return useMemo(() => inferColumns(columns, records, form), [columns, form, records]);
}

export default useGridColumns;
