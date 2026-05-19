import React from "react";
import Grid from "../components/widgets/Grid";
import {String, Email} from "../components/ui/fields/Input";
import {Select} from "../components/ui/fields/Select";
import { RecordProps } from "../providers/data/DataProvider";

function Users() {
  return (
    <Grid
        providerPath={"/users"}
        createRecordKey={(record: RecordProps) => record.email.replace('@', '-')}
        editor={{
          form: (
            <>
              <String name={"username"}
                      label={"Username"}
              />
              <Email name={"email"}
                    label={"Email"}
                    required={true}
                    updatable={false}
              />
              <Select name={"permission"}
                      label={"Permission"}
                      options={[
                          {value: "admin", label: "Admin"},
                          {value: "user", label: "User"},
                      ]}
                      required={true}
              />
            </>
          )
        }}
    />
  );
}

export default Users;
