import React, { FC, useMemo, useState } from "react";
import { Box, Button, Checkbox, Header, Icon, Input, Page, Text } from "zmp-ui";
import { useLocalStorage } from "hooks";
import { Todo, TodoFilter } from "types/todo";

const FILTERS: { key: TodoFilter; label: string }[] = [
  { key: "all", label: "Tất cả" },
  { key: "active", label: "Đang làm" },
  { key: "done", label: "Hoàn thành" },
];

const TodoPage: FC = () => {
  const [todos, setTodos] = useLocalStorage<Todo[]>("todos", []);
  const [filter, setFilter] = useState<TodoFilter>("all");
  const [text, setText] = useState("");

  const remaining = todos.filter((t) => !t.done).length;
  const doneCount = todos.length - remaining;

  const visible = useMemo(
    () =>
      todos.filter((t) =>
        filter === "all" ? true : filter === "done" ? t.done : !t.done
      ),
    [todos, filter]
  );

  const addTodo = () => {
    const title = text.trim();
    if (!title) return;
    setTodos([
      { id: String(Date.now()), title, done: false, createdAt: Date.now() },
      ...todos,
    ]);
    setText("");
  };

  const toggle = (id: string) =>
    setTodos(todos.map((t) => (t.id === id ? { ...t, done: !t.done } : t)));

  const remove = (id: string) => setTodos(todos.filter((t) => t.id !== id));

  const clearDone = () => setTodos(todos.filter((t) => !t.done));

  return (
    <Page className="flex-1 flex flex-col bg-white">
      <Header showBackIcon={false} title="Việc cần làm" />

      <Box className="p-4 space-y-3">
        <Box flex className="space-x-2">
          <Box className="flex-1">
            <Input
              placeholder="Thêm việc mới..."
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addTodo()}
            />
          </Box>
          <Button onClick={addTodo} disabled={!text.trim()}>
            Thêm
          </Button>
        </Box>

        <Box flex className="space-x-2">
          {FILTERS.map((f) => (
            <Button
              key={f.key}
              size="small"
              variant={filter === f.key ? "primary" : "secondary"}
              onClick={() => setFilter(f.key)}
            >
              {f.label}
            </Button>
          ))}
        </Box>
      </Box>

      <Box className="flex-1 overflow-auto px-4">
        {visible.length === 0 ? (
          <Box className="text-center py-12">
            <Text className="text-gray">
              {todos.length === 0
                ? "Chưa có việc nào. Hãy thêm việc đầu tiên!"
                : "Không có việc nào trong mục này."}
            </Text>
          </Box>
        ) : (
          visible.map((t) => (
            <Box
              key={t.id}
              flex
              alignItems="center"
              className="py-3 border-b border-divider space-x-3"
            >
              <Checkbox checked={t.done} onChange={() => toggle(t.id)} />
              <Box className="flex-1 min-w-0">
                <Text
                  className={t.done ? "line-through text-gray" : ""}
                  style={{ wordBreak: "break-word" }}
                >
                  {t.title}
                </Text>
              </Box>
              <Box className="p-1" onClick={() => remove(t.id)}>
                <Icon icon="zi-delete" className="text-gray" />
              </Box>
            </Box>
          ))
        )}
      </Box>

      <Box
        flex
        alignItems="center"
        justifyContent="space-between"
        className="p-4 border-t border-divider"
      >
        <Text size="small" className="text-gray">
          Còn {remaining} việc chưa xong
        </Text>
        {doneCount > 0 && (
          <Button size="small" variant="tertiary" onClick={clearDone}>
            Xóa đã xong ({doneCount})
          </Button>
        )}
      </Box>
    </Page>
  );
};

export default TodoPage;
