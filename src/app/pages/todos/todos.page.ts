import {Component, OnInit, ViewChild} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {
    IonButton,
    IonButtons,
    IonContent,
    IonHeader,
    IonIcon,
    IonInput,
    IonItem,
    IonItemOption,
    IonItemOptions,
    IonItemSliding,
    IonLabel,
    IonList,
    IonRefresher,
    IonRefresherContent,
    IonSkeletonText,
    IonTitle,
    IonToolbar,
    LoadingController
} from "@ionic/angular/standalone";
import {Router, RouterModule} from "@angular/router";
import {AuthService} from "../../services/auth.service";
import {addIcons} from 'ionicons';
import {logOutOutline, trashOutline, checkmarkCircleOutline, checkmarkOutline} from "ionicons/icons";
import {TodoService} from "../../services/todo.service";
import {Todo} from "../../services/constants";
import {Subscription} from 'rxjs';


@Component({
    selector: 'app-todos',
    templateUrl: './todos.page.html',
    styleUrls: ['./todos.page.scss'],
    standalone: true,
    imports: [CommonModule, FormsModule, IonHeader, IonToolbar, IonTitle, IonButtons,
        IonButton, IonIcon, IonContent, IonItem, IonInput, IonRefresher,
        IonRefresherContent, IonList, IonLabel, IonItemSliding, IonItemOptions,
        IonItemOption, IonSkeletonText, RouterModule]
})
export class TodosPage implements OnInit {
    task = '';
    loading = false;
    todos: Todo[] = [];
    subscription: Subscription = new Subscription();
    @ViewChild(IonList) list!: HTMLIonListElement;

    constructor(
        private authService: AuthService,
        private router: Router,
        private todoService: TodoService,
        private loadingController: LoadingController
    ) {
        addIcons({trashOutline, logOutOutline, checkmarkCircleOutline, checkmarkOutline})
    }

    ngOnInit() {
        this.loading = true;
        const sub = this.todoService.getTodos().subscribe((res) => {
            this.todos = res;
            console.log(res);
            this.loading = false;
        });

        this.subscription.add(sub);
    }

    async addTodo() {
        const newTodo = {
            task: this.task,
            private: true,
            desc: '',
        };

        const loading = await this.loadingController.create();
        await loading.present();

        this.todoService.createTodo(newTodo).subscribe({
            next: (res) => {
                console.log('after create: ', res);

                loading.dismiss();
                this.task = '';
                this.todos = [res, ...this.todos];
            },
            error: (err) => {
                loading.dismiss();
            },
        });
    }

    async logout() {
        await this.authService.signOut();
        this.router.navigateByUrl('/', {replaceUrl: true});
    }

    toggleCheck(todo: Todo) {
        todo.status = todo.status === 0 ? 1 : 0;
        this.todoService.updateTodo(todo).subscribe();
        this.list.closeSlidingItems();
    }

    reloadTodos(event: any) {
        this.todoService.getTodos().subscribe((res) => {
            this.todos = res;
            event.target.complete();
        });
    }


    remove(todo: Todo) {
        this.todoService.deleteTodo(todo._id).subscribe();
        this.todos = this.todos.filter((item) => item._id !== todo._id);
    }

    ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }
}
