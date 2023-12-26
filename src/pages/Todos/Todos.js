import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  fetchTodos,
  editTodoName,
  toggleTodoStatus,
  deleteTodo,
  createTodo,
  deleteAllTodos,
  uploadTodoImage,
  deleteTodoImage,
} from "../../redux/slice/todosSlice";
import { Table } from "antd";
import s from "./Todos.module.scss";
import { Button, Popconfirm, message } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import AlertMessage from "../../components/AlertMessage/AlertMessage";

const Todos = () => {
  const [messageApi, contextHolder] = message.useMessage();
  const { todos, status, error } = useSelector((state) => state.todos);
  const { token } = useSelector((state) => state.token);
  const dispatch = useDispatch();
  const [alert, setAlert] = useState({ message: null, type: null });

  useEffect(() => {
    if (alert.message) {
      const timer = setTimeout(() => {
        closeAlert();
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [alert]);

  const showAlert = (type, message) => {
    setAlert({ type, message });
  };

  const closeAlert = () => {
    setAlert({ message: null, type: null });
  };

  const handleCreateNewTodo = () => {
    const title = prompt("Введите название новой задачи:");
    if (title) {
      dispatch(createTodo({ title, token }));
      showAlert("success", "Новая задача успешно создана");
    }
  };

  const handleEditTodoName = async (todoId) => {
    const newName = prompt("Введите новое название задачи:");
    if (newName) {
      console.log({ todoId, newName, token });
      dispatch(editTodoName({ todoId, newName, token }));
      showAlert("success", "Имя задачи успешно обновлено");
    }
  };

  const handleToggleTodoStatus = (todoId, currentStatus) => {
    dispatch(toggleTodoStatus({ todoId, newStatus: !currentStatus, token }));
    showAlert("success", "Статус задачи сменен");
  };

  const handleDeleteTodo = (todoId) => {
    dispatch(deleteTodo({ todoId, token }));
    showAlert("error", "Задача была удалена");
  };

  const confirmDeleteAll = () => {
    dispatch(deleteAllTodos());
  };

  const handleUploadImage = async (todoId, file) => {
    if (file) {
      dispatch(uploadTodoImage({ todoId, file, token }));
    }
  };

  const handleDeleteImage = async (todoId) => {
    dispatch(deleteTodoImage({ todoId, token }));
  };

  useEffect(() => {
    if (token) {
      dispatch(fetchTodos(token));
    }
  }, [dispatch, token]);

  if (status === "loading") return <div>Loading...</div>;
  if (status === "failed") return <div>Error: {error}</div>;

  const generateColumns = () => {
    return [
      {
        title: "ID",
        dataIndex: "_id",
        key: "_id",
        width: 200,
        sorter: (a, b) => a._id.localeCompare(b._id),
        sortDirection: ["descend", "ascend"],
      },
      {
        title: "Название",
        dataIndex: "title",
        key: "title",
        width: 150,
        sorter: (a, b) => a.title.localeCompare(b.title),
        sortDirection: ["descend", "ascend"],
      },
      {
        title: "Создано",
        dataIndex: "createdAt",
        key: "createdAt",
        width: 150,
        sorter: (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
        sortDirection: ["descend", "ascend"],
      },
      {
        title: "Обновлено",
        dataIndex: "updatedAt",
        key: "updatedAt",
        width: 150,
        sorter: (a, b) => new Date(a.updatedAt) - new Date(b.updatedAt),
        sortDirection: ["descend", "ascend"],
      },
      {
        title: "Изображение",
        dataIndex: "imageUrl",
        key: "imageUrl",
        render: (text, record) => (
          <>
            {record.imageUrl ? (
              <div>
                <img
                  src={record.imageUrl}
                  alt="Todo"
                  style={{ width: "50px", height: "50px" }}
                />
                <Button onClick={() => handleDeleteImage(record._id)}>
                  Удалить изображение
                </Button>
              </div>
            ) : (
              <input
                type="file"
                onChange={(e) =>
                  handleUploadImage(record._id, e.target.files[0])
                }
              />
            )}
          </>
        ),
      },
      {
        title: "Статус",
        dataIndex: "status",
        key: "status",
        width: 100,
        sorter: (a, b) => {
          if (a.status === b.status) return 0;
          return a.status ? 1 : -1;
        },
        render: (status) => (status ? "Завершена" : "В процессе"),
      },
      {
        title: "Действия",
        key: "actions",
        render: (_, record) => (
          <>
            <Button
              onClick={() => handleEditTodoName(record._id)}
              type="primary"
            >
              Редактировать
            </Button>
            <Button
              onClick={() => handleToggleTodoStatus(record._id, record.status)}
              style={{ margin: "0 8px" }}
            >
              {record.status ? "Возобновить" : "Завершить"}
            </Button>
            <Popconfirm
              title="Вы уверены, что хотите удалить эту задачу?"
              onConfirm={() => handleDeleteTodo(record._id)}
              okText="Да"
              cancelText="Нет"
            >
              <Button type="danger">Удалить</Button>
            </Popconfirm>
          </>
        ),
        width: 300,
      },
    ];
  };

  return (
    <div>
      {Array.isArray(todos) && (
        <div>
          <h1>Список задач</h1>
          <div style={{ marginBottom: 16 }}>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={handleCreateNewTodo}
              className={s.createButton}
            >
              Создать задачу
            </Button>
            {/* <Popconfirm
              title="Вы уверены, что хотите удалить все задачи?"
              onConfirm={confirmDeleteAll}
              okText="Да"
              cancelText="Нет"
            >
              <Button type="primary">Удалить все задачи</Button>
            </Popconfirm> */}
          </div>
          <Table
            className={s.customTable}
            dataSource={todos}
            columns={generateColumns()}
            rowKey="_id"
            pagination={{
              pageSizeOptions: ["5", "10", "15", "20"],
              defaultPageSize: 5,
            }}
          />
        </div>
      )}
      <AlertMessage
        type={alert.type}
        message={alert.message}
        onClose={closeAlert}
      />
    </div>
  );
};

export default Todos;
