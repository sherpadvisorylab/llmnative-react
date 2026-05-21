import React from "react";
import { type RecordProps } from "../../../providers/data/DataProvider";
import GridCore from "./GridCore";
import { type GridArrayProps } from "./types";

function GridArray<TRecord extends RecordProps>(props: GridArrayProps<TRecord>) {
    return <GridCore {...props} />;
}

export default GridArray;
