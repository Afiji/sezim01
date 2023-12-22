// В вашем компоненте
import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchTodos } from "../../redux/slice/todosSlice";
import { Button } from "antd";
import * as XLSX from "xlsx";

const ExportToExcel = () => {
  const { todos, token } = useSelector((state) => state.todos);
  const dispatch = useDispatch();

  useEffect(() => {
    if (token) {
      dispatch(fetchTodos(token));
    }
  }, [dispatch, token]);

  const handleDownload = () => {
    const ws = XLSX.utils.json_to_sheet(todos);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Todos");
    XLSX.writeFile(wb, "todos.xlsx");
  };

  return <Button onClick={handleDownload}>Выгрузить в Excel</Button>;
};

export default ExportToExcel;
