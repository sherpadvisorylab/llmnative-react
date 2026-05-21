import React from "react";
import { type RecordProps } from "../../providers/data/DataProvider";
import GridArray from "./grid-core/GridArray";
import GridDB from "./grid-core/GridDB";
import { type GridGatewayDBProps, type GridArrayProps, type GridProps } from "./grid-core/types";

function Grid<TRecord extends RecordProps = RecordProps>(props: GridProps<TRecord>) {
    if ("records" in props) {
        return <GridArray {...props as GridArrayProps<TRecord>} />;
    }

    return <GridDB {...props as GridGatewayDBProps<TRecord>} />;
}

export default Grid;
export type * from "./grid-core/types";
