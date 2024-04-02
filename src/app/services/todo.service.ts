import {inject, Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {API_URL, Todo} from "./constants";
import {map} from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class TodoService {
    private httpClient = inject(HttpClient)

    constructor() {
    }

    createTodo(todo: any) {
        return this.httpClient.post<Todo>(`${API_URL}/todos`, todo);
    }

    getTodos() {
        return this.httpClient.get<Todo[]>(`${API_URL}/todos/me`).pipe(
            map((todos) => {
                return todos.sort((a: Todo, b: Todo) => {
                    if (a.createdAt > b.createdAt) {
                        return -1;
                    } else {
                        return 1;
                    }
                });
            })
        );
    }

    updateTodo(todo: any) {
        return this.httpClient.put(`${API_URL}/todos/${todo._id}`, todo);
    }

    deleteTodo(id: string) {
        return this.httpClient.delete(`${API_URL}/todos/${id}`);
    }

    getTodoById(id: string) {
        return this.httpClient.get<Todo>(`${API_URL}/todos/${id}`);
    }

    uploadImage(id: string, file: Blob) {
        const data = new FormData();
        data.append('file', file);
        return this.httpClient.post<Todo>(`${API_URL}/todos/${id}/img`, data);
    }
}
