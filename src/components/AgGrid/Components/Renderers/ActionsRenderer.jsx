import React, {
  useState,
  useEffect,
  forwardRef,
  useImperativeHandle,
  useMemo,
} from "react";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { DataStore } from "aws-amplify";
import { Risks } from "../../../../models";
//import { useAuth } from "util/use-auth";

const MySwal = withReactContent(Swal);
export default forwardRef((props, ref) => {
  // let [editing, setEditing] = useState(props.value === true);
  const [value, setValue] = useState(false);
  //const { authUser } = useAuth();
  // custom hook
  //const [addFlag, setAddFlag] = useState(false);
  const editing = useMemo(() => {
    return props.value === true
  }, [props.value])

  useEffect(() => {
    document.addEventListener("editStarted", onRowEditingStarted);
    props.api.addEventListener("rowEditingStopped", onRowEditingStopped);

    return () => {
      document.removeEventListener("editStarted", onRowEditingStarted);
      props.api.removeEventListener("rowEditingStopped", onRowEditingStopped);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const addRow = async () => {
    if(props?.colDef?.cellEditorParams?.addRows) {      
      props.node.setDataValue('status', 'new')
      props.node.setDataValue('riskType', 'Technology')
      props.colDef.cellEditorParams.addRows(props);
      //setAddFlag(true);
    } else {
      window.alert('No possible add Row')
    }
  };

  const onRowEditingStarted = (e) => {
    const { params } = e.detail;

    if (props.rowIndex === params.rowIndex) {
      props.setValue(true);
      props.api.startEditingCell({
        rowIndex: props.rowIndex,
        colKey: props.column.colId,
      });
    }
  };

  const onRowEditingStopped = (params) => {
    if(params.rowIndex === props.rowIndex) {
      props.setValue(false)
    }    
  };

  function startEditing() {
    props.api.startEditingCell({
      rowIndex: props.rowIndex,
      colKey: props.column.colId,
    });    
  }

  function stopUpdate(bool) {
    props.api.stopEditing(false);
  }

  async function deleteRow(force = false) {
    const result = await MySwal.fire({
      title: "Are you sure?",
      text: "You are about to delete!",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "No, keep it",
      confirmButtonColor: "#f6a117",
      cancelButtonColor: "#999",
    }).then((result) => {
      return result;
    });

    if (result.value) {
      props.api.updateRowData({ remove: [props.data] });
      await DataStore.delete(Risks, props.data.id);
      MySwal.fire({
        title: "Deleted!",
        text: "It is deleted.",
        icon: "success",
        confirmButtonColor: "#f6a117",
        cancelButtonColor: "#999",
      });
    } else {
      MySwal.fire({
        title: "Cancelled",
        text: "It is safe :)",
        icon: "error",
        confirmButtonColor: "#f6a117",
        cancelButtonColor: "#999",
      });
    }
  }

  useImperativeHandle(ref, () => {
    return {
      getValue: () => {
        return value;
      },
      afterGuiAttached: () => {
        setValue(props.value);
      },
    };
  });

  return (
    <div>
      {!props.data.riskId ? (
        <>
          <button color="primary" variant="contained" onClick={addRow}>
            Add
          </button>
        </>
      ) : (
        <>
          {!editing ? (
            <>
              <button color="primary" variant="outlined" onClick={startEditing}>
                Edit
              </button>
              <button
                color="secondary"
                variant="outlined"
                onClick={() => deleteRow()}
              >
                Delete
              </button>
            </>
          ) : (
            <>
              <button
                color="primary"
                variant="outlined"
                onClick={() => stopUpdate(false)}
              >
                Save
              </button>
              <button
                color="secondary"
                variant="outlined"
                onClick={() => deleteRow()}
              >
                Delete
              </button>
            </>
          )}
        </>
      )}
    </div>
  );
});
